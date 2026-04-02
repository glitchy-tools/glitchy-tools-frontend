<script lang="ts">
export const toolMeta = {
  name: 'Case Converter',
  slug: 'case-converter',
  description: 'Convert text between UPPER, lower, Title, camelCase, snake_case, and more.',
  icon: 'Aa',
  category: 'Writing',
  seo: {
    title: 'Free Online Text Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more. Free, instant, browser-based.',
    keywords: ['case converter', 'text case', 'uppercase', 'lowercase', 'title case', 'camelCase', 'snake_case'],
  },
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const input = ref('')

const conversions = [
  {
    label: 'UPPERCASE',
    fn: (s: string) => s.toUpperCase(),
  },
  {
    label: 'lowercase',
    fn: (s: string) => s.toLowerCase(),
  },
  {
    label: 'Title Case',
    fn: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    label: 'Sentence case',
    fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  },
  {
    label: 'camelCase',
    fn: (s: string) => {
      const words = s.toLowerCase().split(/[\s_\-]+/).filter(Boolean)
      return words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('')
    },
  },
  {
    label: 'PascalCase',
    fn: (s: string) => {
      return s.toLowerCase().split(/[\s_\-]+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    },
  },
  {
    label: 'snake_case',
    fn: (s: string) => s.toLowerCase().replace(/[\s\-]+/g, '_').replace(/[^a-z0-9_]/g, ''),
  },
  {
    label: 'kebab-case',
    fn: (s: string) => s.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, ''),
  },
]

function copy(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="grid gap-4">
    <div>
      <label for="case-input" class="text-sm font-medium">Enter text</label>
      <textarea
        id="case-input"
        v-model="input"
        class="mt-1 flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        placeholder="Type or paste text here..."
      />
    </div>

    <div v-if="input.trim()" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card v-for="c in conversions" :key="c.label">
        <CardContent class="p-3">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-muted-foreground">{{ c.label }}</p>
            <Button variant="outline" size="sm" @click="copy(c.fn(input))">Copy</Button>
          </div>
          <p class="text-sm font-mono break-all line-clamp-3">{{ c.fn(input) }}</p>
        </CardContent>
      </Card>
    </div>

    <p v-else class="text-sm text-muted-foreground">Type something above to see all conversions.</p>
  </div>
</template>
