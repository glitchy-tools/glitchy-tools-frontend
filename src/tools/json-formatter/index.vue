<script lang="ts">
export const toolMeta = {
  name: 'JSON Formatter',
  slug: 'json-formatter',
  description: 'Paste raw JSON and get it pretty-printed instantly.',
  icon: '{ }',
  category: 'Developer',
  seo: {
    title: 'Free Online JSON Formatter & Pretty Printer',
    description: 'Paste raw JSON and instantly format it with proper indentation. Free, runs in your browser, no data sent anywhere.',
    keywords: ['json formatter', 'json pretty print', 'json beautifier', 'format json online', 'json validator'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'

const input = ref('')

const formatted = computed(() => {
  if (!input.value.trim()) return ''
  try {
    return JSON.stringify(JSON.parse(input.value), null, 2)
  } catch {
    return 'Invalid JSON'
  }
})

const isError = computed(() => formatted.value === 'Invalid JSON')

function handleCopy() {
  if (formatted.value && !isError.value) {
    navigator.clipboard.writeText(formatted.value)
  }
}

function handleClear() {
  input.value = ''
}
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <div class="flex flex-col gap-2">
      <label for="json-input" class="text-sm font-medium">Input</label>
      <textarea
        id="json-input"
        v-model="input"
        class="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
        placeholder="Paste your JSON here..."
      />
      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="handleClear">Clear</Button>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium">Output</label>
        <Button variant="outline" size="sm" :disabled="!formatted || isError" @click="handleCopy">
          Copy
        </Button>
      </div>
      <pre
        class="min-h-[300px] w-full rounded-md border bg-muted px-3 py-2 text-sm font-mono overflow-auto"
        :class="{ 'text-destructive': isError }"
      >{{ formatted || 'Output will appear here...' }}</pre>
    </div>
  </div>
</template>
