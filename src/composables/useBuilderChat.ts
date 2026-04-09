import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
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

  async function sendMessage() {
    const text = userInput.value.trim()
    if (!text || isStreaming.value) return

    messages.value.push({ role: 'user', content: text })
    userInput.value = ''
    scrollToBottom()

    isStreaming.value = true
    messages.value.push({ role: 'assistant', content: '' })

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (authToken.value) {
        headers['Authorization'] = `Bearer ${authToken.value}`
      }

      const response = await fetch(
        (import.meta.env.VITE_API_BASE_URL || '/v3') + '/tools/builder/chat',
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            messages: messages.value.slice(0, -1),
          }),
        }
      )

      if (!response.ok || !response.body) {
        messages.value[messages.value.length - 1].content = 'Something went wrong. Please try again.'
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        messages.value[messages.value.length - 1].content += chunk
        scrollToBottom()
      }
    } catch {
      messages.value[messages.value.length - 1].content = 'Failed to connect. Is the server running?'
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

  onMounted(() => {
    authToken.value = resolveAuthToken()

    // Re-check token if it arrives after mount (from parent postMessage)
    window.addEventListener('storage', () => {
      if (!authToken.value) {
        authToken.value = resolveAuthToken()
      }
    })

    // Auto-send prompt from query param
    const prompt = route.query.prompt as string | undefined
    if (prompt?.trim()) {
      userInput.value = prompt.trim()
      nextTick(() => sendMessage())
    }
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
