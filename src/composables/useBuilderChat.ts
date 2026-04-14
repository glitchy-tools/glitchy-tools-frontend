import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  /** Full raw response from Claude (assistant only) — used for code extraction */
  rawContent?: string
}

/** Extract a clean display message from Claude's raw response */
function cleanAssistantMessage(raw: string): string {
  // If there's a code block, show a short summary instead of the whole response
  const hasCode = raw.includes('```vue') || (raw.includes('```') && raw.includes('<template'))
  if (hasCode) {
    // Extract tool name if present
    const nameMatch = raw.match(/name:\s*['"](.+?)['"]/)
    const toolName = nameMatch ? nameMatch[1] : 'your tool'
    return `Built ${toolName}. Check the preview panel to see it in action. Ask me to make changes if needed.`
  }

  // If it's an error from Claude API
  if (raw.startsWith('\n\n[Error:')) return raw

  // For non-code responses, show as-is (e.g. clarifying questions)
  return raw
}

export function useBuilderChat() {
  const messages = ref<ChatMessage[]>([])
  const userInput = ref('')
  const isStreaming = ref(false)
  const chatContainer = ref<HTMLElement | null>(null)
  const authToken = ref<string | null>(null)
  const route = useRoute()

  function resolveAuthToken(): string | null {
    return localStorage.getItem('glitchy_token')
  }

  function scrollToBottom() {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }

  function errorMessageForStatus(status: number): string {
    if (status === 401) return 'You need to be logged in to use the AI builder.'
    if (status === 429) return 'Too many requests. Please wait a moment and try again.'
    if (status >= 500) return 'Server error. Please try again later.'
    return 'Something went wrong. Please try again.'
  }

  async function sendMessage() {
    const text = userInput.value.trim()
    if (!text || isStreaming.value) return

    authToken.value = resolveAuthToken()

    messages.value.push({ role: 'user', content: text })
    userInput.value = ''
    scrollToBottom()

    isStreaming.value = true
    messages.value.push({ role: 'assistant', content: '', rawContent: '' })

    const lastIdx = messages.value.length - 1

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (authToken.value) {
        headers['Authorization'] = `Bearer ${authToken.value}`
      }

      // Send conversation history using rawContent for assistant messages
      const history = messages.value.slice(0, -1).map(m => ({
        role: m.role,
        content: m.role === 'assistant' ? (m.rawContent || m.content) : m.content,
      }))

      const response = await fetch(
        (import.meta.env.VITE_API_BASE_URL || '/v3') + '/tools/builder/chat',
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ messages: history }),
        }
      )

      if (!response.ok || !response.body) {
        messages.value[lastIdx].content = errorMessageForStatus(response.status)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let rawBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        rawBuffer += decoder.decode(value, { stream: true })
        messages.value[lastIdx] = { role: 'assistant', content: '', rawContent: rawBuffer }
        scrollToBottom()
      }

      // Stream done — set clean display message
      messages.value[lastIdx] = {
        role: 'assistant',
        content: cleanAssistantMessage(rawBuffer),
        rawContent: rawBuffer,
      }
    } catch {
      messages.value[lastIdx].content = 'Failed to connect. Is the server running?'
    } finally {
      isStreaming.value = false
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function onStorageChange() {
    authToken.value = resolveAuthToken()
  }

  onMounted(() => {
    authToken.value = resolveAuthToken()
    window.addEventListener('storage', onStorageChange)

    const prompt = route.query.prompt as string | undefined
    if (prompt?.trim()) {
      userInput.value = prompt.trim()
      nextTick(() => sendMessage())
    }
  })

  onUnmounted(() => {
    window.removeEventListener('storage', onStorageChange)
  })

  return {
    messages,
    userInput,
    isStreaming,
    chatContainer,
    sendMessage,
    handleKeydown,
  }
}
