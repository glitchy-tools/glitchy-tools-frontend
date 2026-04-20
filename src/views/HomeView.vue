<script setup lang="ts">
import { ref, computed } from 'vue'
import SiteHeader from '@/components/landing/SiteHeader.vue'
import SiteFooter from '@/components/landing/SiteFooter.vue'
import ToolCard from '@/components/ToolCard.vue'
import { toolRegistry } from '@/registry'

const searchQuery = ref('')
const showAll = ref(false)

const isAuthenticated = computed(() => !!localStorage.getItem('glitchy_token'))

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
          Glitchy <span class="text-accent-lime">Tools</span>
        </h1>
        <p class="text-sm md:text-base text-text-secondary mb-8 max-w-lg mx-auto">
          Search for tools, create an account for exclusive access, or build your own tool with AI and submit it for review.
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
                CREATIVE <span class="text-accent-lime">SUITE</span>
              </h2>
              <p class="text-sm text-text-secondary mb-1">The All-in-One Marketing Toolkit</p>
              <template v-if="!isAuthenticated">
                <a href="/signup" class="w-full inline-block py-2.5 px-4 text-sm font-semibold text-bg-primary bg-accent-lime rounded-lg hover:brightness-110 transition-all mb-3 text-center mt-4">
                  Sign up free
                </a>
                <p class="text-xs text-text-muted mb-4">No credit card required</p>
              </template>
              <template v-else>
                <a href="/all-tools" class="w-full inline-block py-2.5 px-4 text-sm font-semibold text-bg-primary bg-accent-lime rounded-lg hover:brightness-110 transition-all mb-3 text-center mt-4">
                  Browse Suite
                </a>
              </template>
              <a href="/all-tools" class="text-sm text-text-secondary hover:text-white hover:underline transition-colors">
                Browse all templates
              </a>
            </div>

            <div class="relative">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1.5">
                <div
                  v-for="i in 12"
                  :key="i"
                  class="aspect-video rounded-lg overflow-hidden bg-bg-card-hover"
                >
                  <div
                    class="w-full h-full"
                    :style="{ background: `linear-gradient(${135 + i * 15}deg, hsl(${265 + i * 3}, ${20 + i * 2}%, ${16 + i}%), hsl(${260 + i * 2}, ${15 + i}%, ${10 + i}%))` }"
                  />
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-card to-transparent flex items-end justify-center pb-4">
                <a href="/all-tools" class="flex items-center gap-2 text-sm text-accent-lime hover:underline transition-colors">
                  View all templates
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </a>
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
