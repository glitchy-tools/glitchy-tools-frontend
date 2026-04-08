<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toolRegistry } from '@/registry'

const authStore = useAuthStore()
const scrollContainer = ref<HTMLElement | null>(null)

const gradients = [
  'from-violet-800/50 to-purple-950/40',
  'from-purple-800/50 to-indigo-950/40',
  'from-fuchsia-800/50 to-violet-950/40',
  'from-indigo-800/50 to-purple-950/40',
  'from-violet-700/40 to-fuchsia-950/40',
  'from-purple-700/40 to-violet-950/40',
]

const tools = computed(() => toolRegistry.map((t, i) => ({
  meta: t.meta,
  href: `/tools/${t.meta.slug}`,
  gradient: gradients[i % gradients.length],
  locked: (t.meta.exclusive ?? false) && !authStore.isAuthenticated,
})))

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
  <section class="mb-8 md:mb-16 site-container relative group">
    <header class="mb-4 md:mb-5 flex items-end justify-between">
      <div class="space-y-1">
        <h2 class="text-base md:text-lg font-bold text-white">Tools</h2>
        <p class="text-sm text-text-secondary">{{ authStore.isAuthenticated ? 'All tools unlocked' : 'Sign in to unlock exclusive tools' }}</p>
      </div>
    </header>

    <div
      ref="scrollContainer"
      class="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
    >
      <component
        :is="tool.locked ? 'div' : 'a'"
        v-for="tool in tools"
        :key="tool.meta.slug"
        v-bind="tool.locked ? {} : { href: tool.href }"
        class="flex-shrink-0 w-[220px] md:w-[240px] rounded-xl overflow-hidden bg-bg-surface hover:bg-bg-card-hover transition-colors snap-start relative"
        :class="{ 'opacity-60 cursor-not-allowed': tool.locked }"
      >
        <div class="aspect-[4/3] bg-gradient-to-br flex items-center justify-center" :class="tool.gradient">
          <span class="text-5xl">{{ tool.meta.icon }}</span>
        </div>
        <div class="p-3">
          <div class="flex items-center gap-1.5 mb-0.5">
            <h3 class="text-sm font-semibold text-white">{{ tool.meta.name }}</h3>
            <svg
              v-if="tool.locked"
              xmlns="http://www.w3.org/2000/svg"
              width="12" height="12"
              viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              class="text-text-muted"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p class="text-xs text-text-tertiary">{{ tool.meta.description }}</p>
        </div>
      </component>
    </div>

    <button
      class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-border-card flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
      @click="scrollLeft"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>
    </button>
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-border-card flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
      @click="scrollRight"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" /></svg>
    </button>
  </section>
</template>
