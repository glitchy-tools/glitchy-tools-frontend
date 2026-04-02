<script lang="ts">
export const toolMeta = {
  name: 'Word Counter',
  slug: 'word-counter',
  description: 'Count words, characters, sentences, and paragraphs in any text.',
  icon: '#',
  category: 'Writing',
  seo: {
    title: 'Free Online Word Counter — Characters, Sentences & Reading Time',
    description: 'Count words, characters, sentences, paragraphs, and estimated reading time. Free, instant, runs entirely in your browser.',
    keywords: ['word counter', 'character counter', 'sentence counter', 'reading time calculator', 'word count online'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'

const text = ref('')

const stats = computed(() => {
  const t = text.value
  const characters = t.length
  const charactersNoSpaces = t.replace(/\s/g, '').length
  const words = t.trim() ? t.trim().split(/\s+/).length : 0
  const sentences = t.trim() ? t.split(/[.!?]+/).filter((s) => s.trim()).length : 0
  const paragraphs = t.trim() ? t.split(/\n\n+/).filter((p) => p.trim()).length : 0
  /** Average adult reads ~250 words per minute */
  const readingTime = Math.max(1, Math.ceil(words / 250))

  return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTime }
})
</script>

<template>
  <div class="grid gap-4">
    <textarea
      v-model="text"
      aria-label="Text input"
      class="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      placeholder="Start typing or paste your text..."
    />

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Card v-for="(value, label) in {
        Words: stats.words,
        Characters: stats.characters,
        'No Spaces': stats.charactersNoSpaces,
        Sentences: stats.sentences,
        Paragraphs: stats.paragraphs,
        'Read Time': stats.readingTime + 'm',
      }" :key="label">
        <CardContent class="p-4 text-center">
          <p class="text-2xl font-bold">{{ value }}</p>
          <p class="text-xs text-muted-foreground">{{ label }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
