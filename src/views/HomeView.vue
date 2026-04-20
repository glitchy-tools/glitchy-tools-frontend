<script setup lang="ts">
import { ref, computed } from 'vue'
import SiteHeader from '@/components/landing/SiteHeader.vue'
import SiteFooter from '@/components/landing/SiteFooter.vue'
import ToolCard from '@/components/ToolCard.vue'
import { toolRegistry } from '@/registry'
import { categoryIcons, gradientFromSlug } from '@/lib/tools'

const searchQuery = ref('')
const showAll = ref(false)

const freeTools = computed(() => toolRegistry.filter(t => !t.meta.exclusive))
const exclusiveTools = computed(() => toolRegistry.filter(t => t.meta.exclusive))

const filteredFreeTools = computed(() => {
  if (!searchQuery.value) return freeTools.value
  const q = searchQuery.value.toLowerCase()
  return freeTools.value.filter(t =>
    t.meta.name.toLowerCase().includes(q) ||
    t.meta.description.toLowerCase().includes(q) ||
    t.meta.category.toLowerCase().includes(q) ||
    t.meta.seo.keywords.some(k => k.toLowerCase().includes(q))
  )
})

const visibleFreeTools = computed(() => {
  if (showAll.value || searchQuery.value) return filteredFreeTools.value
  return filteredFreeTools.value.slice(0, 6)
})

const hasMore = computed(() => !showAll.value && !searchQuery.value && filteredFreeTools.value.length > 6)
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <SiteHeader />

    <main class="site-container">
      <!-- Hero -->
      <section class="py-10 md:py-14 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          glitchy<span class="text-accent-lime">.tools</span>
        </h1>
        <p class="text-sm md:text-base text-text-secondary mb-8 max-w-lg mx-auto">
          Search for tools, create an account for exclusive access, and build your own tool with AI and submit it for review.
        </p>

        <!-- Search (centered) -->
        <div class="max-w-xl mx-auto mb-6">
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, category, or tags..."
              class="w-full rounded-2xl border border-border-card bg-bg-card pl-11 pr-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 shadow-card transition-shadow"
            />
          </div>
        </div>

        <div class="flex items-center justify-center gap-3">
          <a href="/create" class="inline-flex items-center gap-1.5 rounded-full bg-accent-lime text-bg-primary px-5 py-2.5 text-sm font-semibold hover:brightness-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Build with AI
          </a>
          <a href="/all-tools" class="inline-flex items-center gap-1.5 rounded-full border border-border-card px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">
            Browse All Tools
          </a>
        </div>
      </section>

      <!-- Featured (always 3) -->
      <section class="pb-8">
        <header class="mb-5">
          <h2 class="text-base md:text-lg font-bold text-white">Featured</h2>
          <p class="text-sm text-text-secondary">Handpicked by the Glitchy team</p>
        </header>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard v-for="tool in toolRegistry.slice(0, 3)" :key="tool.meta.slug" :tool="tool" />
        </div>
      </section>

      <!-- Creative Suite (Exclusive) -->
      <section v-if="exclusiveTools.length" class="pb-8">
        <div class="rounded-3xl bg-bg-card shadow-card overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_3fr]">
            <div class="flex flex-col items-center justify-center p-8 md:p-10 text-center">
              <p class="text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-3">Exclusively on glitchy.tools</p>
              <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-4 tracking-wide">
                GLITCHY <span class="text-accent-lime">PRO</span>
              </h2>
              <a href="/exclusive" class="w-full inline-block py-2.5 px-4 text-sm font-semibold text-bg-primary bg-accent-lime rounded-lg hover:brightness-110 transition-all mb-3 text-center mt-4">
                Explore Pro Tools
              </a>
            </div>

            <div class="relative p-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 blur-[3px]">
                <div
                  v-for="tool in exclusiveTools"
                  :key="tool.meta.slug"
                  class="rounded-xl bg-bg-surface border border-border-card p-3 text-center"
                >
                  <div class="h-10 w-10 rounded-lg mx-auto mb-2 flex items-center justify-center" :style="{ background: gradientFromSlug(tool.meta.slug) }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-white/70"><path :d="categoryIcons[tool.meta.category] || categoryIcons.Productivity" /></svg>
                  </div>
                  <p class="text-xs font-medium text-text-primary truncate">{{ tool.meta.name }}</p>
                  <p class="text-[10px] text-text-muted truncate">{{ tool.meta.category }}</p>
                </div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent-lime mx-auto mb-3">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- All Tools -->
      <section class="pb-10 md:pb-16">
        <header class="mb-5 flex items-end justify-between">
          <div>
            <h2 class="text-base md:text-lg font-bold text-white">Tools</h2>
            <p class="text-sm text-text-secondary">Use these tools right now — exclusive tools require login</p>
          </div>
          <a href="/all-tools" class="flex items-center gap-1 text-sm text-accent-lime hover:underline transition-colors shrink-0">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </header>

        <div v-if="visibleFreeTools.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard v-for="tool in visibleFreeTools" :key="tool.meta.slug" :tool="tool" />
        </div>

        <div v-else class="py-16 text-center">
          <p class="text-sm text-text-muted">No tools found{{ searchQuery ? ` matching "${searchQuery}"` : '' }}</p>
        </div>

        <!-- Show More / Show Less -->
        <div v-if="hasMore || showAll" class="flex justify-center mt-6">
          <button
            v-if="hasMore"
            @click="showAll = true"
            class="inline-flex items-center gap-2 rounded-full border border-border-card px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
          >
            Show More
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button
            v-else-if="showAll && !searchQuery"
            @click="showAll = false"
            class="inline-flex items-center gap-2 rounded-full border border-border-card px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
          >
            Show Less
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
