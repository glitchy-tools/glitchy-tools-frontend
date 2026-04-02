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
  <div v-if="tool">
    <!-- Breadcrumb -->
    <nav class="mb-4 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <RouterLink to="/" class="hover:text-foreground transition-colors">Tools</RouterLink>
      <span>/</span>
      <span class="text-foreground font-medium">{{ tool.meta.name }}</span>
    </nav>

    <!-- Tool header -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-1">
        <span class="text-2xl">{{ tool.meta.icon }}</span>
        <h1 class="text-2xl font-bold tracking-tight">{{ tool.meta.name }}</h1>
      </div>
      <p class="text-muted-foreground">{{ tool.meta.description }}</p>
    </div>

    <!-- Tool content — full width -->
    <component :is="tool.component" />
  </div>
  <div v-else class="py-20 text-center">
    <p class="text-lg text-muted-foreground">Tool not found.</p>
    <RouterLink to="/">
      <Button variant="outline" class="mt-4">Back to tools</Button>
    </RouterLink>
  </div>
</template>
