<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { toolRegistry } from '@/registry'

const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(toolRegistry.map(t => t.meta.category))
  return ['All', ...Array.from(cats).sort()]
})

const filteredTools = computed(() => {
  return toolRegistry.filter(t => {
    const matchesCategory = activeCategory.value === 'All' || t.meta.category === activeCategory.value
    const matchesSearch = !searchQuery.value ||
      t.meta.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.meta.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const categoryIcons: Record<string, string> = {
  Marketing: 'M22 12h-4l-3 9L9 3l-3 9H2',
  Design: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586',
  Content: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  Analytics: 'M18 20V10M12 20V4M6 20v-6',
  Productivity: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
}

const gradientFromSlug = (slug: string) => {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 60 + 250
  return `linear-gradient(135deg, hsl(${hue}, 40%, 20%) 0%, hsl(${hue + 30}, 30%, 12%) 100%)`
}
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <!-- Header -->
    <div class="border-b border-border-subtle">
      <div class="site-container flex h-14 items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Home
        </RouterLink>
        <div class="h-4 w-px bg-border-subtle" />
        <span class="text-sm font-semibold text-text-primary">Free Tools</span>
      </div>
    </div>

    <div class="site-container py-6 md:py-10">
      <!-- Title + Search -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">Free Tools</h1>
        <p class="text-sm text-text-secondary mb-5">Browse all tools — no account needed</p>

        <div class="relative max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tools..."
            class="w-full rounded-xl border border-border-card bg-bg-surface pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow"
          />
        </div>
      </div>

      <!-- Category pills -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          :class="
            activeCategory === cat
              ? 'bg-accent-lime text-bg-primary shadow-md shadow-accent-lime/25'
              : 'bg-bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-white/20'
          "
        >
          {{ cat }}
        </button>
      </div>

      <!-- Results -->
      <div v-if="filteredTools.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          v-for="tool in filteredTools"
          :key="tool.meta.slug"
          :href="`/tools/${tool.meta.slug}`"
          class="flex gap-4 rounded-2xl bg-bg-card border border-border-card p-4 hover:border-white/15 transition-all hover:shadow-lg hover:shadow-black/20"
        >
          <div
            class="h-14 w-14 shrink-0 rounded-xl flex items-center justify-center"
            :style="{ background: gradientFromSlug(tool.meta.slug) }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              class="text-white/70"
            >
              <path :d="categoryIcons[tool.meta.category] || categoryIcons.Productivity" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-white mb-0.5">{{ tool.meta.name }}</h3>
            <span class="inline-block text-[10px] font-medium text-accent-lime mb-1.5">{{ tool.meta.category }}</span>
            <p class="text-xs text-text-tertiary leading-relaxed line-clamp-2">{{ tool.meta.description }}</p>
          </div>
        </a>
      </div>

      <!-- Empty state -->
      <div v-else class="py-16 text-center">
        <p class="text-sm text-text-muted">No tools found matching "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>
