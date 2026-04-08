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

const toolIcons: Record<string, string> = {
  'notification-mockup': 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  'trending-angles': 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
  'email-html-generator': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  'cloaker': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'watermark-remover': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  'sms-verification': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
}

const defaultIcon = 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'

const gradients = [
  'from-violet-800/50 to-purple-950/40',
  'from-purple-800/50 to-indigo-950/40',
  'from-fuchsia-800/50 to-violet-950/40',
  'from-indigo-800/50 to-purple-950/40',
  'from-violet-700/40 to-fuchsia-950/40',
  'from-purple-700/40 to-violet-950/40',
]
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
      <div v-if="filteredTools.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <a
          v-for="(tool, i) in filteredTools"
          :key="tool.meta.slug"
          :href="`/tools/${tool.meta.slug}`"
          class="rounded-2xl overflow-hidden bg-bg-card border border-border-card hover:border-white/15 transition-all hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
        >
          <div class="aspect-[4/3] bg-gradient-to-br flex items-center justify-center" :class="gradients[i % gradients.length]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/80">
              <path :d="toolIcons[tool.meta.slug] || defaultIcon" />
            </svg>
          </div>
          <div class="p-3 md:p-4">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-sm font-semibold text-white leading-tight">{{ tool.meta.name }}</h3>
            </div>
            <p class="text-xs text-text-tertiary leading-relaxed line-clamp-2 mb-2">{{ tool.meta.description }}</p>
            <span class="inline-block rounded-full bg-bg-surface px-2 py-0.5 text-[10px] text-text-muted font-medium">{{ tool.meta.category }}</span>
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
