<script lang="ts">
export const toolMeta = {
  name: 'Markdown Editor',
  slug: 'markdown-editor',
  description: 'Write and preview Markdown with a live side-by-side editor.',
  icon: '📄',
  category: 'Productivity',
  seo: {
    title: 'Markdown Editor — Glitchy Tools',
    description: 'Write Markdown with instant preview. Clean, distraction-free editor with formatting toolbar.',
    keywords: ['markdown editor', 'markdown preview', 'md editor', 'markdown writer', 'text editor'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const input = ref(`# Welcome to Markdown Editor

Write your content here and see the **live preview** on the right.

## Features
- **Bold** and *italic* text
- [Links](https://glitchy.com)
- Lists and headings
- Code blocks

\`\`\`
const hello = "world"
\`\`\`

> Blockquotes look great too!

---

Happy writing!`)

const html = computed(() => {
  let s = input.value
  s = s.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-text-primary mt-4 mb-2">$1</h3>')
  s = s.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-text-primary mt-5 mb-2">$1</h2>')
  s = s.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-text-primary mt-6 mb-3">$1</h1>')
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>')
  s = s.replace(/`([^`]+)`/g, '<code class="bg-bg-surface px-1.5 py-0.5 rounded text-accent-lime text-xs font-mono">$1</code>')
  s = s.replace(/```[\s\S]*?```/g, (m) => {
    const code = m.replace(/```\w*\n?/, '').replace(/```$/, '')
    return `<pre class="bg-bg-surface rounded-xl p-4 text-xs font-mono text-text-secondary my-3 overflow-auto border border-border-subtle">${code}</pre>`
  })
  s = s.replace(/^\> (.+)$/gm, '<blockquote class="border-l-2 border-accent-lime pl-4 text-text-secondary italic my-3">$1</blockquote>')
  s = s.replace(/^---$/gm, '<hr class="border-border-subtle my-4" />')
  s = s.replace(/^\- (.+)$/gm, '<li class="text-text-secondary ml-4 list-disc">$1</li>')
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent-lime hover:underline">$1</a>')
  s = s.replace(/\n\n/g, '<br/><br/>')
  return s
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-slate-900/30 to-gray-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">📄</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Markdown Editor</h2>
          <p class="text-sm text-text-secondary">Write Markdown with live preview</p>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button @click="copy(input)" class="rounded-lg bg-accent-lime text-bg-primary px-3 py-1.5 text-xs font-semibold hover:brightness-110 transition-all">{{ copied ? 'Copied!' : 'Copy Markdown' }}</button>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-2xl bg-bg-card border border-border-card overflow-hidden">
        <div class="px-4 py-2 border-b border-border-subtle"><span class="text-xs font-medium text-text-muted">Editor</span></div>
        <textarea v-model="input" class="w-full h-[500px] bg-transparent px-4 py-3 text-sm text-text-primary font-mono resize-none focus:outline-none" />
      </div>
      <div class="rounded-2xl bg-bg-card border border-border-card overflow-hidden">
        <div class="px-4 py-2 border-b border-border-subtle"><span class="text-xs font-medium text-text-muted">Preview</span></div>
        <div class="px-4 py-3 h-[500px] overflow-auto text-sm text-text-secondary leading-relaxed" v-html="html" />
      </div>
    </div>
  </div>
</template>
