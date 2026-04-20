<script lang="ts">
export const toolMeta = {
  name: 'Regex Tester',
  slug: 'regex-tester',
  description: 'Test regular expressions with live matching, highlighting, and match groups.',
  icon: '🔍',
  category: 'Productivity',
  seo: {
    title: 'Regex Tester — Glitchy Tools',
    description: 'Test and debug regular expressions with live matching and group highlighting.',
    keywords: ['regex tester', 'regular expression', 'regex debugger', 'regex match', 'pattern tester'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const pattern = ref('(\\w+)@(\\w+\\.\\w+)')
const flags = ref('g')
const testString = ref('Contact us at hello@glitchy.com or support@glitchy.com for help.')

const results = computed(() => {
  if (!pattern.value) return { matches: [], error: '' }
  try {
    const regex = new RegExp(pattern.value, flags.value)
    const matches: { full: string; groups: string[]; index: number }[] = []
    let match: RegExpExecArray | null

    if (flags.value.includes('g')) {
      while ((match = regex.exec(testString.value)) !== null) {
        matches.push({ full: match[0], groups: match.slice(1), index: match.index })
        if (!match[0]) break
      }
    } else {
      match = regex.exec(testString.value)
      if (match) matches.push({ full: match[0], groups: match.slice(1), index: match.index })
    }

    return { matches, error: '' }
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex' }
  }
})

const flagOptions = [
  { value: 'g', label: 'Global' },
  { value: 'i', label: 'Case insensitive' },
  { value: 'm', label: 'Multiline' },
  { value: 's', label: 'Dotall' },
]

function toggleFlag(f: string) {
  if (flags.value.includes(f)) flags.value = flags.value.replace(f, '')
  else flags.value += f
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="rounded-2xl bg-gradient-to-br from-orange-900/30 to-red-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🔍</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Regex Tester</h2>
          <p class="text-sm text-text-secondary">Test regular expressions with live matching</p>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-xs font-medium text-text-secondary mb-1.5 block">Pattern</label>
          <div class="flex gap-2">
            <span class="text-text-muted text-lg font-mono self-center">/</span>
            <input v-model="pattern" type="text" class="flex-1 rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-accent-lime font-mono focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            <span class="text-text-muted text-lg font-mono self-center">/</span>
            <input v-model="flags" type="text" class="w-16 rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary font-mono text-center focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="f in flagOptions" :key="f.value" @click="toggleFlag(f.value)" class="rounded-full px-3 py-1 text-xs font-medium transition-all" :class="flags.includes(f.value) ? 'bg-accent-lime text-bg-primary' : 'bg-bg-surface border border-border-card text-text-secondary'">{{ f.label }} ({{ f.value }})</button>
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary mb-1.5 block">Test String</label>
          <textarea v-model="testString" rows="4" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow resize-none" />
        </div>
      </div>
    </div>

    <div v-if="results.error" class="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
      <p class="text-sm text-red-400 font-mono">{{ results.error }}</p>
    </div>

    <div v-else class="rounded-2xl bg-bg-card p-5 border border-border-card">
      <h3 class="text-sm font-semibold text-text-primary mb-3">
        {{ results.matches.length }} match{{ results.matches.length !== 1 ? 'es' : '' }}
      </h3>
      <div v-if="results.matches.length" class="flex flex-col gap-3">
        <div v-for="(m, i) in results.matches" :key="i" class="rounded-xl bg-bg-surface p-3 border border-border-subtle">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] text-text-muted">Match {{ i + 1 }}</span>
            <span class="text-[10px] text-text-muted">@{{ m.index }}</span>
          </div>
          <p class="text-sm font-mono text-accent-lime mb-1">{{ m.full }}</p>
          <div v-if="m.groups.length" class="flex flex-wrap gap-1.5">
            <span v-for="(g, gi) in m.groups" :key="gi" class="text-[10px] bg-accent-lime/10 text-accent-lime px-2 py-0.5 rounded-full font-mono">
              Group {{ gi + 1 }}: {{ g }}
            </span>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-text-muted py-4 text-center">No matches found</p>
    </div>
  </div>
</template>
