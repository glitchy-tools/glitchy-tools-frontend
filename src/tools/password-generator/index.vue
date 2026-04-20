<script lang="ts">
export const toolMeta = {
  name: 'Password Generator',
  slug: 'password-generator',
  description: 'Generate secure, random passwords with customizable length and character sets.',
  icon: '🔐',
  category: 'Productivity',
  seo: {
    title: 'Password Generator — Glitchy Tools',
    description: 'Generate strong random passwords instantly. Customize length, symbols, and character types.',
    keywords: ['password generator', 'random password', 'secure password', 'strong password', 'password tool'],
  },
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const length = ref(16)
const uppercase = ref(true)
const lowercase = ref(true)
const numbers = ref(true)
const symbols = ref(true)
const password = ref('')
const history = ref<string[]>([])

function generate() {
  let chars = ''
  if (uppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (lowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (numbers.value) chars += '0123456789'
  if (symbols.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'

  const arr = new Uint32Array(length.value)
  crypto.getRandomValues(arr)
  password.value = Array.from(arr, v => chars[v % chars.length]).join('')
  history.value.unshift(password.value)
  if (history.value.length > 5) history.value.pop()
}

generate()
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-amber-900/30 to-yellow-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🔐</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Password Generator</h2>
          <p class="text-sm text-text-secondary">Generate secure random passwords instantly</p>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-bg-card p-6 border border-border-card text-center">
      <p class="text-2xl md:text-3xl font-mono font-bold text-accent-lime tracking-wider break-all mb-4">{{ password }}</p>
      <div class="flex justify-center gap-2">
        <button @click="copy(password)" class="rounded-xl bg-accent-lime text-bg-primary px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition-all">{{ copied ? 'Copied!' : 'Copy' }}</button>
        <button @click="generate" class="rounded-xl border border-border-card text-text-secondary px-4 py-2.5 text-sm font-medium hover:text-text-primary hover:border-white/20 transition-colors">Regenerate</button>
      </div>
    </div>

    <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
      <h3 class="text-sm font-semibold text-text-primary mb-4">Options</h3>
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-xs font-medium text-text-secondary mb-1.5 block">Length: {{ length }}</label>
          <input v-model.number="length" type="range" min="8" max="64" class="w-full accent-[rgb(168,130,255)]" @change="generate" />
          <div class="flex justify-between text-xs text-text-muted"><span>8</span><span>64</span></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"><input v-model="uppercase" type="checkbox" class="accent-[rgb(168,130,255)]" @change="generate" /> Uppercase (A-Z)</label>
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"><input v-model="lowercase" type="checkbox" class="accent-[rgb(168,130,255)]" @change="generate" /> Lowercase (a-z)</label>
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"><input v-model="numbers" type="checkbox" class="accent-[rgb(168,130,255)]" @change="generate" /> Numbers (0-9)</label>
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer"><input v-model="symbols" type="checkbox" class="accent-[rgb(168,130,255)]" @change="generate" /> Symbols (!@#$)</label>
        </div>
      </div>
    </div>

    <div v-if="history.length > 1" class="rounded-2xl bg-bg-card p-5 border border-border-card">
      <h3 class="text-sm font-semibold text-text-primary mb-3">Recent</h3>
      <div class="flex flex-col gap-2">
        <div v-for="(p, i) in history.slice(1)" :key="i" class="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
          <code class="text-xs font-mono text-text-muted truncate mr-3">{{ p }}</code>
          <button @click="copy(p)" class="text-xs text-accent-lime shrink-0">Copy</button>
        </div>
      </div>
    </div>
  </div>
</template>
