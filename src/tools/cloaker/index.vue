<script lang="ts">
export const toolMeta = {
  name: 'Cloaker',
  slug: 'cloaker',
  description: 'Detect ad crawlers and redirect them to a different domain.',
  icon: '🕵️',
  category: 'Marketing',
  exclusive: true,
  seo: {
    title: 'Ad Crawler Cloaker Tool',
    description: 'Generate cloaking scripts that detect ad network crawlers and redirect them to a compliant landing page.',
    keywords: ['cloaker', 'ad crawler detection', 'redirect tool', 'link cloaking', 'crawler redirect'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy, copied } = useCopyToClipboard()

const realUrl = ref('')
const safeUrl = ref('')
const selectedCrawlers = ref<string[]>(['googlebot', 'facebookexternalhit', 'bingbot'])

const crawlerOptions = [
  { id: 'googlebot', label: 'Google Ads', ua: 'Googlebot|AdsBot-Google|Mediapartners-Google' },
  { id: 'facebookexternalhit', label: 'Facebook/Meta', ua: 'facebookexternalhit|Facebot|FacebookBot' },
  { id: 'bingbot', label: 'Bing Ads', ua: 'bingbot|adidxbot|BingPreview' },
  { id: 'twitterbot', label: 'Twitter/X', ua: 'Twitterbot' },
  { id: 'linkedinbot', label: 'LinkedIn', ua: 'LinkedInBot' },
  { id: 'pinterest', label: 'Pinterest', ua: 'Pinterest|Pinterestbot' },
  { id: 'tiktok', label: 'TikTok', ua: 'TikTok|Bytespider' },
]

function toggleCrawler(id: string) {
  const idx = selectedCrawlers.value.indexOf(id)
  if (idx >= 0) selectedCrawlers.value.splice(idx, 1)
  else selectedCrawlers.value.push(id)
}

function escapeForJsString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/</g, '\\x3c').replace(/>/g, '\\x3e')
}

const generatedScript = computed(() => {
  if (!realUrl.value || !safeUrl.value || selectedCrawlers.value.length === 0) return ''

  const uaPatterns = selectedCrawlers.value
    .map((id) => crawlerOptions.find((c) => c.id === id)?.ua)
    .filter(Boolean)
    .join('|')

  const escapedSafeUrl = escapeForJsString(safeUrl.value)
  const escapedRealUrl = escapeForJsString(realUrl.value)

  return `<script>
(function() {
  var ua = navigator.userAgent;
  var crawlerPattern = /${uaPatterns}/i;
  if (crawlerPattern.test(ua)) {
    window.location.replace("${escapedSafeUrl}");
  } else {
    window.location.replace("${escapedRealUrl}");
  }
})();
<\/script>

<!-- Server-side (PHP) version -->
<?php
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$pattern = '/${uaPatterns}/i';
if (preg_match($pattern, $ua)) {
    header('Location: ${escapedSafeUrl}');
} else {
    header('Location: ${escapedRealUrl}');
}
exit;
?>`
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Hero -->
    <div class="rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3 mb-2">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">🕵️</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Ad Crawler Cloaker</h2>
          <p class="text-sm text-text-secondary">Generate cloaking scripts to redirect ad crawlers to a safe page</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Config -->
      <div class="flex flex-col gap-5">
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-4">URL Configuration</h3>
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Real destination URL</label>
              <input
                v-model="realUrl"
                type="url"
                placeholder="https://your-actual-page.com/offer"
                class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Safe/compliant URL (shown to crawlers)</label>
              <input
                v-model="safeUrl"
                type="url"
                placeholder="https://your-safe-page.com"
                class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow"
              />
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-3">Detect these crawlers</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="crawler in crawlerOptions"
              :key="crawler.id"
              class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              :class="selectedCrawlers.includes(crawler.id)
                ? 'bg-accent-lime text-bg-primary shadow-md shadow-accent-lime/25'
                : 'bg-bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-white/20'"
              @click="toggleCrawler(crawler.id)"
            >
              {{ crawler.label }}
            </button>
          </div>
          <p class="text-xs text-text-muted mt-3">{{ selectedCrawlers.length }} of {{ crawlerOptions.length }} selected</p>
        </div>
      </div>

      <!-- Output -->
      <div class="rounded-2xl bg-bg-card p-5 border border-border-card flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-primary">Generated Script</h3>
          <button
            v-if="generatedScript"
            @click="copy(generatedScript)"
            class="rounded-lg bg-accent-lime text-bg-primary px-3 py-1.5 text-xs font-semibold hover:brightness-110 transition-all"
          >
            {{ copied ? 'Copied!' : 'Copy Script' }}
          </button>
        </div>
        <pre
          v-if="generatedScript"
          class="rounded-xl bg-bg-primary p-4 text-xs font-mono text-text-secondary overflow-auto max-h-[500px] border border-border-subtle leading-relaxed"
        >{{ generatedScript }}</pre>
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="h-12 w-12 rounded-xl bg-bg-surface flex items-center justify-center mb-3">
            <span class="text-2xl opacity-40">🔒</span>
          </div>
          <p class="text-sm text-text-muted">Enter both URLs and select at least one crawler</p>
        </div>
      </div>
    </div>
  </div>
</template>
