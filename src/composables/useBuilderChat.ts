import { ref, onMounted, onUnmounted, nextTick } from 'vue'
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

  function errorMessageForStatus(status: number): string {
    if (status === 401) return 'You need to be logged in to use the AI builder.'
    if (status === 429) return 'Too many requests. Please wait a moment and try again.'
    if (status >= 500) return 'Server error. Please try again later.'
    return 'Something went wrong. Please try again.'
  }

  async function sendMessage() {
    const text = userInput.value.trim()
    if (!text || isStreaming.value) return

    // Refresh token before each request in case it arrived via postMessage
    authToken.value = resolveAuthToken()

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
        messages.value[messages.value.length - 1].content = errorMessageForStatus(response.status)
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

  // Always refresh token on storage changes (parent postMessage sets localStorage)
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
