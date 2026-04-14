<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useBuilderChat } from '@/composables/useBuilderChat'
import { useCodePreview } from '@/composables/useCodePreview'

const { messages, userInput, isStreaming, chatContainer, sendMessage, handleKeydown } = useBuilderChat()
const { activeTab, canvasOpen, generatedCode, toolName, hasCode, previewHtml } = useCodePreview(messages)

const previewFrame = ref<HTMLIFrameElement | null>(null)

const suggestions = [
  'A color palette generator',
  'A word counter with reading time',
  'A QR code generator',
  'A JSON formatter and validator',
]
</script>

<template>
  <div class="flex h-screen flex-col bg-bg-primary">
    <div class="flex flex-1 overflow-hidden">

      <!-- Chat pane -->
      <div
        class="flex flex-col transition-all duration-300"
        :class="canvasOpen ? 'w-[30%] border-r border-border-subtle' : 'w-full'"
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
          <button
            v-if="!canvasOpen && hasCode"
            @click="canvasOpen = true"
            class="ml-auto flex items-center gap-1.5 rounded-lg bg-bg-surface border border-border-card px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Show Preview
          </button>
        </div>

        <!-- Chat messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- Empty state -->
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-6">
            <h2 class="text-xl font-bold text-text-primary mb-2">What do you want to build?</h2>
            <p class="text-sm text-text-secondary max-w-md mb-6">
              Describe your tool idea and I'll build it for you. Be specific about inputs, outputs, and how it should work.
            </p>
            <div class="flex flex-wrap justify-center gap-2 max-w-lg">
              <button
                v-for="s in suggestions"
                :key="s"
                @click="userInput = s"
                class="rounded-full border border-border-card bg-bg-surface px-3.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
              >
                {{ s }}
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
            <div v-if="msg.role === 'assistant'" class="shrink-0 mt-0.5">
              <div class="h-7 w-7 rounded-lg bg-accent-lime/20 flex items-center justify-center">
                <span class="text-[10px] font-bold text-accent-lime">G</span>
              </div>
            </div>
            <div
              class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              :class="msg.role === 'user'
                ? 'bg-accent-lime text-bg-primary rounded-br-md'
                : 'bg-bg-card border border-border-card text-text-primary rounded-bl-md'"
            >
              <!-- Streaming: show loading indicator -->
              <div v-if="isStreaming && i === messages.length - 1 && msg.role === 'assistant'" class="flex items-center gap-2 text-text-secondary">
                <span class="flex gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent-lime animate-bounce [animation-delay:0ms]" />
                  <span class="w-1.5 h-1.5 rounded-full bg-accent-lime animate-bounce [animation-delay:150ms]" />
                  <span class="w-1.5 h-1.5 rounded-full bg-accent-lime animate-bounce [animation-delay:300ms]" />
                </span>
                <span class="text-text-muted">Building your tool...</span>
              </div>
              <!-- Done: show clean message -->
              <pre v-else class="whitespace-pre-wrap font-[Outfit] break-words">{{ msg.content }}</pre>
            </div>
          </div>
        </div>

        <!-- Input -->
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

      <!-- Canvas pane -->
      <div
        :style="{ display: canvasOpen ? '' : 'none' }"
        class="flex flex-1 flex-col bg-bg-primary max-md:hidden min-w-0 overflow-hidden"
      >
        <!-- Canvas header -->
        <div class="flex h-12 shrink-0 items-center gap-2 border-b border-border-subtle px-3">
          <span class="text-sm font-semibold text-text-primary truncate min-w-0 hidden lg:block max-w-[200px]">{{ toolName }}</span>

          <div class="flex items-center gap-1.5 ml-auto shrink-0">
            <div class="flex rounded-lg bg-bg-surface p-0.5">
              <button
                @click="activeTab = 'code'"
                class="rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap"
                :class="activeTab === 'code' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
              >
                Code
              </button>
              <button
                @click="activeTab = 'preview'"
                class="rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap"
                :class="activeTab === 'preview' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
              >
                Preview
              </button>
            </div>

            <button
              class="rounded-lg border border-border-card px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors whitespace-nowrap"
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
          <div v-show="activeTab === 'code'" class="h-full">
            <div v-if="generatedCode" class="h-full overflow-auto">
              <div class="flex min-h-full">
                <div class="shrink-0 select-none border-r border-border-subtle px-3 py-4 text-right text-xs leading-relaxed text-text-muted font-mono">
                  <div v-for="(_, n) in generatedCode.split('\n')" :key="n">{{ n + 1 }}</div>
                </div>
                <pre class="flex-1 overflow-x-auto p-4 text-sm text-text-primary font-mono leading-relaxed"><code>{{ generatedCode }}</code></pre>
              </div>
            </div>
            <div v-else class="flex h-full items-center justify-center">
              <p class="text-sm text-text-muted">Code will appear here as it's generated</p>
            </div>
          </div>

          <!-- Preview view -->
          <div v-show="activeTab === 'preview'" class="h-full">
            <div v-if="generatedCode && !isStreaming" class="h-full">
              <iframe
                ref="previewFrame"
                :srcdoc="previewHtml"
                sandbox="allow-scripts"
                class="h-full w-full border-0"
              />
            </div>
            <div v-else-if="isStreaming" class="flex h-full items-center justify-center">
              <p class="text-sm text-text-muted animate-pulse">Generating... preview will appear when done</p>
            </div>
            <div v-else class="flex h-full items-center justify-center">
              <p class="text-sm text-text-muted">Preview will appear after code is generated</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
