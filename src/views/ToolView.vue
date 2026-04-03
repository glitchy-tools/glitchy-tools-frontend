<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getToolBySlug } from '@/registry'

const props = defineProps<{ slug: string }>()
const tool = computed(() => getToolBySlug(props.slug))
</script>

<template>
  <div v-if="tool" class="flex h-screen flex-col bg-bg-primary">
    <!-- Slim top bar -->
    <div class="flex h-10 shrink-0 items-center gap-3 border-b border-border-subtle px-4">
      <RouterLink to="/" class="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Tools
      </RouterLink>
      <span class="text-sm text-text-muted">/</span>
      <span class="text-sm font-medium text-text-primary">{{ tool.meta.icon }} {{ tool.meta.name }}</span>
    </div>

    <!-- Tool content -->
    <div class="flex-1 overflow-auto p-4 lg:p-6">
      <component :is="tool.component" />
    </div>
  </div>

  <div v-else class="flex h-screen items-center justify-center bg-bg-primary">
    <div class="text-center">
      <p class="text-lg text-text-secondary">Tool not found.</p>
      <RouterLink to="/" class="mt-4 inline-block text-sm text-accent-lime hover:underline">Back to home</RouterLink>
    </div>
  </div>
</template>
