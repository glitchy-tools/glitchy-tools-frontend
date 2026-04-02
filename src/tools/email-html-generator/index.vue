<script lang="ts">
export const toolMeta = {
  name: 'Email HTML Generator',
  slug: 'email-html-generator',
  description: 'Build and preview responsive HTML email templates.',
  icon: '✉️',
  category: 'Marketing',
  seo: {
    title: 'Free Email HTML Generator',
    description: 'Build responsive HTML email templates with a visual editor. Preview and export email-safe HTML.',
    keywords: ['email html generator', 'email template builder', 'html email', 'email design', 'responsive email'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const brandName = ref('Glitchy')
const brandColor = ref('#7c3aed')
const headerText = ref('Welcome!')
const bodyText = ref('Thanks for signing up. We are excited to have you on board.')
const ctaText = ref('Get Started')
const ctaUrl = ref('https://example.com')
const footerText = ref('© 2026 Glitchy. All rights reserved.')
const previewMode = ref<'desktop' | 'mobile'>('desktop')

const emailHtml = computed(() => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerText.value}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:${brandColor.value};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${brandName.value}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#18181b;font-size:22px;font-weight:700;">${headerText.value}</h2>
              <p style="margin:0 0 24px;color:#52525b;font-size:16px;line-height:1.6;">${bodyText.value}</p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background-color:${brandColor.value};">
                    <a href="${ctaUrl.value}" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">${ctaText.value}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#f9fafb;text-align:center;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;">${footerText.value}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
})

const copied = ref(false)
function copyHtml() {
  navigator.clipboard.writeText(emailHtml.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function downloadHtml() {
  const blob = new Blob([emailHtml.value], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'email-template.html'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Editor -->
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Brand name</label>
          <input
            v-model="brandName"
            type="text"
            class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
          />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Brand color</label>
          <div class="flex gap-2 items-center">
            <input v-model="brandColor" type="color" class="h-10 w-12 rounded cursor-pointer border-0" />
            <input
              v-model="brandColor"
              type="text"
              class="flex h-10 flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
            />
          </div>
        </div>
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Header text</label>
        <input
          v-model="headerText"
          type="text"
          class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Body text</label>
        <textarea
          v-model="bodyText"
          rows="4"
          class="flex w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow resize-none"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">CTA button text</label>
          <input
            v-model="ctaText"
            type="text"
            class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
          />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">CTA link</label>
          <input
            v-model="ctaUrl"
            type="url"
            class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
          />
        </div>
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Footer text</label>
        <input
          v-model="footerText"
          type="text"
          class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>

      <div class="flex gap-2">
        <Button @click="copyHtml">{{ copied ? 'Copied!' : 'Copy HTML' }}</Button>
        <Button variant="outline" @click="downloadHtml">Download .html</Button>
      </div>
    </div>

    <!-- Preview -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium">Preview</p>
        <div class="flex gap-2 ml-auto">
          <button
            class="rounded-full px-3 py-1 text-xs font-medium transition-all"
            :class="previewMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'"
            @click="previewMode = 'desktop'"
          >Desktop</button>
          <button
            class="rounded-full px-3 py-1 text-xs font-medium transition-all"
            :class="previewMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'"
            @click="previewMode = 'mobile'"
          >Mobile</button>
        </div>
      </div>
      <Card>
        <CardContent class="p-4 flex justify-center">
          <iframe
            :srcdoc="emailHtml"
            :style="{ width: previewMode === 'mobile' ? '375px' : '100%', height: '500px' }"
            class="border border-border rounded-lg bg-white transition-all"
            title="Email preview"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
