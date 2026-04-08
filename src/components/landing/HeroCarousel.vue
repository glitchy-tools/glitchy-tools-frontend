<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

const cards = [
  {
    title: 'AI TOOL BUILDER',
    subtitle: 'Describe any tool and our AI builds it for you in seconds.',
    href: '/create',
    gradient: 'from-violet-800/50 to-purple-950/40',
    svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    title: 'NOTIFICATION MOCKUP',
    subtitle: 'Generate realistic phone notification and chat mockups.',
    href: '/tools/notification-mockup',
    gradient: 'from-purple-800/50 to-indigo-950/40',
    svgPath: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  },
  {
    title: 'TRENDING ANGLES',
    subtitle: 'Discover trending affiliate angles with hooks and offers.',
    href: '/tools/trending-angles',
    gradient: 'from-fuchsia-800/50 to-violet-950/40',
    svgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
  },
  {
    title: 'CLOAKER',
    subtitle: 'Detect ad crawlers and redirect to a different domain.',
    href: '/tools/cloaker',
    gradient: 'from-indigo-800/50 to-purple-950/40',
    svgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
]

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -350, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 350, behavior: 'smooth' })
}
</script>

<template>
  <section class="relative site-container pt-2 md:pt-3 mb-6 md:mb-8 group">
    <header class="mb-4 md:mb-5">
      <h2 class="text-base md:text-lg font-bold text-white">Brand New Tools</h2>
      <p class="text-sm text-text-secondary">The latest additions to the toolkit</p>
    </header>
    <div
      ref="scrollContainer"
      class="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
    >
      <a
        v-for="(card, i) in cards"
        :key="i"
        :href="card.href"
        class="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[calc(25%-12px)] rounded-2xl overflow-hidden bg-bg-card border border-border-card hover:border-white/15 transition-all hover:-translate-y-0.5 snap-start"
      >
        <div class="aspect-[16/7] bg-gradient-to-br flex items-center justify-center" :class="card.gradient">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/30"><path :d="card.svgPath" /></svg>
        </div>
        <div class="p-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-1">
            {{ card.title }}
          </h3>
          <p class="text-xs text-text-secondary line-clamp-2">{{ card.subtitle }}</p>
        </div>
      </a>
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
