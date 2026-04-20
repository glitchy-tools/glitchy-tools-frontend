<script setup lang="ts">
import { computed } from 'vue'
import type { ToolEntry } from '@/types'
import { categoryIcons, gradientFromSlug } from '@/lib/tools'

const props = defineProps<{ tool: ToolEntry }>()

const isAuthenticated = computed(() => !!localStorage.getItem('glitchy_token'))
const isLocked = computed(() => props.tool.meta.exclusive && !isAuthenticated.value)
</script>

<template>
  <component
    :is="isLocked ? 'div' : 'a'"
    v-bind="isLocked ? {} : { href: `/tools/${tool.meta.slug}` }"
    class="relative flex flex-col rounded-2xl bg-bg-card border border-border-card p-4 transition-all"
    :class="isLocked
      ? 'cursor-not-allowed'
      : 'hover:border-white/15 hover:shadow-lg hover:shadow-black/20'"
  >
    <!-- Blur overlay for locked tools -->
    <div
      v-if="isLocked"
      class="absolute inset-0 rounded-2xl backdrop-blur-sm bg-bg-primary/60 flex flex-col items-center justify-center z-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted mb-2">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span class="text-xs font-medium text-text-muted">Login to access</span>
    </div>

    <!-- Top row: icon + info -->
    <div class="flex gap-4 mb-3">
      <div
        class="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center"
        :style="{ background: gradientFromSlug(tool.meta.slug) }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
          class="text-white/70"
        >
          <path :d="categoryIcons[tool.meta.category] || categoryIcons.Productivity" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 mb-0.5">
          <h3 class="text-sm font-semibold text-white">{{ tool.meta.name }}</h3>
          <span v-if="tool.meta.exclusive" class="text-[9px] font-semibold text-accent-lime bg-accent-lime/10 px-1.5 py-0.5 rounded-full">Exclusive</span>
        </div>
        <span class="text-[10px] font-medium text-accent-lime">{{ tool.meta.category }}</span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-xs text-text-tertiary leading-relaxed mb-3">{{ tool.meta.description }}</p>

    <!-- Tags from SEO keywords -->
    <div class="flex flex-wrap gap-1.5 mt-auto">
      <span
        v-for="tag in tool.meta.seo.keywords.slice(0, 4)"
        :key="tag"
        class="text-[10px] text-text-muted bg-bg-surface px-2 py-0.5 rounded-full"
      >
        {{ tag }}
      </span>
    </div>
  </component>
</template>
