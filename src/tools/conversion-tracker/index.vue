<script lang="ts">
export const toolMeta = {
  name: 'Conversion Tracker',
  slug: 'conversion-tracker',
  description: 'Track and compare conversion rates across multiple campaigns and traffic sources.',
  icon: '📈',
  category: 'Analytics',
  exclusive: true,
  seo: {
    title: 'Conversion Tracker — Glitchy Tools',
    description: 'Track conversion rates across campaigns. Compare traffic sources and identify top performers.',
    keywords: ['conversion tracker', 'campaign tracker', 'conversion rate', 'traffic source', 'performance tracking'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const campaigns = ref([
  { name: 'Facebook - Lookalike', clicks: 2500, conversions: 87, revenue: 4350 },
  { name: 'Google - Brand', clicks: 1800, conversions: 142, revenue: 7100 },
  { name: 'TikTok - UGC', clicks: 3200, conversions: 64, revenue: 3200 },
  { name: 'Email - Newsletter', clicks: 950, conversions: 76, revenue: 3800 },
])

const totals = computed(() => ({
  clicks: campaigns.value.reduce((s, c) => s + c.clicks, 0),
  conversions: campaigns.value.reduce((s, c) => s + c.conversions, 0),
  revenue: campaigns.value.reduce((s, c) => s + c.revenue, 0),
}))

function addCampaign() {
  campaigns.value.push({ name: 'New Campaign', clicks: 0, conversions: 0, revenue: 0 })
}
function removeCampaign(i: number) {
  if (campaigns.value.length > 1) campaigns.value.splice(i, 1)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-emerald-900/30 to-green-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">📈</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Conversion Tracker</h2>
          <p class="text-sm text-text-secondary">Compare campaign performance side by side</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Total Clicks</p>
        <p class="text-3xl font-bold text-text-primary">{{ totals.clicks.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Total Conversions</p>
        <p class="text-3xl font-bold text-green-400">{{ totals.conversions.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card text-center">
        <p class="text-xs text-text-muted mb-1">Total Revenue</p>
        <p class="text-3xl font-bold text-accent-lime">${{ totals.revenue.toLocaleString() }}</p>
      </div>
    </div>

    <div class="rounded-2xl bg-bg-card border border-border-card overflow-hidden">
      <div class="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_0.5fr_auto] items-center gap-4 px-5 py-3 border-b border-border-subtle">
        <span class="text-xs font-medium text-text-muted uppercase">Campaign</span>
        <span class="text-xs font-medium text-text-muted uppercase text-right">Clicks</span>
        <span class="text-xs font-medium text-text-muted uppercase text-right">Conversions</span>
        <span class="text-xs font-medium text-text-muted uppercase text-right">Revenue</span>
        <span class="text-xs font-medium text-text-muted uppercase text-right">CVR</span>
        <span class="w-6" />
      </div>
      <div v-for="(c, i) in campaigns" :key="i" class="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_0.5fr_auto] items-center gap-4 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface/50 transition-colors">
        <input v-model="c.name" type="text" class="bg-transparent text-sm text-text-primary focus:outline-none" />
        <input v-model.number="c.clicks" type="number" min="0" class="bg-transparent text-sm text-text-secondary text-right focus:outline-none tabular-nums" />
        <input v-model.number="c.conversions" type="number" min="0" class="bg-transparent text-sm text-green-400 text-right focus:outline-none tabular-nums" />
        <input v-model.number="c.revenue" type="number" min="0" class="bg-transparent text-sm text-accent-lime text-right focus:outline-none tabular-nums" />
        <span class="text-sm font-medium text-right tabular-nums" :class="c.clicks > 0 && (c.conversions / c.clicks) * 100 > 5 ? 'text-green-400' : 'text-text-secondary'">{{ c.clicks > 0 ? ((c.conversions / c.clicks) * 100).toFixed(1) : '0.0' }}%</span>
        <button @click="removeCampaign(i)" class="text-text-muted hover:text-red-400 transition-colors text-xs w-6 text-center">✕</button>
      </div>
    </div>

    <button @click="addCampaign" class="self-start rounded-xl border border-border-card text-text-secondary px-4 py-2 text-sm font-medium hover:text-text-primary hover:border-white/20 transition-colors">
      + Add Campaign
    </button>
  </div>
</template>
