<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  subtitle: string
  href: string
  badge?: string
  columns?: number
  itemCount?: number
}>(), {
  columns: 5,
  itemCount: 20,
})

interface GalleryItem {
  id: string
  href: string
}

const items = computed(() =>
  Array.from({ length: props.itemCount }, (_, i) => ({
    id: `${props.title}-${i}`,
    href: props.href,
  }))
)

const heights = ['h-48', 'h-64', 'h-56', 'h-72', 'h-52', 'h-60', 'h-44']

function getColumns(items: GalleryItem[]) {
  const cols: GalleryItem[][] = Array.from({ length: props.columns }, () => [])
  items.forEach((item, i) => {
    cols[i % props.columns].push(item)
  })
  return cols
}

function getHeight(index: number): string {
  return heights[index % heights.length]
}

function getGradient(index: number): string {
  const hue = 260 + (index * 13) % 40
  return `linear-gradient(${135 + index * 20}deg, hsl(${hue}, ${25 + (index * 5) % 20}%, ${16 + (index * 3) % 10}%), hsl(${hue + 15}, ${15 + (index * 3) % 15}%, ${10 + (index * 2) % 8}%))`
}
</script>

<template>
  <section class="mb-10 md:mb-16 site-container relative">
    <header class="mb-4 md:mb-5 space-y-1">
      <div class="flex items-center gap-3">
        <a :href="href" class="text-base md:text-lg font-bold uppercase text-accent-lime hover:underline transition-colors flex items-center gap-2">
          {{ title }}
        </a>
        <span v-if="badge" class="text-[10px] font-semibold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
          {{ badge }}
        </span>
      </div>
      <p class="text-sm text-text-secondary">{{ subtitle }}</p>
    </header>

    <div class="h-[56rem] overflow-hidden relative">
      <div class="flex gap-2">
        <div
          v-for="(col, colIdx) in getColumns(items)"
          :key="colIdx"
          class="flex-1 flex flex-col gap-2"
          :class="{
            'hidden md:flex': colIdx >= 2 && colIdx < 4,
            'hidden lg:flex': colIdx >= 4,
          }"
        >
          <a
            v-for="(item, itemIdx) in col"
            :key="item.id"
            :href="item.href"
            class="block rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-200"
            :class="getHeight(colIdx * 4 + itemIdx)"
          >
            <div class="w-full h-full" :style="{ background: getGradient(colIdx * 10 + itemIdx) }" />
          </a>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-bg-primary to-transparent flex items-end justify-center pb-6">
        <a :href="href" class="flex items-center gap-2 text-sm text-white bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors">
          View all of {{ title }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
        </a>
      </div>
    </div>
  </section>
</template>
