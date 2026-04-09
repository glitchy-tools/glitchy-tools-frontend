<script setup lang="ts">
import { ref, nextTick, computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isStreaming = ref(false)
const activeTab = ref<'code' | 'preview'>('preview')
const chatContainer = ref<HTMLElement | null>(null)
const canvasOpen = ref(false)
const previewFrame = ref<HTMLIFrameElement | null>(null)
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
  const codeBlockPattern = /```(?:vue)?\s*\n([\s\S]*?)```/
  for (let i = messages.value.length - 1; i >= 0; i--) {
    const msg = messages.value[i]
    if (msg.role === 'assistant') {
      const match = msg.content.match(codeBlockPattern)
      if (match && match[1].includes('<template>')) return match[1].trim()
    }
  }
  return ''
})

// Detect code appearing during streaming (even before closing ```)
const hasCodeInProgress = computed(() => {
  if (messages.value.length === 0) return false
  const last = messages.value[messages.value.length - 1]
  if (last.role !== 'assistant') return false
  return last.content.includes('<template>')
})

const hasCode = computed(() => generatedCode.value.length > 0 || hasCodeInProgress.value)

// Build a standalone HTML preview using Vue SFC compiler in the browser
const previewHtml = computed(() => {
  const code = generatedCode.value
  if (!code) return ''
  if (!code.includes('<template>')) return ''

  // Encode the entire SFC so we can pass it safely into the iframe
  const encodedSfc = btoa(unescape(encodeURIComponent(code)))

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
<script src="https://unpkg.com/sucrase@3.35.0/dist/sucrase.js"><\/script>
<script src="https://cdn.tailwindcss.com"><\/script>
<script>
tailwind.config={theme:{extend:{colors:{
'bg-primary':'#0a0a0f','bg-card':'#13131a','bg-card-hover':'#1a1a24','bg-surface':'#16161f',
'text-primary':'#ededf0','text-secondary':'rgba(255,255,255,0.6)','text-tertiary':'rgba(255,255,255,0.5)','text-muted':'rgba(255,255,255,0.3)',
'accent-lime':'#c8ee44','accent-brand':'#ff3d8b',
'border-subtle':'rgba(255,255,255,0.06)','border-card':'rgba(255,255,255,0.08)'
},boxShadow:{'card':'0 4px 24px rgba(0,0,0,0.4)'}}}}
<\/script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
body{background:#0a0a0f;color:#ededf0;font-family:'Outfit',system-ui,sans-serif;margin:0;padding:16px}
</style>
</head>
<body>
<div id="app"></div>
<script>
var{createApp,ref,reactive,computed,watch,watchEffect,onMounted,onUnmounted,nextTick,toRef,toRefs}=Vue;

// Stubs
var Button={template:'<button class="bg-accent-lime text-bg-primary rounded-lg font-semibold hover:brightness-110 transition-all px-4 py-2" v-bind="$attrs"><slot/></button>',inheritAttrs:false,props:['size','variant','disabled']};
var Card={template:'<div class="rounded-3xl bg-bg-card shadow-card" v-bind="$attrs"><slot/></div>',inheritAttrs:false};
var CardContent={template:'<div v-bind="$attrs"><slot/></div>',inheritAttrs:false,props:['class']};
function useCopyToClipboard(){var copied=ref(false);var copy=async function(t){try{await navigator.clipboard.writeText(t);copied.value=true;setTimeout(function(){copied.value=false},2000)}catch(e){}};return{copy:copy,copied:copied}}
function downloadDataUrl(u,n){var a=document.createElement('a');a.href=u;a.download=n;a.click()}
function downloadBlob(b,n){downloadDataUrl(URL.createObjectURL(b),n)}
function cn(){return Array.from(arguments).flat().filter(Boolean).join(' ')}

try{
  var sfcCode=decodeURIComponent(escape(atob('${encodedSfc}')));
  var templateMatch=sfcCode.match(/<template>([\\s\\S]*)<\\/template>/);
  var setupMatch=sfcCode.match(/<script\\s+setup[^>]*>([\\s\\S]*?)<\\/script>/);

  if(!templateMatch){throw new Error('No <template> found')}

  var templateHtml=templateMatch[1];
  var setupCode=setupMatch?setupMatch[1]:'';

  // Strip imports
  setupCode=setupCode.replace(/import\\s+\\{[^}]+\\}\\s+from\\s+['"]vue['"]/g,'');
  setupCode=setupCode.replace(/import\\s+.*from\\s+['"]@\\/.*['"]/g,'');

  // Strip TypeScript using sucrase
  try{setupCode=sucrase.transform(setupCode,{transforms:['typescript']}).code}catch(e){console.warn('TS strip failed',e)}

  // Find all top-level declarations to return
  var declarations=[];
  var declRegex=/(?:^|\\n)\\s*(?:const|let|var|function)\\s+(\\w+)/g;
  var m;
  while((m=declRegex.exec(setupCode))!==null){declarations.push(m[1])}

  var setupFn=new Function('ref','reactive','computed','watch','watchEffect','onMounted','onUnmounted','nextTick','toRef','toRefs','Button','Card','CardContent','useCopyToClipboard','downloadDataUrl','downloadBlob','cn',
    setupCode+'\\nreturn{'+declarations.join(',')+'}');

  var app=createApp({
    setup:function(){
      return setupFn(ref,reactive,computed,watch,watchEffect,onMounted,onUnmounted,nextTick,toRef,toRefs,Button,Card,CardContent,useCopyToClipboard,downloadDataUrl,downloadBlob,cn);
    },
    template:templateHtml
  });
  app.component('Button',Button);
  app.component('Card',Card);
  app.component('CardContent',CardContent);
  app.mount('#app');
}catch(e){
  document.getElementById('app').innerHTML='<div style="color:#ff6b6b;padding:20px;font-family:monospace;white-space:pre-wrap;font-size:13px">Preview Error:\\n\\n'+e.message+'\\n\\n'+e.stack+'</div>';
}
<\/script>
</body>
</html>`
})

// Auto-open canvas when code appears
watch(hasCode, (val) => {
  if (val && !canvasOpen.value) {
    canvasOpen.value = true
    activeTab.value = 'preview'
  }
})

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
    <div class="flex flex-1 overflow-hidden">

      <!-- Chat pane -->
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
          <!-- Reopen canvas button -->
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
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-6">
            <h2 class="text-xl font-bold text-text-primary mb-2">What do you want to build?</h2>
            <p class="text-sm text-text-secondary max-w-md mb-6">
              Describe your tool idea and I'll build it for you. Be specific about inputs, outputs, and how it should work.
            </p>
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
        class="flex-1 flex-col bg-bg-primary"
        :class="canvasOpen ? 'hidden md:flex' : '!hidden'"
      >
        <!-- Canvas header -->
        <div class="flex h-12 shrink-0 items-center justify-between border-b border-border-subtle px-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-text-primary">{{ toolName }}</span>
          </div>

          <div class="flex items-center gap-2">
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

            <div class="h-4 w-px bg-border-subtle" />
            <button
              v-if="hasCode && !isStreaming"
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
              <div class="text-center">
                <div class="h-12 w-12 rounded-xl bg-bg-surface flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <p class="text-sm text-text-muted">Code will appear here as it's generated</p>
              </div>
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
              <div class="text-center">
                <div class="h-12 w-12 rounded-xl bg-bg-surface flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <p class="text-sm text-text-muted">Generating... preview will appear when done</p>
              </div>
            </div>
            <div v-else class="flex h-full items-center justify-center">
              <div class="text-center">
                <div class="h-12 w-12 rounded-xl bg-bg-surface flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <p class="text-sm text-text-muted">Preview will appear after code is generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
