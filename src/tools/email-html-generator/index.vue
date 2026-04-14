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
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'
import { downloadBlob } from '@/lib/download'

const { copy, copied } = useCopyToClipboard()

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
          <tr>
            <td style="background-color:${brandColor.value};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${brandName.value}</h1>
            </td>
          </tr>
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

function downloadHtml() {
  downloadBlob(new Blob([emailHtml.value], { type: 'text/html' }), 'email-template.html')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Hero -->
    <div class="rounded-2xl bg-gradient-to-br from-fuchsia-900/30 to-purple-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3 mb-2">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">✉️</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">Email HTML Generator</h2>
          <p class="text-sm text-text-secondary">Build responsive HTML email templates with live preview</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Editor -->
      <div class="flex flex-col gap-4">
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-4">Branding</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Brand name</label>
              <input v-model="brandName" type="text" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Brand color</label>
              <div class="flex gap-2 items-center">
                <input v-model="brandColor" type="color" class="h-10 w-12 rounded-lg cursor-pointer border-0 bg-transparent" />
                <input v-model="brandColor" type="text" class="flex-1 rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-4">Content</h3>
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Header text</label>
              <input v-model="headerText" type="text" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Body text</label>
              <textarea v-model="bodyText" rows="3" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow resize-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-medium text-text-secondary mb-1.5 block">CTA button text</label>
                <input v-model="ctaText" type="text" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
              </div>
              <div>
                <label class="text-xs font-medium text-text-secondary mb-1.5 block">CTA link</label>
                <input v-model="ctaUrl" type="url" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
              </div>
            </div>
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Footer text</label>
              <input v-model="footerText" type="text" class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow" />
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="copy(emailHtml)" class="rounded-xl bg-accent-lime text-bg-primary px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition-all">
            {{ copied ? 'Copied!' : 'Copy HTML' }}
          </button>
          <button @click="downloadHtml" class="rounded-xl border border-border-card text-text-secondary px-4 py-2.5 text-sm font-medium hover:text-text-primary hover:border-white/20 transition-colors">
            Download .html
          </button>
        </div>
      </div>

      <!-- Preview -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-primary">Preview</h3>
          <div class="flex rounded-lg bg-bg-surface p-0.5">
            <button
              class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
              :class="previewMode === 'desktop' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
              @click="previewMode = 'desktop'"
            >Desktop</button>
            <button
              class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
              :class="previewMode === 'mobile' ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'"
              @click="previewMode = 'mobile'"
            >Mobile</button>
          </div>
        </div>
        <div class="rounded-2xl bg-bg-card p-4 border border-border-card flex justify-center">
          <iframe
            :srcdoc="emailHtml"
            :style="{ width: previewMode === 'mobile' ? '375px' : '100%', height: '500px' }"
            class="rounded-xl transition-all"
            title="Email preview"
          />
        </div>
      </div>
    </div>
  </div>
</template>
