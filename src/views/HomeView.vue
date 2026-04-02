<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { toolRegistry } from '@/registry'

useHead({
  title: 'Glitchy Tools — Free Online Tools for Everyone',
  meta: [
    { name: 'description', content: 'A collection of free, browser-based tools built by the Glitchy team. JSON formatter, color picker, word counter, and more.' },
    { name: 'keywords', content: 'free online tools, developer tools, design tools, writing tools, browser tools, glitchy tools' },
    { property: 'og:title', content: 'Glitchy Tools — Free Online Tools' },
    { property: 'og:description', content: 'A collection of free, browser-based tools. No sign-up required.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://glitchy.tools' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Glitchy Tools',
        url: 'https://glitchy.tools',
        description: 'A collection of free, browser-based tools built by the Glitchy team.',
      }),
    },
  ],
})

const search = ref('')
const activeCategory = ref<string | null>(null)

const allCategories = computed(() =>
  [...new Set(toolRegistry.map((t) => t.meta.category))].sort(),
)

const filteredTools = computed(() => {
  let tools = toolRegistry

  if (activeCategory.value) {
    tools = tools.filter((t) => t.meta.category === activeCategory.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    tools = tools.filter(
      (t) =>
        t.meta.name.toLowerCase().includes(q) ||
        t.meta.description.toLowerCase().includes(q) ||
        t.meta.category.toLowerCase().includes(q),
    )
  }

  return tools
})

function selectCategory(cat: string | null) {
  activeCategory.value = activeCategory.value === cat ? null : cat
}

/** Map categories to subtle gradient backgrounds */
const categoryColors: Record<string, string> = {
  Design: 'from-pink-500/10 to-pink-600/5',
  Marketing: 'from-emerald-500/10 to-emerald-600/5',
  Utility: 'from-amber-500/10 to-amber-600/5',
}

const categoryTextColors: Record<string, string> = {
  Design: 'text-pink-400',
  Marketing: 'text-emerald-400',
  Utility: 'text-amber-400',
}

function getCategoryGradient(cat: string): string {
  return categoryColors[cat] || 'from-primary/10 to-primary/5'
}

function getCategoryTextColor(cat: string): string {
  return categoryTextColors[cat] || 'text-primary'
}
</script>

<template>
  <div>
    <!-- Hero -->
    <div class="mb-8 text-center sm:text-left">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
        Glitchy <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Tools</span>
      </h1>
      <p class="mt-3 text-muted-foreground max-w-xl sm:text-lg">
        Free, browser-based tools that just work. No sign-up, no install, no nonsense.
      </p>
    </div>

    <!-- Search + filters -->
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          v-model="search"
          type="search"
          placeholder="Search tools..."
          aria-label="Search tools"
          class="flex h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          :class="activeCategory === null ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'"
          @click="selectCategory(null)"
        >
          All
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          :class="activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Tools grid — flat, no category grouping -->
    <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <RouterLink
        v-for="tool in filteredTools"
        :key="tool.meta.slug"
        :to="`/tools/${tool.meta.slug}`"
        class="group"
      >
        <div
          class="relative flex flex-col items-center rounded-2xl border border-border bg-gradient-to-b p-5 sm:p-6 text-center transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-0.5"
          :class="getCategoryGradient(tool.meta.category)"
        >
          <!-- Icon -->
          <span class="text-4xl mb-3" role="img" :aria-label="tool.meta.name + ' icon'">{{ tool.meta.icon }}</span>

          <!-- Name -->
          <p class="text-sm font-semibold leading-tight mb-1">{{ tool.meta.name }}</p>

          <!-- Category tag -->
          <span
            class="text-[10px] font-medium uppercase tracking-wider mt-1"
            :class="getCategoryTextColor(tool.meta.category)"
          >
            {{ tool.meta.category }}
          </span>
        </div>
      </RouterLink>
    </div>

    <!-- Empty state -->
    <div v-if="filteredTools.length === 0" class="py-20 text-center text-muted-foreground">
      <span class="text-4xl mb-3 block">🔍</span>
      <p class="text-lg">No tools found.</p>
      <p v-if="search || activeCategory" class="mt-1 text-sm">Try clearing your search or filter.</p>
    </div>

    <!-- Tool count -->
    <p class="mt-8 text-center text-xs text-muted-foreground">
      {{ filteredTools.length }} of {{ toolRegistry.length }} tools
    </p>
  </div>
</template>
