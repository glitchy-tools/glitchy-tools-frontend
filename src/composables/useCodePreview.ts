import { computed, ref, watch } from 'vue'
import { transform } from 'sucrase'
import type { ChatMessage } from './useBuilderChat'
import type { Ref } from 'vue'
import PREVIEW_SHELL from './preview-shell.html?raw'

/** Extract the Vue SFC code block from the last assistant message (uses rawContent) */
function extractCode(messages: ChatMessage[]): string {
  const codeBlockPattern = /```(?:vue)?\s*\n([\s\S]*?)```/
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role === 'assistant') {
      const source = msg.rawContent !== undefined ? msg.rawContent : msg.content
      const match = source.match(codeBlockPattern)
      if (match && match[1].includes('<template')) return match[1].trim()
    }
  }
  return ''
}

/** Strip TypeScript and imports so the code can run in a plain JS runtime */
function stripTypeScript(code: string): string {
  let s = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]*['"]\s*;?/g, '')
  s = s.replace(/import\s+['"][^'"]*['"]\s*;?/g, '')

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

/** Collect top-level declaration names, including destructured */
function collectDeclarations(code: string): string[] {
  const names: string[] = []

  // Simple: const foo = ..., function bar() ...
  const simpleRe = /(?:^|\n)\s*(?:const|let|var|function)\s+(\w+)/g
  let m: RegExpExecArray | null
  while ((m = simpleRe.exec(code)) !== null) names.push(m[1])

  // Destructured objects: const { a, b } = ...
  const objRe = /(?:^|\n)\s*(?:const|let|var)\s+\{([^}]+)\}/g
  while ((m = objRe.exec(code)) !== null) {
    m[1].split(',').forEach(part => {
      const renamed = part.includes(':') ? part.split(':')[1] : part
      const name = renamed.trim()
      if (name && /^\w+$/.test(name)) names.push(name)
    })
  }

  // Destructured arrays: const [x, y] = ...
  const arrRe = /(?:^|\n)\s*(?:const|let|var)\s+\[([^\]]+)\]/g
  while ((m = arrRe.exec(code)) !== null) {
    m[1].split(',').forEach(part => {
      const name = part.trim()
      if (name && /^\w+$/.test(name)) names.push(name)
    })
  }

  return [...new Set(names)]
}

export function useCodePreview(messages: Ref<ChatMessage[]>) {
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
    const source = last.rawContent !== undefined ? last.rawContent : last.content
    return source.includes('<template')
  })

  const hasCode = computed(() => generatedCode.value.length > 0 || hasCodeInProgress.value)

  const previewHtml = computed(() => {
    const code = generatedCode.value
    if (!code || !code.includes('<template')) return ''

    const templateMatch = code.match(/<template[^>]*>([\s\S]*)<\/template>/)
    const setupMatch = code.match(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/)
    if (!templateMatch) return ''

    const strippedSetup = stripTypeScript(setupMatch ? setupMatch[1] : '')
    const declarations = collectDeclarations(strippedSetup)

    const safeSetup = escapeForTemplateLiteral(strippedSetup)
    // Strip TS casts from template (e.g. "item as string", "(x as Foo).bar")
    const cleanTemplate = templateMatch[1].replace(/\bas\s+\w[\w[\]<>, |]*(?=[)\s,}])/g, '')
    const safeTemplate = escapeForTemplateLiteral(cleanTemplate)
    const safeReturn = declarations.length > 0 ? declarations.join(',') : ''

    return PREVIEW_SHELL
      .replace('__SETUP_CODE__', '`' + safeSetup + '\\nreturn{' + safeReturn + '}`')
      .replace('__TEMPLATE__', '`' + safeTemplate + '`')
  })

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
