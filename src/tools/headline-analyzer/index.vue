<script lang="ts">
export const toolMeta = {
  name: 'Headline Analyzer',
  slug: 'headline-analyzer',
  description: 'Score your headlines for emotional impact, word balance, and click-through potential.',
  icon: '📝',
  category: 'Content',
  exclusive: true,
  seo: {
    title: 'Headline Analyzer — Glitchy Tools',
    description: 'Analyze your headlines for emotional impact and engagement. Get scores and suggestions to improve CTR.',
    keywords: ['headline analyzer', 'title score', 'ctr optimizer', 'copywriting tool', 'headline grader'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const headline = ref('10 Proven Ways to Double Your Affiliate Revenue This Month')

const powerWords = ['proven', 'free', 'secret', 'ultimate', 'exclusive', 'guaranteed', 'instant', 'limited', 'double', 'triple', 'boost', 'hack', 'massive', 'shocking', 'urgent', 'new', 'best', 'easy', 'fast', 'now']
const emotionalWords = ['amazing', 'love', 'fear', 'hate', 'brilliant', 'incredible', 'unbelievable', 'stunning', 'devastating', 'heartbreaking', 'proven', 'shocking']
const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'your', 'you', 'this', 'that', 'it', 'how', 'what', 'why', 'when', 'where']

const analysis = computed(() => {
  const h = headline.value.trim()
  if (!h) return null

  const words = h.split(/\s+/)
  const wordCount = words.length
  const charCount = h.length
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))

  const foundPower = lowerWords.filter(w => powerWords.includes(w))
  const foundEmotional = lowerWords.filter(w => emotionalWords.includes(w))
  const foundCommon = lowerWords.filter(w => commonWords.includes(w))
  const uncommonCount = wordCount - foundCommon.length

  const hasNumber = /\d/.test(h)
  const hasQuestion = h.endsWith('?')
  const startsWithNumber = /^\d/.test(h)

  let score = 40
  score += Math.min(foundPower.length * 10, 20)
  score += Math.min(foundEmotional.length * 8, 15)
  score += hasNumber ? 10 : 0
  score += startsWithNumber ? 5 : 0
  score += hasQuestion ? 5 : 0
  score += wordCount >= 6 && wordCount <= 12 ? 10 : wordCount >= 4 && wordCount <= 15 ? 5 : 0
  score += charCount >= 40 && charCount <= 70 ? 5 : 0
  score = Math.min(score, 100)

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
  const gradeColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-accent-lime' : score >= 40 ? 'text-amber-400' : 'text-red-400'

  return { score, grade, gradeColor, wordCount, charCount, foundPower, foundEmotional, uncommonCount, hasNumber, hasQuestion }
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-rose-900/30 to-pink-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">📝</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Headline Analyzer</h2>
          <p class="text-sm text-text-secondary">Score your headlines for click-through potential</p>
        </div>
      </div>
    </div>

    <div>
      <label class="text-xs font-medium text-text-secondary mb-1.5 block">Your headline</label>
      <input v-model="headline" type="text" placeholder="Enter your headline..." class="w-full rounded-xl border border-border-card bg-bg-surface px-4 py-3 text-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
    </div>

    <div v-if="analysis" class="grid gap-4 md:grid-cols-4">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Score</p>
        <p class="text-4xl font-bold" :class="analysis.gradeColor">{{ analysis.score }}</p>
        <p class="text-xs text-text-muted mt-1">/ 100</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Grade</p>
        <p class="text-4xl font-bold" :class="analysis.gradeColor">{{ analysis.grade }}</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Words</p>
        <p class="text-4xl font-bold text-text-primary">{{ analysis.wordCount }}</p>
        <p class="text-xs" :class="analysis.wordCount >= 6 && analysis.wordCount <= 12 ? 'text-green-400' : 'text-amber-400'">{{ analysis.wordCount >= 6 && analysis.wordCount <= 12 ? 'Ideal' : 'Adjust' }}</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Characters</p>
        <p class="text-4xl font-bold text-text-primary">{{ analysis.charCount }}</p>
        <p class="text-xs" :class="analysis.charCount >= 40 && analysis.charCount <= 70 ? 'text-green-400' : 'text-amber-400'">{{ analysis.charCount >= 40 && analysis.charCount <= 70 ? 'Ideal' : 'Adjust' }}</p>
      </div>
    </div>

    <div v-if="analysis" class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <p class="text-xs font-medium text-text-secondary mb-2">Power Words ({{ analysis.foundPower.length }})</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="w in analysis.foundPower" :key="w" class="text-xs bg-accent-lime/10 text-accent-lime px-2 py-0.5 rounded-full">{{ w }}</span>
          <span v-if="!analysis.foundPower.length" class="text-xs text-text-muted">None found — try adding words like "proven", "free", "instant"</span>
        </div>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <p class="text-xs font-medium text-text-secondary mb-2">Emotional Words ({{ analysis.foundEmotional.length }})</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="w in analysis.foundEmotional" :key="w" class="text-xs bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-full">{{ w }}</span>
          <span v-if="!analysis.foundEmotional.length" class="text-xs text-text-muted">None found — try adding emotional triggers</span>
        </div>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <p class="text-xs font-medium text-text-secondary mb-2">Signals</p>
        <div class="flex flex-col gap-1.5">
          <span class="text-xs" :class="analysis.hasNumber ? 'text-green-400' : 'text-text-muted'">{{ analysis.hasNumber ? '✓' : '✗' }} Contains numbers</span>
          <span class="text-xs" :class="analysis.hasQuestion ? 'text-green-400' : 'text-text-muted'">{{ analysis.hasQuestion ? '✓' : '✗' }} Question format</span>
        </div>
      </div>
    </div>
  </div>
</template>
