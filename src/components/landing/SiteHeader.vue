<script setup lang="ts">
import { ref } from 'vue'
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Explore', href: '/', active: true },
  { label: 'AI Studio', href: '/create', badge: 'New' },
  { label: 'All Tools', href: '/all-tools' },
]
</script>

<template>
  <header class="h-16 w-full sticky top-0 z-50 bg-bg-primary">
    <div class="site-container h-full flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 shrink-0 text-sm font-bold text-text-primary">
        Glitchy Tools
      </a>

      <nav class="hidden lg:flex items-center gap-1 overflow-x-auto hide-scrollbar mx-4">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="flex items-center gap-1 px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 hover:text-text-primary"
          :class="link.active ? 'text-text-primary' : 'text-text-secondary'"
        >
          {{ link.label }}
          <span
            v-if="link.badge"
            class="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-accent-lime text-bg-card leading-none"
          >
            {{ link.badge }}
          </span>
        </a>
      </nav>

      <button class="lg:hidden p-2 text-text-secondary hover:text-white" @click="mobileMenuOpen = !mobileMenuOpen">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path v-if="!mobileMenuOpen" d="M3 12h18M3 6h18M3 18h18" />
          <path v-else d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden absolute top-16 left-0 w-full bg-bg-primary border-t border-border-subtle py-4 px-4 z-50"
    >
      <a
        v-for="link in navLinks"
        :key="link.label"
        :href="link.href"
        class="flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:text-white rounded-lg hover:bg-white/5"
        :class="link.active ? 'text-white' : 'text-text-secondary'"
      >
        {{ link.label }}
        <span
          v-if="link.badge"
          class="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-accent-lime text-bg-card leading-none"
        >
          {{ link.badge }}
        </span>
      </a>
    </div>
  </header>
</template>
