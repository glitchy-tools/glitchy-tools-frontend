<script lang="ts">
export const toolMeta = {
  name: 'Lorem Ipsum Generator',
  slug: 'lorem-ipsum',
  description: 'Generate placeholder text for designs and mockups.',
  icon: '📝',
  category: 'Writing',
  seo: {
    title: 'Free Lorem Ipsum Generator — Paragraphs, Sentences & Words',
    description: 'Generate lorem ipsum placeholder text by paragraphs, sentences, or words. Copy with one click. Free and instant.',
    keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'lorem ipsum copy paste', 'filler text'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const count = ref(3)
const unit = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const copied = ref(false)

/** Pick a random word from the pool */
function randomWord(index: number): string {
  return WORDS[(index * 7 + index * index) % WORDS.length]
}

/** Build a sentence of 8-15 words */
function makeSentence(seed: number): string {
  const len = 8 + (seed % 8)
  const words = Array.from({ length: len }, (_, i) => randomWord(seed + i))
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

/** Build a paragraph of 4-7 sentences */
function makeParagraph(seed: number): string {
  const len = 4 + (seed % 4)
  return Array.from({ length: len }, (_, i) => makeSentence(seed * 10 + i)).join(' ')
}

const output = computed(() => {
  if (unit.value === 'words') {
    return Array.from({ length: count.value }, (_, i) => randomWord(i)).join(' ')
  }
  if (unit.value === 'sentences') {
    return Array.from({ length: count.value }, (_, i) => makeSentence(i)).join(' ')
  }
  return Array.from({ length: count.value }, (_, i) => makeParagraph(i)).join('\n\n')
})

function handleCopy() {
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-end gap-4">
      <div>
        <label for="li-count" class="text-sm font-medium">Count</label>
        <input
          id="li-count"
          v-model.number="count"
          type="number"
          min="1"
          max="50"
          class="mt-1 flex h-9 w-24 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      <div class="flex gap-2">
        <Button
          v-for="u in (['paragraphs', 'sentences', 'words'] as const)"
          :key="u"
          :variant="unit === u ? 'default' : 'outline'"
          size="sm"
          @click="unit = u"
        >
          {{ u.charAt(0).toUpperCase() + u.slice(1) }}
        </Button>
      </div>
      <Button :variant="copied ? 'secondary' : 'outline'" size="sm" @click="handleCopy">
        {{ copied ? 'Copied!' : 'Copy' }}
      </Button>
    </div>

    <div class="rounded-md border bg-muted p-4 text-sm leading-relaxed whitespace-pre-wrap">
      {{ output }}
    </div>
  </div>
</template>
