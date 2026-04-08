<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SiteHeader from '@/components/landing/SiteHeader.vue'
import CreativeSuiteSection from '@/components/landing/CreativeSuiteSection.vue'
import BrandBanner from '@/components/landing/BrandBanner.vue'
import GallerySection from '@/components/landing/GallerySection.vue'
import ExploreToolsSection from '@/components/landing/ExploreToolsSection.vue'
import CallToActionSection from '@/components/landing/CallToActionSection.vue'
import SiteFooter from '@/components/landing/SiteFooter.vue'
import { toolRegistry } from '@/registry'

const router = useRouter()
const promptInput = ref('')

const categoryIcons: Record<string, string> = {
  Marketing: 'M22 12h-4l-3 9L9 3l-3 9H2',
  Design: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586',
  Content: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  Analytics: 'M18 20V10M12 20V4M6 20v-6',
  Productivity: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
}

const gradientFromSlug = (slug: string) => {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 60 + 250
  return `linear-gradient(135deg, hsl(${hue}, 40%, 20%) 0%, hsl(${hue + 30}, 30%, 12%) 100%)`
}

function submitPrompt() {
  if (!promptInput.value.trim()) {
    router.push('/create')
    return
  }
  router.push({ path: '/create', query: { prompt: promptInput.value.trim() } })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitPrompt()
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <SiteHeader />

    <main class="site-container">
      <!-- Hero: AI Builder prompt -->
      <section class="py-10 md:py-16 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          What do you want to build?
        </h1>
        <p class="text-sm md:text-base text-text-secondary mb-8 max-w-lg mx-auto">
          Describe your tool and our AI builds it for you, or explore tools built by the community.
        </p>

        <!-- Prompt input -->
        <div class="max-w-2xl mx-auto mb-6">
          <div class="relative">
            <input
              v-model="promptInput"
              @keydown="handleKeydown"
              type="text"
              placeholder="A QR code generator, a color palette tool, a JSON formatter..."
              class="w-full rounded-2xl border border-border-card bg-bg-card pl-5 pr-14 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 shadow-card transition-shadow"
            />
            <button
              @click="submitPrompt"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-accent-lime p-2.5 text-bg-primary hover:brightness-110 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="flex items-center justify-center gap-3">
          <a
            href="/create"
            class="inline-flex items-center gap-1.5 rounded-full bg-accent-lime/10 px-4 py-2 text-sm font-medium text-accent-lime hover:bg-accent-lime/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Create a Tool
          </a>
          <a
            href="/free-tools"
            class="inline-flex items-center gap-1.5 rounded-full border border-border-card px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors"
          >
            Explore Tools
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      <!-- Featured Tools (top 3) -->
      <section class="pb-6 md:pb-10">
        <header class="mb-5">
          <h2 class="text-base md:text-lg font-bold text-white">Featured Tools</h2>
          <p class="text-sm text-text-secondary">Handpicked by the Glitchy team</p>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="tool in toolRegistry.slice(0, 3)"
            :key="tool.meta.slug"
            :href="`/tools/${tool.meta.slug}`"
            class="flex gap-4 rounded-2xl bg-bg-card border border-border-card p-4 hover:border-white/15 transition-all hover:shadow-lg hover:shadow-black/20"
          >
            <!-- Tool icon -->
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

            <!-- Tool info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-white mb-0.5">{{ tool.meta.name }}</h3>
              <span class="inline-block text-[10px] font-medium text-accent-lime mb-1.5">{{ tool.meta.category }}</span>
              <p class="text-xs text-text-tertiary leading-relaxed line-clamp-2">{{ tool.meta.description }}</p>
            </div>
          </a>
        </div>
      </section>

      <!-- Free Tools -->
      <section class="pb-10 md:pb-16">
        <header class="mb-5 flex items-end justify-between">
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

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="tool in toolRegistry"
            :key="tool.meta.slug"
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
        </div>
      </section>
    </main>

    <CreativeSuiteSection />
    <BrandBanner />

    <GallerySection
      title="Email Templates"
      subtitle="Browse community-designed email templates for every campaign type"
      href="/email-templates"
    />

    <ExploreToolsSection />
    <CallToActionSection />
    <SiteFooter />
  </div>
</template>
