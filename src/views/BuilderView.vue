<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isStreaming = ref(false)
const activeTab = ref<'code' | 'preview'>('code')
const chatContainer = ref<HTMLElement | null>(null)
const canvasOpen = ref(false)
const route = useRoute()

// Auto-send prompt from query param (e.g. /create?prompt=A QR code generator)
onMounted(() => {
  const prompt = route.query.prompt as string | undefined
  if (prompt?.trim()) {
    userInput.value = prompt.trim()
    nextTick(() => sendMessage())
  }
})

// Extract tool name from the generated code's toolMeta
const toolName = computed(() => {
  const code = generatedCode.value
  if (!code) return 'Untitled Tool'
  const match = code.match(/name:\s*['"](.+?)['"]/)
  return match ? match[1] : 'Untitled Tool'
})

// Extract the last Vue SFC code block from assistant messages
const generatedCode = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i]
    if (msg.role === 'assistant') {
      const match = msg.content.match(/```vue\s*\n([\s\S]*?)```/)
      if (match) return match[1].trim()
    }
  }
  return ''
})

// Auto-open canvas when code is first generated
const hasCode = computed(() => generatedCode.value.length > 0)

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
    const response = await fetch(
      (import.meta.env.VITE_API_BASE_URL || '/v3') + '/tools/builder/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      // Auto-open canvas panel when code starts streaming
      if (!canvasOpen.value && chunk.includes('```vue')) {
        canvasOpen.value = true
        activeTab.value = 'code'
      }
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
</script>

<template>
  <div class="flex h-screen flex-col bg-bg-primary">
    <!-- Main layout -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Chat pane — full width when canvas closed, narrower when open -->
      <div
        class="flex flex-col transition-all duration-300"
        :class="canvasOpen ? 'w-[400px] lg:w-[460px] border-r border-border-subtle' : 'w-full'"
      >
        <!-- Chat header -->
        <div class="flex h-12 shrink-0 items-center gap-3 border-b border-border-subtle px-4">
          <RouterLink to="/" class="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </RouterLink>
          <div class="h-4 w-px bg-border-subtle" />
          <div class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-lg bg-accent-lime/20 flex items-center justify-center">
              <span class="text-xs">G</span>
            </div>
            <span class="text-sm font-semibold text-text-primary">Glitchy AI</span>
          </div>
        </div>

        <!-- Chat messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- Empty state — centered prompt -->
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-6">
            <h2 class="text-xl font-bold text-text-primary mb-2">What do you want to build?</h2>
            <p class="text-sm text-text-secondary max-w-md mb-6">
              Describe your tool idea and I'll build it for you. Be specific about inputs, outputs, and how it should work.
            </p>
            <!-- Suggestion chips -->
            <div class="flex flex-wrap justify-center gap-2 max-w-lg">
              <button
                v-for="suggestion in [
                  'A color palette generator',
                  'A word counter with reading time',
                  'A QR code generator',
                  'A JSON formatter and validator',
                ]"
                :key="suggestion"
                @click="userInput = suggestion"
                class="rounded-full border border-border-card bg-bg-surface px-3.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="flex gap-3"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Assistant avatar -->
            <div v-if="msg.role === 'assistant'" class="shrink-0 mt-0.5">
              <div class="h-7 w-7 rounded-lg bg-accent-lime/20 flex items-center justify-center">
                <span class="text-[10px] font-bold text-accent-lime">G</span>
              </div>
            </div>

            <div
              class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              :class="
                msg.role === 'user'
                  ? 'bg-accent-lime text-bg-primary rounded-br-md'
                  : 'bg-bg-card border border-border-card text-text-primary rounded-bl-md'
              "
            >
              <pre class="whitespace-pre-wrap font-[Outfit] break-words">{{ msg.content }}<span v-if="isStreaming && i === messages.length - 1 && msg.role === 'assistant'" class="inline-block w-1.5 h-4 bg-text-primary animate-pulse ml-0.5 align-middle" /></pre>
            </div>
          </div>
        </div>

        <!-- Input area -->
        <div class="shrink-0 border-t border-border-subtle p-3">
          <div class="relative">
            <textarea
              v-model="userInput"
              @keydown="handleKeydown"
              :disabled="isStreaming"
              rows="3"
              :placeholder="messages.length === 0 ? 'Describe the tool you want to build...' : 'Ask for changes...'"
              class="w-full resize-none rounded-xl border border-border-card bg-bg-surface px-4 py-3 pr-14 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow disabled:opacity-50"
            />
            <button
              @click="sendMessage"
              :disabled="!userInput.trim() || isStreaming"
              class="absolute bottom-3 right-3 rounded-lg bg-accent-lime p-2 text-bg-primary hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Canvas pane — slides in when code is generated (Gemini-style) -->
      <div
        v-if="canvasOpen"
        class="hidden flex-1 flex-col md:flex bg-bg-primary"
      >
        <!-- Canvas header -->
        <div class="flex h-12 shrink-0 items-center justify-between border-b border-border-subtle px-4">
          <div class="flex items-center gap-3">
            <!-- Tool icon + name -->
            <div class="flex items-center gap-2">
              <span class="text-base">🛠️</span>
              <span class="text-sm font-semibold text-text-primary">{{ toolName }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Code / Preview toggle -->
            <div class="flex rounded-lg bg-bg-surface p-0.5">
              <button
                @click="activeTab = 'code'"
                class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                :class="activeTab === 'code' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
              >
                Code
              </button>
              <button
                @click="activeTab = 'preview'"
                class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                :class="activeTab === 'preview' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
              >
                Preview
              </button>
            </div>

            <!-- Actions -->
            <div class="h-4 w-px bg-border-subtle" />
            <button
              v-if="hasCode"
              class="rounded-lg border border-border-card px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
            >
              Submit for Review
            </button>
            <button
              @click="canvasOpen = false"
              class="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Canvas content -->
        <div class="flex-1 overflow-auto">
          <!-- Code view -->
          <div v-if="activeTab === 'code'" class="h-full">
            <div v-if="generatedCode" class="h-full overflow-auto">
              <!-- Line numbers + code -->
              <div class="flex min-h-full">
                <div class="shrink-0 select-none border-r border-border-subtle px-3 py-4 text-right text-xs leading-relaxed text-text-muted font-mono">
                  <div v-for="(_, n) in generatedCode.split('\n')" :key="n">{{ n + 1 }}</div>
                </div>
                <pre class="flex-1 overflow-x-auto p-4 text-sm text-text-primary font-mono leading-relaxed"><code>{{ generatedCode }}</code></pre>
              </div>
            </div>
            <div v-else class="flex h-full items-center justify-center">
              <div class="text-center">
                <div class="h-12 w-12 rounded-xl bg-bg-surface flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <p class="text-sm text-text-muted">Code will appear here as it's generated</p>
              </div>
            </div>
          </div>

          <!-- Preview -->
          <div v-if="activeTab === 'preview'" class="flex h-full items-center justify-center">
            <div class="text-center">
              <div class="h-12 w-12 rounded-xl bg-bg-surface flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <p class="text-sm text-text-muted">Live preview coming soon</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
