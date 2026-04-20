<script lang="ts">
export const toolMeta = {
  name: 'Funnel Mapper',
  slug: 'funnel-builder',
  description: 'Map out your marketing funnel stages and calculate conversion rates at each step.',
  icon: '🎯',
  category: 'Marketing',
  exclusive: true,
  seo: {
    title: 'Funnel Mapper — Glitchy Tools',
    description: 'Visualize and optimize your marketing funnel. Calculate drop-off rates and identify bottlenecks.',
    keywords: ['funnel builder', 'conversion funnel', 'marketing funnel', 'funnel optimization', 'drop-off rate'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const stages = ref([
  { name: 'Ad Impressions', count: 10000 },
  { name: 'Clicks', count: 500 },
  { name: 'Landing Page', count: 450 },
  { name: 'Sign Up', count: 120 },
  { name: 'Purchase', count: 35 },
])

const funnelData = computed(() => {
  return stages.value.map((stage, i) => {
    const prev = i > 0 ? stages.value[i - 1].count : stage.count
    const rate = prev > 0 ? (stage.count / prev) * 100 : 0
    const overallRate = stages.value[0].count > 0 ? (stage.count / stages.value[0].count) * 100 : 0
    return { ...stage, rate, overallRate }
  })
})

function addStage() {
  stages.value.push({ name: 'New Stage', count: 0 })
}
function removeStage(i: number) {
  if (stages.value.length > 2) stages.value.splice(i, 1)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🎯</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Funnel Mapper</h2>
          <p class="text-sm text-text-secondary">Visualize conversion rates through your funnel</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div v-for="(stage, i) in funnelData" :key="i" class="rounded-2xl bg-bg-card border border-border-card p-4">
        <div class="flex items-center gap-4">
          <div class="flex-1 grid grid-cols-2 gap-3">
            <input v-model="stages[i].name" type="text" class="rounded-xl border border-border-card bg-bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" />
            <input v-model.number="stages[i].count" type="number" min="0" class="rounded-xl border border-border-card bg-bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50" />
          </div>
          <div class="w-20 text-right">
            <p v-if="i > 0" class="text-sm font-semibold" :class="stage.rate >= 50 ? 'text-green-400' : stage.rate >= 20 ? 'text-amber-400' : 'text-red-400'">{{ stage.rate.toFixed(1) }}%</p>
            <p v-else class="text-sm text-text-muted">Start</p>
          </div>
          <button v-if="stages.length > 2" @click="removeStage(i)" class="text-text-muted hover:text-red-400 transition-colors text-sm">✕</button>
        </div>
        <div v-if="i > 0" class="mt-2 h-1.5 rounded-full bg-bg-surface overflow-hidden">
          <div class="h-full rounded-full transition-all" :class="stage.rate >= 50 ? 'bg-green-400' : stage.rate >= 20 ? 'bg-amber-400' : 'bg-red-400'" :style="{ width: stage.rate + '%' }" />
        </div>
      </div>
    </div>

    <button @click="addStage" class="self-start rounded-xl border border-border-card text-text-secondary px-4 py-2 text-sm font-medium hover:text-text-primary hover:border-white/20 transition-colors">
      + Add Stage
    </button>
  </div>
</template>
