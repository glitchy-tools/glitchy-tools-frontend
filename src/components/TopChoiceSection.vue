<script setup lang="ts">
const tools = [
  { title: 'AI Image Editor', subtitle: 'Remove backgrounds, resize, and enhance in one click', gradient: 'from-violet-800/50 to-purple-950/40' },
  { title: 'Email Builder', subtitle: 'Drag-and-drop email campaigns that convert', gradient: 'from-purple-800/50 to-indigo-950/40' },
  { title: 'Ad Generator', subtitle: 'AI-crafted ad copy and visuals for every platform', gradient: 'from-fuchsia-800/50 to-violet-950/40' },
  { title: 'SEO Toolkit', subtitle: 'Keyword research, audits, and rank tracking', gradient: 'from-indigo-800/50 to-purple-950/40' },
  { title: 'Landing Pages', subtitle: 'High-converting pages built in minutes', gradient: 'from-violet-700/40 to-fuchsia-950/40' },
  { title: 'Brand Kit', subtitle: 'Logos, colors, and fonts \u2014 always on-brand', gradient: 'from-purple-700/40 to-violet-950/40' },
]
</script>

<template>
  <section class="mb-8 md:mb-16 site-container relative">
    <header class="mb-4 md:mb-5 flex items-end justify-between">
      <div class="space-y-1">
        <h2 class="text-base md:text-lg font-bold text-white">Top Choice</h2>
        <p class="text-sm text-text-secondary">Marketer-recommended tools tailored for you</p>
      </div>
      <a href="/tools" class="text-sm text-accent-lime hover:underline shrink-0">See all</a>
    </header>

    <div class="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
      <a
        v-for="(tool, i) in tools"
        :key="i"
        href="#"
        class="flex-shrink-0 w-[220px] md:w-[240px] rounded-xl overflow-hidden bg-bg-surface hover:bg-bg-card-hover transition-colors snap-start"
      >
        <div class="aspect-[4/3] bg-gradient-to-br" :class="tool.gradient">
          <div class="w-full h-full bg-bg-card-hover opacity-50" />
        </div>
        <div class="p-3">
          <h3 class="text-sm font-semibold text-white mb-0.5">{{ tool.title }}</h3>
          <p class="text-xs text-text-tertiary">{{ tool.subtitle }}</p>
        </div>
      </a>
    </div>
  </section>
</template>
