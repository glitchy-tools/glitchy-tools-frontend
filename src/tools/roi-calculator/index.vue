<script lang="ts">
export const toolMeta = {
  name: 'ROI Calculator',
  slug: 'roi-calculator',
  description: 'Calculate return on investment for your marketing campaigns and ad spend.',
  icon: '💰',
  category: 'Analytics',
  seo: {
    title: 'ROI Calculator — Glitchy Tools',
    description: 'Calculate ROI, ROAS, and profit margins for marketing campaigns. Free affiliate marketing calculator.',
    keywords: ['roi calculator', 'roas calculator', 'marketing roi', 'ad spend calculator', 'profit calculator'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const revenue = ref(5000)
const cost = ref(1500)

const roi = computed(() => cost.value > 0 ? ((revenue.value - cost.value) / cost.value) * 100 : 0)
const roas = computed(() => cost.value > 0 ? revenue.value / cost.value : 0)
const profit = computed(() => revenue.value - cost.value)
const margin = computed(() => revenue.value > 0 ? (profit.value / revenue.value) * 100 : 0)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">💰</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">ROI Calculator</h2>
          <p class="text-sm text-text-secondary">Calculate return on investment for your campaigns</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Input</h3>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-xs font-medium text-text-secondary mb-1.5 block">Revenue ($)</label>
            <input v-model.number="revenue" type="number" min="0" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
          </div>
          <div>
            <label class="text-xs font-medium text-text-secondary mb-1.5 block">Cost / Ad Spend ($)</label>
            <input v-model.number="cost" type="number" min="0" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
          <p class="text-xs text-text-muted mb-1">ROI</p>
          <p class="text-3xl font-bold" :class="roi >= 0 ? 'text-green-400' : 'text-red-400'">{{ roi.toFixed(1) }}%</p>
        </div>
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
          <p class="text-xs text-text-muted mb-1">ROAS</p>
          <p class="text-3xl font-bold text-accent-lime">{{ roas.toFixed(2) }}x</p>
        </div>
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
          <p class="text-xs text-text-muted mb-1">Profit</p>
          <p class="text-3xl font-bold" :class="profit >= 0 ? 'text-green-400' : 'text-red-400'">${{ profit.toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
          <p class="text-xs text-text-muted mb-1">Margin</p>
          <p class="text-3xl font-bold text-text-primary">{{ margin.toFixed(1) }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>
