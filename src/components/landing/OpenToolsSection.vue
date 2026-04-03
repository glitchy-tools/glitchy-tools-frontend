<script setup lang="ts">
import { ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

const tools = [
  { title: 'Notification Mockup', subtitle: 'Generate realistic phone notification and chat mockups', icon: '📲', href: '/tools/notification-mockup', gradient: 'from-violet-800/50 to-purple-950/40' },
  { title: 'Trending Angles', subtitle: 'Discover trending affiliate angles with hooks and offers', icon: '⚡', href: '/tools/trending-angles', gradient: 'from-purple-800/50 to-indigo-950/40' },
  { title: 'Email HTML Generator', subtitle: 'Build and preview responsive HTML email templates', icon: '✉️', href: '/tools/email-html-generator', gradient: 'from-fuchsia-800/50 to-violet-950/40' },
  { title: 'Cloaker', subtitle: 'Detect ad crawlers and redirect to a different domain', icon: '🕵️', href: '/tools/cloaker', gradient: 'from-indigo-800/50 to-purple-950/40' },
  { title: 'Watermark Remover', subtitle: 'Remove watermarks from images using canvas inpainting', icon: '🖼️', href: '/tools/watermark-remover', gradient: 'from-violet-700/40 to-fuchsia-950/40' },
  { title: 'SMS Verification', subtitle: 'Generate and verify OTP codes for testing workflows', icon: '📱', href: '/tools/sms-verification', gradient: 'from-purple-700/40 to-violet-950/40' },
]

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
        <h2 class="text-base md:text-lg font-bold text-white">Open Tools</h2>
        <p class="text-sm text-text-secondary">Use these tools right now — no account needed</p>
      </div>
    </header>

    <div
      ref="scrollContainer"
      class="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
    >
      <a
        v-for="(tool, i) in tools"
        :key="i"
        :href="tool.href"
        class="flex-shrink-0 w-[220px] md:w-[240px] rounded-xl overflow-hidden bg-bg-surface hover:bg-bg-card-hover transition-colors snap-start"
      >
        <div class="aspect-[4/3] bg-gradient-to-br flex items-center justify-center" :class="tool.gradient">
          <span class="text-5xl">{{ tool.icon }}</span>
        </div>
        <div class="p-3">
          <h3 class="text-sm font-semibold text-white mb-0.5">{{ tool.title }}</h3>
          <p class="text-xs text-text-tertiary">{{ tool.subtitle }}</p>
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
