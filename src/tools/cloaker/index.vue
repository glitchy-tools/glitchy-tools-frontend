<script lang="ts">
export const toolMeta = {
  name: 'Cloaker',
  slug: 'cloaker',
  description: 'Detect ad crawlers and redirect them to a different domain.',
  icon: '🕵️',
  category: 'Marketing',
  seo: {
    title: 'Ad Crawler Cloaker Tool',
    description: 'Generate cloaking scripts that detect ad network crawlers and redirect them to a compliant landing page.',
    keywords: ['cloaker', 'ad crawler detection', 'redirect tool', 'link cloaking', 'crawler redirect'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
  if (idx >= 0) {
    selectedCrawlers.value.splice(idx, 1)
  } else {
    selectedCrawlers.value.push(id)
  }
}

const generatedScript = computed(() => {
  if (!realUrl.value || !safeUrl.value || selectedCrawlers.value.length === 0) return ''

  const uaPatterns = selectedCrawlers.value
    .map((id) => crawlerOptions.find((c) => c.id === id)?.ua)
    .filter(Boolean)
    .join('|')

  return `<script>
(function() {
  var ua = navigator.userAgent;
  var crawlerPattern = /${uaPatterns}/i;
  if (crawlerPattern.test(ua)) {
    window.location.replace("${safeUrl.value}");
  } else {
    window.location.replace("${realUrl.value}");
  }
})();
<\/script>

<!-- Server-side (PHP) version -->
<?php
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$pattern = '/${uaPatterns}/i';
if (preg_match($pattern, $ua)) {
    header('Location: ${safeUrl.value}');
} else {
    header('Location: ${realUrl.value}');
}
exit;
?>`
})

const copied = ref(false)
function copyScript() {
  if (!generatedScript.value) return
  navigator.clipboard.writeText(generatedScript.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Config -->
      <div class="flex flex-col gap-4">
        <div>
          <label for="real-url" class="text-sm font-medium mb-1 block">Real destination URL</label>
          <input
            id="real-url"
            v-model="realUrl"
            type="url"
            placeholder="https://your-actual-page.com/offer"
            class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
          />
        </div>

        <div>
          <label for="safe-url" class="text-sm font-medium mb-1 block">Safe/compliant URL (shown to crawlers)</label>
          <input
            id="safe-url"
            v-model="safeUrl"
            type="url"
            placeholder="https://your-safe-page.com"
            class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
          />
        </div>

        <div>
          <p class="text-sm font-medium mb-2">Detect these crawlers</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="crawler in crawlerOptions"
              :key="crawler.id"
              class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              :class="selectedCrawlers.includes(crawler.id)
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'"
              @click="toggleCrawler(crawler.id)"
            >
              {{ crawler.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Output -->
      <Card>
        <CardContent class="p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium">Generated Script</p>
            <Button size="sm" variant="outline" @click="copyScript" :disabled="!generatedScript">
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <pre
            v-if="generatedScript"
            class="rounded-lg bg-background p-4 text-xs font-mono overflow-auto max-h-96 border border-border"
          >{{ generatedScript }}</pre>
          <p v-else class="text-sm text-muted-foreground py-8 text-center">
            Enter both URLs and select at least one crawler to generate the script.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
