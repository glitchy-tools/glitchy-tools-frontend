<script lang="ts">
export const toolMeta = {
  name: 'Percentage Calculator',
  slug: 'percentage-calculator',
  description: 'Calculate percentages, increases, decreases, and ratios.',
  icon: '%',
  category: 'Data',
  seo: {
    title: 'Free Percentage Calculator — Increase, Decrease & Ratio',
    description: 'Calculate percentages, percentage increase/decrease, and what percent one number is of another. Free and instant.',
    keywords: ['percentage calculator', 'percent increase', 'percent decrease', 'percentage of number', 'ratio calculator'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const whatPercent = ref({ percent: '', of: '' })
const whatIs = ref({ a: '', b: '' })
const change = ref({ from: '', to: '' })

const whatPercentResult = computed(() => {
  const p = parseFloat(whatPercent.value.percent)
  const o = parseFloat(whatPercent.value.of)
  if (isNaN(p) || isNaN(o)) return null
  return (p / 100) * o
})

const whatIsResult = computed(() => {
  const a = parseFloat(whatIs.value.a)
  const b = parseFloat(whatIs.value.b)
  if (isNaN(a) || isNaN(b) || b === 0) return null
  return (a / b) * 100
})

const changeResult = computed(() => {
  const f = parseFloat(change.value.from)
  const t = parseFloat(change.value.to)
  if (isNaN(f) || isNaN(t) || f === 0) return null
  return ((t - f) / f) * 100
})

function fmt(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2)
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <!-- What is X% of Y -->
    <Card>
      <CardHeader class="p-4 pb-2">
        <CardTitle class="text-sm">What is X% of Y?</CardTitle>
      </CardHeader>
      <CardContent class="p-4 pt-2">
        <div class="flex items-center gap-2 text-sm">
          <input
            v-model="whatPercent.percent"
            type="number"
            aria-label="Percentage"
            placeholder="%"
            class="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <span class="text-muted-foreground">% of</span>
          <input
            v-model="whatPercent.of"
            type="number"
            aria-label="Number"
            placeholder="number"
            class="h-9 w-24 rounded-md border border-input bg-transparent px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div v-if="whatPercentResult !== null" class="mt-3 rounded-md bg-accent px-3 py-2">
          <p class="text-lg font-bold text-primary">{{ fmt(whatPercentResult) }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- X is what % of Y -->
    <Card>
      <CardHeader class="p-4 pb-2">
        <CardTitle class="text-sm">X is what % of Y?</CardTitle>
      </CardHeader>
      <CardContent class="p-4 pt-2">
        <div class="flex items-center gap-2 text-sm">
          <input
            v-model="whatIs.a"
            type="number"
            aria-label="Part"
            placeholder="part"
            class="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <span class="text-muted-foreground">is what % of</span>
          <input
            v-model="whatIs.b"
            type="number"
            aria-label="Whole"
            placeholder="whole"
            class="h-9 w-24 rounded-md border border-input bg-transparent px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div v-if="whatIsResult !== null" class="mt-3 rounded-md bg-accent px-3 py-2">
          <p class="text-lg font-bold text-primary">{{ fmt(whatIsResult) }}%</p>
        </div>
      </CardContent>
    </Card>

    <!-- Percent change -->
    <Card>
      <CardHeader class="p-4 pb-2">
        <CardTitle class="text-sm">% Change</CardTitle>
      </CardHeader>
      <CardContent class="p-4 pt-2">
        <div class="flex items-center gap-2 text-sm">
          <input
            v-model="change.from"
            type="number"
            aria-label="From value"
            placeholder="from"
            class="h-9 w-20 rounded-md border border-input bg-transparent px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <span class="text-muted-foreground">to</span>
          <input
            v-model="change.to"
            type="number"
            aria-label="To value"
            placeholder="to"
            class="h-9 w-24 rounded-md border border-input bg-transparent px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div v-if="changeResult !== null" class="mt-3 rounded-md bg-accent px-3 py-2">
          <p class="text-lg font-bold" :class="changeResult >= 0 ? 'text-green-500' : 'text-destructive'">
            {{ changeResult >= 0 ? '+' : '' }}{{ fmt(changeResult) }}%
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
