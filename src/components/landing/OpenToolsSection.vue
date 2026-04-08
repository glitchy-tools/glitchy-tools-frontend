<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

const tools = [
  { title: 'Notification Mockup', subtitle: 'Generate realistic phone notification and chat mockups', svgPath: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0', href: '/tools/notification-mockup', gradient: 'from-violet-800/50 to-purple-950/40' },
  { title: 'Trending Angles', subtitle: 'Discover trending affiliate angles with hooks and offers', svgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8', href: '/tools/trending-angles', gradient: 'from-purple-800/50 to-indigo-950/40' },
  { title: 'Email HTML Generator', subtitle: 'Build and preview responsive HTML email templates', svgPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6', href: '/tools/email-html-generator', gradient: 'from-fuchsia-800/50 to-violet-950/40' },
  { title: 'Cloaker', subtitle: 'Detect ad crawlers and redirect to a different domain', svgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', href: '/tools/cloaker', gradient: 'from-indigo-800/50 to-purple-950/40' },
  { title: 'Watermark Remover', subtitle: 'Remove watermarks from images using canvas inpainting', svgPath: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12', href: '/tools/watermark-remover', gradient: 'from-violet-700/40 to-fuchsia-950/40' },
  { title: 'SMS Verification', subtitle: 'Generate and verify OTP codes for testing workflows', svgPath: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z', href: '/tools/sms-verification', gradient: 'from-purple-700/40 to-violet-950/40' },
]

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -300, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
  <section class="mb-8 md:mb-16 site-container">
    <header class="mb-4 md:mb-5 flex items-end justify-between">
      <div>
        <h2 class="text-base md:text-lg font-bold text-white">Free Tools</h2>
        <p class="text-sm text-text-secondary">Use these tools right now — no account needed</p>
      </div>
      <a
        href="/free-tools"
        class="flex items-center gap-1 text-sm text-accent-lime hover:underline transition-colors shrink-0"
      >
        View All
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </header>

    <div class="relative group">
      <div
        ref="scrollContainer"
        class="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1"
      >
        <a
          v-for="tool in tools"
          :key="tool.href"
          :href="tool.href"
          class="flex-shrink-0 w-[180px] md:w-[220px] rounded-2xl overflow-hidden bg-bg-card border border-border-card hover:border-white/15 transition-all hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 snap-start"
        >
          <div class="aspect-[4/3] bg-gradient-to-br flex items-center justify-center" :class="tool.gradient">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/80"><path :d="tool.svgPath" /></svg>
          </div>
          <div class="p-3">
            <h3 class="text-sm font-semibold text-white mb-0.5 leading-tight">{{ tool.title }}</h3>
            <p class="text-[11px] text-text-tertiary leading-relaxed line-clamp-2">{{ tool.subtitle }}</p>
          </div>
        </a>
      </div>

      <!-- Fade edge -->
      <div class="absolute top-0 right-0 bottom-1 w-16 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none" />

      <button
        class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-border-card flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
        @click="scrollLeft"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur border border-border-card flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 z-10"
        @click="scrollRight"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  </section>
</template>
