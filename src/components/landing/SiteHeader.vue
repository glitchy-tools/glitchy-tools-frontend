<script setup lang="ts">
import { ref } from 'vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Explore', href: '/', active: true },
  { label: 'Templates', href: '/templates' },
  { label: 'AI Studio', href: '/ai-studio' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Campaigns', href: '/campaigns', badge: 'New' },
  { label: 'Email', href: '/email' },
  { label: 'Social', href: '/social' },
  { label: 'Brand Kit', href: '/brand-kit' },
  { label: 'Ads Manager', href: '/ads' },
  { label: 'Automations', href: '/automations', badge: 'New' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Assets', href: '/assets' },
  { label: 'Gallery', href: '/gallery' },
]
</script>

<template>
  <header class="h-16 w-full sticky top-0 z-50 bg-bg-primary">
    <div class="site-container h-full flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 shrink-0">
        <LogoIcon />
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

      <div class="flex items-center gap-2 shrink-0">
        <template v-if="!authStore.isAuthenticated">
          <a href="/signup" class="hidden md:flex flex-col items-center text-text-secondary hover:text-white transition-colors text-sm relative">
            <span class="flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-accent-lime">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              Sign up
            </span>
            <span class="absolute -bottom-3.5 text-[10px] bg-accent-brand text-white px-1.5 py-0.5 rounded font-semibold leading-none">
              30% OFF
            </span>
          </a>

          <a href="/login" class="px-4 py-1.5 text-sm text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
            Login
          </a>

          <a href="/signup" class="px-4 py-1.5 text-sm font-semibold bg-accent-lime text-bg-primary rounded-lg hover:brightness-110 transition-all">
            Sign up
          </a>
        </template>

        <button class="lg:hidden p-2 text-text-secondary hover:text-white" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="!mobileMenuOpen" d="M3 12h18M3 6h18M3 18h18" />
            <path v-else d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
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
