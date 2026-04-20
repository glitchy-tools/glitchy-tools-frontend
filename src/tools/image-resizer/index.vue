<script lang="ts">
export const toolMeta = {
  name: 'Image Resizer',
  slug: 'image-resizer',
  description: 'Resize and crop images to exact dimensions. Presets for social media platforms.',
  icon: '🖼️',
  category: 'Design',
  seo: {
    title: 'Image Resizer — Glitchy Tools',
    description: 'Resize images to exact dimensions for social media, ads, and web. Runs in your browser.',
    keywords: ['image resizer', 'resize image', 'crop image', 'social media size', 'image dimensions'],
  },
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { downloadDataUrl } from '@/lib/download'

const imageUrl = ref('')
const width = ref(1200)
const height = ref(630)
const resultUrl = ref('')
const canvas = ref<HTMLCanvasElement | null>(null)

const presets = [
  { label: 'Facebook Post', w: 1200, h: 630 },
  { label: 'Instagram Post', w: 1080, h: 1080 },
  { label: 'Twitter Header', w: 1500, h: 500 },
  { label: 'YouTube Thumb', w: 1280, h: 720 },
  { label: 'LinkedIn Post', w: 1200, h: 627 },
  { label: 'Pinterest Pin', w: 1000, h: 1500 },
]

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageUrl.value = URL.createObjectURL(file)
  resultUrl.value = ''
}

function applyPreset(p: { w: number; h: number }) {
  width.value = p.w
  height.value = p.h
}

function resize() {
  if (!imageUrl.value) return
  const img = new Image()
  img.onload = () => {
    const c = document.createElement('canvas')
    c.width = width.value
    c.height = height.value
    const ctx = c.getContext('2d')!
    ctx.drawImage(img, 0, 0, width.value, height.value)
    resultUrl.value = c.toDataURL('image/png')
  }
  img.src = imageUrl.value
}

function download() {
  if (resultUrl.value) downloadDataUrl(resultUrl.value, `resized-${width.value}x${height.value}.png`)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-teal-900/30 to-cyan-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🖼️</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Image Resizer</h2>
          <p class="text-sm text-text-secondary">Resize images with social media presets</p>
        </div>
      </div>
    </div>

    <div v-if="!imageUrl" class="rounded-2xl bg-bg-card border border-border-card p-6">
      <label class="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border-card p-12 cursor-pointer hover:border-accent-lime/50 transition-colors group">
        <div class="h-16 w-16 rounded-2xl bg-bg-surface flex items-center justify-center group-hover:bg-accent-lime/10 transition-colors"><span class="text-3xl">📁</span></div>
        <div class="text-center"><p class="text-sm font-medium text-text-primary mb-1">Upload an image</p><p class="text-xs text-text-muted">PNG, JPG, or WebP</p></div>
        <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
      </label>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Dimensions</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Width (px)</label><input v-model.number="width" type="number" min="1" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Height (px)</label><input v-model.number="height" type="number" min="1" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
        </div>
        <p class="text-xs font-medium text-text-secondary mb-2">Presets</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <button v-for="p in presets" :key="p.label" @click="applyPreset(p)" class="rounded-full px-3 py-1 text-xs font-medium bg-bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-white/20 transition-colors">{{ p.label }}</button>
        </div>
        <div class="flex gap-2">
          <button @click="resize" class="rounded-xl bg-accent-lime text-bg-primary px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition-all">Resize</button>
          <button @click="imageUrl = ''; resultUrl = ''" class="rounded-xl border border-border-card text-text-secondary px-4 py-2.5 text-sm font-medium hover:text-text-primary transition-colors">Reset</button>
        </div>
      </div>

      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-text-primary">{{ resultUrl ? 'Result' : 'Original' }}</h3>
          <button v-if="resultUrl" @click="download" class="rounded-lg bg-accent-lime text-bg-primary px-3 py-1.5 text-xs font-semibold hover:brightness-110 transition-all">Download</button>
        </div>
        <img :src="resultUrl || imageUrl" class="max-w-full rounded-xl border border-border-card" alt="Preview" />
      </div>
    </div>
  </div>
</template>
