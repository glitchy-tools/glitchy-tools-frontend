<script lang="ts">
export const toolMeta = {
  name: 'Ad Spy Analyzer',
  slug: 'ad-spy',
  description: 'Analyze competitor ad creatives and extract copy, hooks, and call-to-actions.',
  icon: '🕶️',
  category: 'Marketing',
  exclusive: true,
  seo: {
    title: 'Ad Spy Analyzer — Glitchy Tools',
    description: 'Break down competitor ads into copy, hooks, and CTAs. Reverse-engineer winning ad creatives.',
    keywords: ['ad spy', 'competitor analysis', 'ad creative', 'copywriting', 'ad breakdown'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const adText = ref(`🔥 STOP scrolling! This changed everything for me...

I was struggling to make $100/day until I found this ONE strategy that top affiliates don't want you to know.

✅ No experience needed
✅ Works in any niche
✅ Results in 48 hours

Click the link below to get started FREE 👇`)

const analysis = computed(() => {
  const text = adText.value.trim()
  if (!text) return null

  const lines = text.split('\n').filter(l => l.trim())
  const hook = lines[0] || ''
  const emojis = (text.match(/[\u{1F300}-\u{1FAFF}]/gu) || []).length
  const bullets = lines.filter(l => l.trim().startsWith('✅') || l.trim().startsWith('•') || l.trim().startsWith('-'))
  const cta = lines.find(l => /click|tap|get started|sign up|join|grab|claim/i.test(l)) || ''
  const urgency = /limited|hurry|now|today|fast|quick|last chance|don't miss/i.test(text)
  const social = /everyone|people|thousands|millions|testimonial|review/i.test(text)
  const wordCount = text.split(/\s+/).length

  return { hook, emojis, bullets, cta, urgency, social, wordCount, lineCount: lines.length }
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-slate-900/30 to-zinc-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🕶️</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Ad Spy Analyzer</h2>
          <p class="text-sm text-text-secondary">Break down ad creatives into actionable components</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-3">Paste ad copy</h3>
        <textarea v-model="adText" rows="10" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow resize-none" />
      </div>

      <div v-if="analysis" class="flex flex-col gap-4">
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-xs font-medium text-text-muted mb-2">Hook (first line)</h3>
          <p class="text-sm text-accent-lime font-medium">{{ analysis.hook }}</p>
        </div>
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-xs font-medium text-text-muted mb-2">CTA</h3>
          <p class="text-sm text-text-primary">{{ analysis.cta || 'No clear CTA detected' }}</p>
        </div>
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-xs font-medium text-text-muted mb-2">Bullets ({{ analysis.bullets.length }})</h3>
          <div class="flex flex-col gap-1">
            <p v-for="(b, i) in analysis.bullets" :key="i" class="text-sm text-text-secondary">{{ b }}</p>
            <p v-if="!analysis.bullets.length" class="text-sm text-text-muted">No bullet points found</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl bg-bg-card p-4 border border-border-card text-center">
            <p class="text-xs text-text-muted mb-1">Words</p>
            <p class="text-2xl font-bold text-text-primary">{{ analysis.wordCount }}</p>
          </div>
          <div class="rounded-2xl bg-bg-card p-4 border border-border-card text-center">
            <p class="text-xs text-text-muted mb-1">Emojis</p>
            <p class="text-2xl font-bold text-text-primary">{{ analysis.emojis }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-if="analysis.urgency" class="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">Urgency</span>
          <span v-if="analysis.social" class="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Social Proof</span>
          <span v-if="analysis.emojis > 0" class="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">Emoji-heavy</span>
          <span v-if="analysis.bullets.length > 0" class="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Structured</span>
        </div>
      </div>
    </div>
  </div>
</template>
