<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

const cards = [
  {
    title: 'AI-POWERED AD CREATIVE',
    subtitle: 'Generate scroll-stopping ads in seconds with AI. Test more, spend less.',
    href: '/ai-studio',
    gradient: 'from-violet-800/50 to-purple-950/40',
  },
  {
    title: 'CAMPAIGN MANAGER 3.0',
    subtitle: 'Unified dashboard for email, social, and paid \u2014 all in one place.',
    href: '/campaigns',
    gradient: 'from-purple-800/50 to-indigo-950/40',
  },
  {
    title: 'SOCIAL SCHEDULER',
    subtitle: 'Plan, preview, and auto-publish across every platform.',
    href: '/social',
    gradient: 'from-fuchsia-800/50 to-violet-950/40',
  },
  {
    title: 'ANALYTICS SUITE',
    subtitle: 'Real-time performance tracking with AI-driven insights and recommendations.',
    href: '/analytics',
    gradient: 'from-indigo-800/50 to-purple-950/40',
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
    <div
      ref="scrollContainer"
      class="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
    >
      <a
        v-for="(card, i) in cards"
        :key="i"
        :href="card.href"
        class="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[calc(25%-12px)] rounded-xl overflow-hidden relative snap-start"
      >
        <div class="aspect-[16/10] bg-gradient-to-br" :class="card.gradient">
          <div class="w-full h-full bg-bg-surface opacity-60" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white mb-1 line-clamp-2">
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
