<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getToolBySlug } from '@/registry'
import { Button } from '@/components/ui/button'

const props = defineProps<{ slug: string }>()

const tool = computed(() => getToolBySlug(props.slug))

useHead(computed(() => {
  if (!tool.value) {
    return { title: 'Tool Not Found — Glitchy Tools' }
  }
  const { meta } = tool.value
  const seo = meta.seo
  return {
    title: `${seo.title} — Glitchy Tools`,
    meta: [
      { name: 'description', content: seo.description },
      { name: 'keywords', content: seo.keywords.join(', ') },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `https://glitchy.tools/tools/${meta.slug}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seo.title },
      { name: 'twitter:description', content: seo.description },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: meta.name,
          url: `https://glitchy.tools/tools/${meta.slug}`,
          description: seo.description,
          applicationCategory: meta.category,
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }),
      },
    ],
  }
}))
</script>

<template>
  <div v-if="tool" class="flex h-screen flex-col">
    <!-- Slim top bar with back button -->
    <div class="flex h-10 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-4">
      <RouterLink to="/" class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Tools
      </RouterLink>
      <span class="text-sm text-muted-foreground">/</span>
      <span class="text-sm font-medium">{{ tool.meta.icon }} {{ tool.meta.name }}</span>
    </div>

    <!-- Tool content — fills remaining space -->
    <div class="flex-1 overflow-auto p-4 lg:p-6">
      <component :is="tool.component" />
    </div>
  </div>
  <div v-else class="py-20 text-center">
    <p class="text-lg text-muted-foreground">Tool not found.</p>
    <RouterLink to="/">
      <Button variant="outline" class="mt-4">Back to tools</Button>
    </RouterLink>
  </div>
</template>
