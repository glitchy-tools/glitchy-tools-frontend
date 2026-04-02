<script lang="ts">
export const toolMeta = {
  name: 'Password Generator',
  slug: 'password-generator',
  description: 'Generate strong, random passwords with custom rules.',
  icon: '🔑',
  category: 'Utility',
  seo: {
    title: 'Free Strong Password Generator',
    description: 'Generate secure random passwords with custom length and character options. Runs locally in your browser — nothing is stored or sent.',
    keywords: ['password generator', 'random password', 'strong password', 'secure password generator', 'password tool'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const length = ref(20)
const uppercase = ref(true)
const lowercase = ref(true)
const numbers = ref(true)
const symbols = ref(true)
const passwords = ref<string[]>([])

const charsets = computed(() => {
  let chars = ''
  if (lowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (uppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (numbers.value) chars += '0123456789'
  if (symbols.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  return chars
})

/** Generate a cryptographically random password */
function generate() {
  if (!charsets.value) return
  const arr = new Uint32Array(length.value)
  crypto.getRandomValues(arr)
  const pw = Array.from(arr, (v) => charsets.value[v % charsets.value.length]).join('')
  passwords.value.unshift(pw)
  if (passwords.value.length > 10) passwords.value.pop()
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
}

generate()
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[300px_1fr]">
    <!-- Controls -->
    <div class="flex flex-col gap-4">
      <div>
        <label for="pw-length" class="text-sm font-medium">Length: {{ length }}</label>
        <input
          id="pw-length"
          v-model.number="length"
          type="range"
          min="8"
          max="64"
          class="mt-1 w-full accent-primary"
        />
        <div class="flex justify-between text-xs text-muted-foreground">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      <label class="flex items-center gap-2 text-sm">
        <input v-model="uppercase" type="checkbox" class="accent-primary" />
        Uppercase (A-Z)
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="lowercase" type="checkbox" class="accent-primary" />
        Lowercase (a-z)
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="numbers" type="checkbox" class="accent-primary" />
        Numbers (0-9)
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="symbols" type="checkbox" class="accent-primary" />
        Symbols (!@#$...)
      </label>

      <Button @click="generate" :disabled="!charsets">Generate</Button>
    </div>

    <!-- Results -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Generated passwords</p>
      <Card v-for="(pw, i) in passwords" :key="i">
        <CardContent class="flex items-center justify-between gap-4 p-3">
          <code class="text-sm font-mono break-all">{{ pw }}</code>
          <Button variant="outline" size="sm" class="shrink-0" @click="copy(pw)">Copy</Button>
        </CardContent>
      </Card>
      <p v-if="passwords.length === 0" class="text-sm text-muted-foreground">No passwords yet. Click Generate.</p>
    </div>
  </div>
</template>
