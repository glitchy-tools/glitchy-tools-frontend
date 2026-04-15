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

/**
 * Rewrite setup code so every top-level declaration also assigns to `__s`.
 * e.g. `const foo = ref(0)` → `const foo = __s.foo = ref(0)`
 * e.g. `const { a, b } = useFoo()` → `const { a, b } = useFoo(); __s.a=a; __s.b=b;`
 * e.g. `function bar() {}` → `function bar() {} __s.bar=bar;`
 */
function injectScopeCapture(code: string): string {
  let result = code

  // Simple declarations: const foo = X → const foo = __s.foo = X
  result = result.replace(/((?:const|let|var)\s+)(\w+)(\s*=)/g, '$1$2$3 __s.$2 =')

  // Destructured objects: const { a, b } = X → const { a, b } = X; __s.a=a; __s.b=b;
  result = result.replace(/((?:const|let|var)\s+\{([^}]+)\}\s*=[^;]+;?)/g, (match, full, names) => {
    const assigns = names.split(',').map((part: string) => {
      const renamed = part.includes(':') ? part.split(':')[1].trim() : part.trim()
      if (renamed && /^\w+$/.test(renamed)) return `__s.${renamed}=${renamed};`
      return ''
    }).join('')
    return full + assigns
  })

  // Destructured arrays: const [a, b] = X → const [a, b] = X; __s.a=a; __s.b=b;
  result = result.replace(/((?:const|let|var)\s+\[([^\]]+)\]\s*=[^;]+;?)/g, (match, full, names) => {
    const assigns = names.split(',').map((part: string) => {
      const name = part.trim()
      if (name && /^\w+$/.test(name)) return `__s.${name}=${name};`
      return ''
    }).join('')
    return full + assigns
  })

  // Functions: add __s.foo=foo after each function declaration
  // We match the function name and add assignment after — Vue template will find it in __s
  const funcNames: string[] = []
  result.replace(/function\s+(\w+)\s*\(/g, (_, name) => { funcNames.push(name); return _ })
  if (funcNames.length > 0) {
    result += '\n' + funcNames.map(n => `__s.${n}=${n};`).join('')
  }

  return result
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
    const capturedSetup = injectScopeCapture(strippedSetup)

    const safeSetup = escapeForTemplateLiteral(capturedSetup)
    const cleanTemplate = templateMatch[1].replace(/\bas\s+\w[\w[\]<>, |]*(?=[)\s,}])/g, '')
    const safeTemplate = escapeForTemplateLiteral(cleanTemplate)

    return PREVIEW_SHELL
      .replace('__SETUP_CODE__', '`' + safeSetup + '`')
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
