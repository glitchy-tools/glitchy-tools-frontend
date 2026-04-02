<script lang="ts">
export const toolMeta = {
  name: 'Timestamp Converter',
  slug: 'timestamp-converter',
  description: 'Convert between Unix timestamps and human-readable dates.',
  icon: '⏱️',
  category: 'Developer',
  seo: {
    title: 'Free Unix Timestamp Converter — Epoch to Date',
    description: 'Convert Unix timestamps to readable dates and vice versa. Supports seconds and milliseconds. Free, instant, browser-based.',
    keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'date to timestamp', 'epoch time'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const now = ref(Date.now())
const timestampInput = ref('')
const dateInput = ref('')
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(timer))

const currentFormatted = computed(() => ({
  unix: Math.floor(now.value / 1000),
  unixMs: now.value,
  iso: new Date(now.value).toISOString(),
  local: new Date(now.value).toLocaleString(),
}))

/** Convert a timestamp input to readable formats */
const fromTimestamp = computed(() => {
  const raw = timestampInput.value.trim()
  if (!raw) return null
  const num = Number(raw)
  if (isNaN(num)) return { error: 'Not a valid number' }
  const ms = raw.length > 12 ? num : num * 1000
  const d = new Date(ms)
  if (isNaN(d.getTime())) return { error: 'Invalid timestamp' }
  return {
    iso: d.toISOString(),
    local: d.toLocaleString(),
    utc: d.toUTCString(),
    relative: getRelative(ms),
  }
})

/** Convert a date string input to timestamps */
const fromDate = computed(() => {
  if (!dateInput.value.trim()) return null
  const d = new Date(dateInput.value)
  if (isNaN(d.getTime())) return { error: 'Invalid date format' }
  return {
    unix: Math.floor(d.getTime() / 1000),
    unixMs: d.getTime(),
    iso: d.toISOString(),
  }
})

/** Simple relative time description */
function getRelative(ms: number): string {
  const diff = ms - Date.now()
  const abs = Math.abs(diff)
  const suffix = diff > 0 ? 'from now' : 'ago'
  if (abs < 60000) return `${Math.floor(abs / 1000)}s ${suffix}`
  if (abs < 3600000) return `${Math.floor(abs / 60000)}m ${suffix}`
  if (abs < 86400000) return `${Math.floor(abs / 3600000)}h ${suffix}`
  return `${Math.floor(abs / 86400000)}d ${suffix}`
}

function copy(text: string) {
  navigator.clipboard.writeText(String(text))
}
</script>

<template>
  <div class="grid gap-6">
    <!-- Live clock -->
    <Card>
      <CardContent class="p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current Time</p>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(val, key) in currentFormatted" :key="key" class="flex items-center justify-between gap-2 rounded-md bg-accent px-3 py-2">
            <div class="min-w-0">
              <p class="text-xs text-muted-foreground">{{ key }}</p>
              <p class="text-sm font-mono truncate">{{ val }}</p>
            </div>
            <Button variant="outline" size="sm" class="shrink-0" @click="copy(String(val))">Copy</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Timestamp → Date -->
      <div>
        <label for="ts-input" class="text-sm font-medium">Timestamp to Date</label>
        <input
          id="ts-input"
          v-model="timestampInput"
          class="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. 1700000000"
        />
        <Card v-if="fromTimestamp" class="mt-3">
          <CardContent class="p-3">
            <p v-if="'error' in fromTimestamp" class="text-sm text-destructive">{{ fromTimestamp.error }}</p>
            <template v-else>
              <div v-for="(val, key) in fromTimestamp" :key="key" class="flex items-center justify-between py-1">
                <div>
                  <span class="text-xs text-muted-foreground">{{ key }}</span>
                  <p class="text-sm font-mono">{{ val }}</p>
                </div>
                <Button variant="outline" size="sm" @click="copy(String(val))">Copy</Button>
              </div>
            </template>
          </CardContent>
        </Card>
      </div>

      <!-- Date → Timestamp -->
      <div>
        <label for="date-input" class="text-sm font-medium">Date to Timestamp</label>
        <input
          id="date-input"
          v-model="dateInput"
          class="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. 2025-01-15 or Jan 15, 2025"
        />
        <Card v-if="fromDate" class="mt-3">
          <CardContent class="p-3">
            <p v-if="'error' in fromDate" class="text-sm text-destructive">{{ fromDate.error }}</p>
            <template v-else>
              <div v-for="(val, key) in fromDate" :key="key" class="flex items-center justify-between py-1">
                <div>
                  <span class="text-xs text-muted-foreground">{{ key }}</span>
                  <p class="text-sm font-mono">{{ val }}</p>
                </div>
                <Button variant="outline" size="sm" @click="copy(String(val))">Copy</Button>
              </div>
            </template>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
