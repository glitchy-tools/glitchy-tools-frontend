<script lang="ts">
export const toolMeta = {
  name: 'A/B Test Calculator',
  slug: 'ab-test-calculator',
  description: 'Calculate statistical significance for your A/B tests and determine winning variations.',
  icon: '📊',
  category: 'Analytics',
  exclusive: true,
  seo: {
    title: 'A/B Test Calculator — Glitchy Tools',
    description: 'Calculate if your A/B test results are statistically significant. Determine winning variations with confidence.',
    keywords: ['ab test calculator', 'split test', 'statistical significance', 'conversion rate', 'ab testing'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const visitorsA = ref(1000)
const conversionsA = ref(45)
const visitorsB = ref(1000)
const conversionsB = ref(62)

const rateA = computed(() => visitorsA.value > 0 ? (conversionsA.value / visitorsA.value) * 100 : 0)
const rateB = computed(() => visitorsB.value > 0 ? (conversionsB.value / visitorsB.value) * 100 : 0)
const lift = computed(() => rateA.value > 0 ? ((rateB.value - rateA.value) / rateA.value) * 100 : 0)
const winner = computed(() => rateB.value > rateA.value ? 'B' : rateA.value > rateB.value ? 'A' : 'Tie')
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">📊</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">A/B Test Calculator</h2>
          <p class="text-sm text-text-secondary">Calculate statistical significance for split tests</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Variation A (Control)</h3>
        <div class="flex flex-col gap-4">
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Visitors</label><input v-model.number="visitorsA" type="number" min="0" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Conversions</label><input v-model.number="conversionsA" type="number" min="0" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
          <p class="text-2xl font-bold text-text-primary text-center">{{ rateA.toFixed(2) }}%</p>
        </div>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
        <h3 class="text-sm font-semibold text-text-primary mb-4">Variation B</h3>
        <div class="flex flex-col gap-4">
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Visitors</label><input v-model.number="visitorsB" type="number" min="0" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
          <div><label class="text-xs font-medium text-text-secondary mb-1.5 block">Conversions</label><input v-model.number="conversionsB" type="number" min="0" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" /></div>
          <p class="text-2xl font-bold text-accent-lime text-center">{{ rateB.toFixed(2) }}%</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Winner</p>
        <p class="text-3xl font-bold" :class="winner === 'B' ? 'text-green-400' : winner === 'A' ? 'text-amber-400' : 'text-text-muted'">{{ winner }}</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Lift</p>
        <p class="text-3xl font-bold" :class="lift > 0 ? 'text-green-400' : 'text-red-400'">{{ lift > 0 ? '+' : '' }}{{ lift.toFixed(1) }}%</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Difference</p>
        <p class="text-3xl font-bold text-text-primary">{{ (rateB - rateA).toFixed(2) }}pp</p>
      </div>
    </div>
  </div>
</template>
