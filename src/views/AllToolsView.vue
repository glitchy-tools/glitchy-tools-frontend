<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { toolRegistry } from '@/registry'
import ToolCard from '@/components/ToolCard.vue'

const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(toolRegistry.map(t => t.meta.category))
  return ['All', ...Array.from(cats).sort()]
})

const filteredTools = computed(() => {
  return toolRegistry.filter(t => {
    const matchesCategory = activeCategory.value === 'All' || t.meta.category === activeCategory.value
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q ||
      t.meta.name.toLowerCase().includes(q) ||
      t.meta.description.toLowerCase().includes(q) ||
      t.meta.category.toLowerCase().includes(q) ||
      t.meta.seo.keywords.some(k => k.toLowerCase().includes(q))
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <div class="border-b border-border-subtle">
      <div class="site-container flex h-14 items-center gap-3">
        <RouterLink to="/" class="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Home
        </RouterLink>
        <div class="h-4 w-px bg-border-subtle" />
        <span class="text-sm font-semibold text-text-primary">All Tools</span>
      </div>
    </div>

    <div class="site-container py-6 md:py-10">
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-text-primary mb-2">All Tools</h1>
        <p class="text-sm text-text-secondary mb-5">Browse all tools — exclusive tools require login</p>

        <div class="relative max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, category, or tags..."
            class="w-full rounded-xl border border-border-card bg-bg-surface pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow"
          />
        </div>
      </div>

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

      <div v-if="filteredTools.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolCard v-for="tool in filteredTools" :key="tool.meta.slug" :tool="tool" />
      </div>

      <div v-else class="py-16 text-center">
        <p class="text-sm text-text-muted">No tools found matching "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>
