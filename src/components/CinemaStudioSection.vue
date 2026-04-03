<script setup lang="ts">
const thumbnails = Array.from({ length: 12 }, (_, i) => ({
  id: `cs-${i}`,
  href: '/templates',
}))
</script>

<template>
  <div class="site-container mb-8 md:mb-16">
    <div class="rounded-3xl overflow-hidden bg-bg-card shadow-card">
      <div class="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_3fr]">
        <div class="flex flex-col items-center justify-center p-8 md:p-10 text-center">
          <p class="text-[10px] uppercase tracking-[0.2em] text-text-tertiary mb-3">
            Exclusively on glitchy.tools
          </p>
          <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-4 tracking-wide">
            CREATIVE <span class="text-accent-lime">SUITE</span>
          </h2>
          <p class="text-sm text-text-secondary mb-1">
            The All-in-One Marketing Toolkit
          </p>
          <a href="/signup" class="w-full inline-block py-2.5 px-4 text-sm font-semibold text-bg-primary bg-accent-lime rounded-lg hover:brightness-110 transition-all mb-3 text-center">
            Sign up free
          </a>
          <p class="text-xs text-text-muted mb-4">No credit card required</p>

          <a href="/templates" class="text-sm text-text-secondary hover:text-white hover:underline transition-colors">
            Browse all templates
          </a>
        </div>

        <div class="relative">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1.5">
            <a
              v-for="(thumb, i) in thumbnails"
              :key="thumb.id"
              :href="thumb.href"
              class="aspect-video rounded-lg overflow-hidden bg-bg-card-hover hover:brightness-125 transition-all duration-200"
            >
              <div
                class="w-full h-full"
                :style="{ background: `linear-gradient(${135 + i * 15}deg, hsl(${265 + i * 3}, ${20 + i * 2}%, ${16 + i}%), hsl(${260 + i * 2}, ${15 + i}%, ${10 + i}%))` }"
              />
            </a>
          </div>

          <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-card to-transparent flex items-end justify-center pb-4">
            <a href="/templates" class="flex items-center gap-2 text-sm text-accent-lime hover:underline transition-colors">
              View all templates
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
