<script lang="ts">
export const toolMeta = {
  name: 'UTM Link Builder',
  slug: 'utm-builder',
  description: 'Build UTM-tagged campaign URLs for tracking traffic sources in Google Analytics.',
  icon: '🔗',
  category: 'Marketing',
  seo: {
    title: 'UTM Link Builder — Glitchy Tools',
    description: 'Generate UTM-tagged URLs for tracking marketing campaigns. Supports all 5 UTM parameters.',
    keywords: ['utm builder', 'campaign url', 'utm generator', 'google analytics', 'tracking links'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const baseUrl = ref('https://glitchy.com/offers')
const source = ref('facebook')
const medium = ref('cpc')
const campaign = ref('summer_sale')
const term = ref('')
const content = ref('')

const generatedUrl = computed(() => {
  if (!baseUrl.value) return ''
  const url = new URL(baseUrl.value.startsWith('http') ? baseUrl.value : `https://${baseUrl.value}`)
  if (source.value) url.searchParams.set('utm_source', source.value)
  if (medium.value) url.searchParams.set('utm_medium', medium.value)
  if (campaign.value) url.searchParams.set('utm_campaign', campaign.value)
  if (term.value) url.searchParams.set('utm_term', term.value)
  if (content.value) url.searchParams.set('utm_content', content.value)
  return url.toString()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-blue-900/30 to-cyan-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🔗</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">UTM Link Builder</h2>
          <p class="text-sm text-text-secondary">Build campaign tracking URLs with UTM parameters</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Parameters</h3>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-xs font-medium text-text-secondary mb-1.5 block">Website URL *</label>
            <input v-model="baseUrl" type="url" placeholder="https://example.com" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Source *</label>
              <input v-model="source" type="text" placeholder="facebook, google, newsletter" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Medium *</label>
              <input v-model="medium" type="text" placeholder="cpc, email, social" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
          </div>
          <div>
            <label class="text-xs font-medium text-text-secondary mb-1.5 block">Campaign *</label>
            <input v-model="campaign" type="text" placeholder="summer_sale, product_launch" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Term (optional)</label>
              <input v-model="term" type="text" placeholder="running+shoes" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Content (optional)</label>
              <input v-model="content" type="text" placeholder="logolink, textlink" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-bg-card p-5 border border-border-card flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-primary">Generated URL</h3>
          <button v-if="generatedUrl" @click="copy(generatedUrl)" class="rounded-lg bg-accent-lime text-bg-primary px-3 py-1.5 text-xs font-semibold hover:brightness-110 transition-all">
            {{ copied ? 'Copied!' : 'Copy URL' }}
          </button>
        </div>
        <div v-if="generatedUrl" class="rounded-xl bg-bg-primary p-4 border border-border-subtle">
          <p class="text-sm text-accent-lime font-mono break-all">{{ generatedUrl }}</p>
        </div>
        <div v-else class="flex items-center justify-center py-12 text-center">
          <p class="text-sm text-text-muted">Enter a URL to generate your tracking link</p>
        </div>
      </div>
    </div>
  </div>
</template>
