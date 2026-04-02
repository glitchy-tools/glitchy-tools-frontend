<script lang="ts">
export const toolMeta = {
  name: 'Base64 Encoder / Decoder',
  slug: 'base64-encoder',
  description: 'Encode text to Base64 or decode Base64 back to text.',
  icon: '🔐',
  category: 'Developer',
  seo: {
    title: 'Free Online Base64 Encoder & Decoder',
    description: 'Encode text to Base64 or decode Base64 strings instantly. Free, runs in your browser, no data sent anywhere.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'encode base64', 'decode base64'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'

const input = ref('')
const mode = ref<'encode' | 'decode'>('encode')

const output = computed(() => {
  if (!input.value.trim()) return ''
  try {
    return mode.value === 'encode'
      ? btoa(unescape(encodeURIComponent(input.value)))
      : decodeURIComponent(escape(atob(input.value)))
  } catch {
    return mode.value === 'encode' ? 'Encoding error' : 'Invalid Base64'
  }
})

const isError = computed(() => output.value === 'Invalid Base64' || output.value === 'Encoding error')

function handleCopy() {
  if (output.value && !isError.value) {
    navigator.clipboard.writeText(output.value)
  }
}

function swap() {
  const prev = output.value
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  if (prev && !isError.value) input.value = prev
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex gap-2">
      <Button
        :variant="mode === 'encode' ? 'default' : 'outline'"
        size="sm"
        @click="mode = 'encode'"
      >
        Encode
      </Button>
      <Button
        :variant="mode === 'decode' ? 'default' : 'outline'"
        size="sm"
        @click="mode = 'decode'"
      >
        Decode
      </Button>
      <Button variant="outline" size="sm" @click="swap">Swap</Button>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label for="b64-input" class="text-sm font-medium">
          {{ mode === 'encode' ? 'Text' : 'Base64' }}
        </label>
        <textarea
          id="b64-input"
          v-model="input"
          class="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
          :placeholder="mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">
            {{ mode === 'encode' ? 'Base64' : 'Text' }}
          </label>
          <Button variant="outline" size="sm" :disabled="!output || isError" @click="handleCopy">
            Copy
          </Button>
        </div>
        <pre
          class="min-h-[200px] w-full rounded-md border bg-muted px-3 py-2 text-sm font-mono overflow-auto whitespace-pre-wrap break-all"
          :class="{ 'text-destructive': isError }"
        >{{ output || 'Output will appear here...' }}</pre>
      </div>
    </div>
  </div>
</template>
