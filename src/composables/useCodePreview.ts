import { computed, ref, watch } from 'vue'
import { transform } from 'sucrase'
import type { ChatMessage } from './useBuilderChat'
import type { Ref } from 'vue'

/** Extract the Vue SFC code block from the last assistant message */
function extractCode(messages: ChatMessage[]): string {
  const codeBlockPattern = /```(?:vue)?\s*\n([\s\S]*?)```/
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role === 'assistant') {
      const match = msg.content.match(codeBlockPattern)
      if (match && match[1].includes('<template>')) return match[1].trim()
    }
  }
  return ''
}

/** Strip TypeScript and imports so the code can run in a plain JS runtime */
function stripTypeScript(code: string): string {
  // Remove all import statements first
  let s = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]*['"]\s*;?/g, '')
  s = s.replace(/import\s+['"][^'"]*['"]\s*;?/g, '')

  // Use sucrase to strip TypeScript — handles all TS syntax correctly
  try {
    s = transform(s, { transforms: ['typescript'] }).code
  } catch (e) {
    console.warn('Sucrase TS transform failed, returning import-stripped code', e)
  }

  return s
}

/** Escape a string for safe embedding inside a JS template literal */
function escapeForTemplateLiteral(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

/** Collect top-level const/let/var/function declaration names */
function collectDeclarations(code: string): string[] {
  const names: string[] = []
  const re = /(?:^|\n)\s*(?:const|let|var|function)\s+(\w+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) names.push(m[1])
  return names
}

const PREVIEW_SHELL = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
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

var Button={template:'<button class="bg-accent-lime text-bg-primary rounded-lg font-semibold hover:brightness-110 transition-all px-4 py-2" v-bind="$attrs"><slot/></button>',inheritAttrs:false,props:['size','variant','disabled']};
var Card={template:'<div class="rounded-3xl bg-bg-card shadow-card" v-bind="$attrs"><slot/></div>',inheritAttrs:false};
var CardContent={template:'<div v-bind="$attrs"><slot/></div>',inheritAttrs:false,props:['class']};
function useCopyToClipboard(){var copied=ref(false);var copy=async function(t){try{await navigator.clipboard.writeText(t);copied.value=true;setTimeout(function(){copied.value=false},2000)}catch(e){}};return{copy:copy,copied:copied}}
function downloadDataUrl(u,n){var a=document.createElement('a');a.href=u;a.download=n;a.click()}
function downloadBlob(b,n){downloadDataUrl(URL.createObjectURL(b),n)}
function cn(){return Array.from(arguments).flat().filter(Boolean).join(' ')}

try{
  var setupFn=new Function('ref','reactive','computed','watch','watchEffect','onMounted','onUnmounted','nextTick','toRef','toRefs','Button','Card','CardContent','useCopyToClipboard','downloadDataUrl','downloadBlob','cn',
    __SETUP_CODE__);

  var app=createApp({
    setup:function(){
      return setupFn(ref,reactive,computed,watch,watchEffect,onMounted,onUnmounted,nextTick,toRef,toRefs,Button,Card,CardContent,useCopyToClipboard,downloadDataUrl,downloadBlob,cn);
    },
    template:__TEMPLATE__
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

export function useCodePreview(messages: Ref<ChatMessage[]>, isStreaming: Ref<boolean>) {
  const activeTab = ref<'code' | 'preview'>('preview')
  const canvasOpen = ref(false)

  const generatedCode = computed(() => extractCode(messages.value))

  const toolName = computed(() => {
    const code = generatedCode.value
    if (!code) return 'Untitled Tool'
    const match = code.match(/name:\s*['"](.+?)['"]/)
    return match ? match[1] : 'Untitled Tool'
  })

  const hasCodeInProgress = computed(() => {
    if (messages.value.length === 0) return false
    const last = messages.value[messages.value.length - 1]
    if (last.role !== 'assistant') return false
    return last.content.includes('<template>')
  })

  const hasCode = computed(() => generatedCode.value.length > 0 || hasCodeInProgress.value)

  const previewHtml = computed(() => {
    const code = generatedCode.value
    if (!code || !code.includes('<template>')) return ''

    const templateMatch = code.match(/<template>([\s\S]*)<\/template>/)
    const setupMatch = code.match(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/)
    if (!templateMatch) return ''

    const strippedSetup = stripTypeScript(setupMatch ? setupMatch[1] : '')
    const declarations = collectDeclarations(strippedSetup)

    const safeSetup = escapeForTemplateLiteral(strippedSetup)
    const safeTemplate = escapeForTemplateLiteral(templateMatch[1])
    const safeReturn = declarations.join(',')

    return PREVIEW_SHELL
      .replace('__SETUP_CODE__', '`' + safeSetup + '\\nreturn{' + safeReturn + '}`')
      .replace('__TEMPLATE__', '`' + safeTemplate + '`')
  })

  // Auto-open canvas when code appears
  watch(hasCode, (val) => {
    if (val && !canvasOpen.value) {
      canvasOpen.value = true
      activeTab.value = 'preview'
    }
  })

  return {
    activeTab,
    canvasOpen,
    generatedCode,
    toolName,
    hasCode,
    previewHtml,
  }
}
