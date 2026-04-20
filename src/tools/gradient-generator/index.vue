<script lang="ts">
export const toolMeta = {
  name: 'Gradient Generator',
  slug: 'gradient-generator',
  description: 'Create beautiful CSS gradients with a visual editor. Copy CSS or Tailwind classes.',
  icon: '🎨',
  category: 'Design',
  seo: {
    title: 'CSS Gradient Generator — Glitchy Tools',
    description: 'Create beautiful CSS gradients visually. Generate linear and radial gradients with Tailwind support.',
    keywords: ['gradient generator', 'css gradient', 'tailwind gradient', 'color gradient', 'gradient maker'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const color1 = ref('#a855f7')
const color2 = ref('#3b82f6')
const angle = ref(135)
const type = ref<'linear' | 'radial'>('linear')

const css = computed(() => {
  if (type.value === 'radial') return `background: radial-gradient(circle, ${color1.value}, ${color2.value});`
  return `background: linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value});`
})

const style = computed(() => {
  if (type.value === 'radial') return { background: `radial-gradient(circle, ${color1.value}, ${color2.value})` }
  return { background: `linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value})` }
})

const presets = [
  { c1: '#a855f7', c2: '#3b82f6', label: 'Purple Blue' },
  { c1: '#f43f5e', c2: '#f97316', label: 'Rose Orange' },
  { c1: '#10b981', c2: '#06b6d4', label: 'Emerald Cyan' },
  { c1: '#eab308', c2: '#ef4444', label: 'Yellow Red' },
  { c1: '#8b5cf6', c2: '#ec4899', label: 'Violet Pink' },
  { c1: '#06b6d4', c2: '#3b82f6', label: 'Cyan Blue' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-violet-900/30 to-blue-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🎨</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Gradient Generator</h2>
          <p class="text-sm text-text-secondary">Create beautiful CSS gradients visually</p>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="rounded-2xl overflow-hidden border border-border-card h-48" :style="style" />

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Controls</h3>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2">
            <button class="rounded-full px-4 py-1.5 text-sm font-medium transition-all" :class="type === 'linear' ? 'bg-accent-lime text-bg-primary' : 'bg-bg-surface border border-border-card text-text-secondary'" @click="type = 'linear'">Linear</button>
            <button class="rounded-full px-4 py-1.5 text-sm font-medium transition-all" :class="type === 'radial' ? 'bg-accent-lime text-bg-primary' : 'bg-bg-surface border border-border-card text-text-secondary'" @click="type = 'radial'">Radial</button>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Color 1</label>
              <div class="flex gap-2"><input v-model="color1" type="color" class="h-10 w-12 rounded-lg cursor-pointer border-0 bg-transparent" /><input v-model="color1" type="text" class="flex-1 rounded-xl border border-border-card bg-bg-surface px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Color 2</label>
              <div class="flex gap-2"><input v-model="color2" type="color" class="h-10 w-12 rounded-lg cursor-pointer border-0 bg-transparent" /><input v-model="color2" type="text" class="flex-1 rounded-xl border border-border-card bg-bg-surface px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
            </div>
          </div>
          <div v-if="type === 'linear'">
            <label class="text-xs font-medium text-text-secondary mb-1.5 block">Angle: {{ angle }}°</label>
            <input v-model.number="angle" type="range" min="0" max="360" class="w-full accent-[rgb(168,130,255)]" />
          </div>
          <div>
            <p class="text-xs font-medium text-text-secondary mb-2">Presets</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="p in presets" :key="p.label" @click="color1 = p.c1; color2 = p.c2" class="h-8 w-8 rounded-lg border border-border-card hover:scale-110 transition-transform" :style="{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }" :title="p.label" />
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-bg-card p-5 border border-border-card flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-primary">CSS Output</h3>
          <button @click="copy(css)" class="rounded-lg bg-accent-lime text-bg-primary px-3 py-1.5 text-xs font-semibold hover:brightness-110 transition-all">{{ copied ? 'Copied!' : 'Copy CSS' }}</button>
        </div>
        <pre class="rounded-xl bg-bg-primary p-4 border border-border-subtle text-sm font-mono text-accent-lime">{{ css }}</pre>
      </div>
    </div>
  </div>
</template>
