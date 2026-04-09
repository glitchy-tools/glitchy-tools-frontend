<script setup lang="ts">
import type { ToolEntry } from '@/types'
import { categoryIcons, gradientFromSlug } from '@/lib/tools'

defineProps<{ tool: ToolEntry }>()
</script>

<template>
  <a
    :href="`/tools/${tool.meta.slug}`"
    class="flex gap-4 rounded-2xl bg-bg-card border border-border-card p-4 hover:border-white/15 transition-all hover:shadow-lg hover:shadow-black/20"
  >
    <div
      class="h-14 w-14 shrink-0 rounded-xl flex items-center justify-center"
      :style="{ background: gradientFromSlug(tool.meta.slug) }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        class="text-white/70"
      >
        <path :d="categoryIcons[tool.meta.category] || categoryIcons.Productivity" />
      </svg>
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-semibold text-white mb-0.5">{{ tool.meta.name }}</h3>
      <span class="inline-block text-[10px] font-medium text-accent-lime mb-1.5">{{ tool.meta.category }}</span>
      <p class="text-xs text-text-tertiary leading-relaxed line-clamp-2">{{ tool.meta.description }}</p>
    </div>
  </a>
</template>
