<script lang="ts">
export const toolMeta = {
  name: 'Meta Tag Generator',
  slug: 'meta-tag-generator',
  description: 'Generate SEO meta tags, Open Graph tags, and Twitter Cards for your pages.',
  icon: '🏷️',
  category: 'Marketing',
  seo: {
    title: 'Meta Tag Generator — Glitchy Tools',
    description: 'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page appears in search results.',
    keywords: ['meta tag generator', 'seo tags', 'open graph', 'twitter card', 'meta description'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const title = ref('Glitchy — Marketing That Works')
const description = ref('The all-in-one marketing toolkit for affiliate marketers. Track, optimize, and scale your campaigns.')
const url = ref('https://glitchy.com')
const image = ref('https://glitchy.com/og-image.png')
const siteName = ref('Glitchy')

const metaTags = computed(() => {
  return `<!-- Primary Meta Tags -->
<title>${title.value}</title>
<meta name="title" content="${title.value}">
<meta name="description" content="${description.value}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url.value}">
<meta property="og:title" content="${title.value}">
<meta property="og:description" content="${description.value}">
<meta property="og:image" content="${image.value}">
<meta property="og:site_name" content="${siteName.value}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url.value}">
<meta property="twitter:title" content="${title.value}">
<meta property="twitter:description" content="${description.value}">
<meta property="twitter:image" content="${image.value}">`
})

const titleLength = computed(() => title.value.length)
const descLength = computed(() => description.value.length)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-sky-900/30 to-blue-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🏷️</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Meta Tag Generator</h2>
          <p class="text-sm text-text-secondary">Generate SEO meta tags and social previews</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Page Info</h3>
        <div class="flex flex-col gap-4">
          <div>
            <div class="flex justify-between mb-1.5"><label class="text-xs font-medium text-text-secondary">Title</label><span class="text-xs" :class="titleLength <= 60 ? 'text-green-400' : 'text-amber-400'">{{ titleLength }}/60</span></div>
            <input v-model="title" type="text" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
          </div>
          <div>
            <div class="flex justify-between mb-1.5"><label class="text-xs font-medium text-text-secondary">Description</label><span class="text-xs" :class="descLength <= 160 ? 'text-green-400' : 'text-amber-400'">{{ descLength }}/160</span></div>
            <textarea v-model="description" rows="3" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow resize-none" />
          </div>
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">URL</label><input v-model="url" type="url" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" /></div>
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Image URL</label><input v-model="image" type="url" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" /></div>
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Site Name</label><input v-model="siteName" type="text" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" /></div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Google Preview -->
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-3">Google Preview</h3>
          <div class="rounded-xl bg-white p-4">
            <p class="text-sm text-blue-600 hover:underline cursor-pointer truncate">{{ title || 'Page Title' }}</p>
            <p class="text-xs text-green-700 truncate">{{ url || 'https://example.com' }}</p>
            <p class="text-xs text-gray-600 line-clamp-2 mt-0.5">{{ description || 'Page description...' }}</p>
          </div>
        </div>

        <!-- Output -->
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-text-primary">HTML Output</h3>
            <button @click="copy(metaTags)" class="rounded-lg bg-accent-lime text-bg-primary px-3 py-1.5 text-xs font-semibold hover:brightness-110 transition-all">{{ copied ? 'Copied!' : 'Copy Tags' }}</button>
          </div>
          <pre class="rounded-xl bg-bg-primary p-4 border border-border-subtle text-xs font-mono text-text-secondary overflow-auto max-h-64">{{ metaTags }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
