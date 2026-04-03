<script setup lang="ts">
const features = [
  'Email Campaigns', 'Social Scheduling', 'AI Copywriting', 'Ad Creative',
  'Landing Pages', 'SEO Tools', 'Analytics', 'A/B Testing',
  'Brand Kit', 'CRM Sync', 'Image Editor', 'Automations',
  'Lead Scoring', 'Content Calendar', 'AI Image Gen', 'Audience Segments',
]
</script>

<template>
  <section class="mb-10 md:mb-16 site-container">
    <h2 class="text-lg md:text-xl font-bold uppercase text-white mb-6">
      Explore all marketing tools
    </h2>
    <div class="flex flex-wrap gap-2">
      <a
        v-for="feature in features"
        :key="feature"
        :href="`/${feature.toLowerCase().replace(/\s+/g, '-')}`"
        class="px-4 py-2 text-sm text-text-secondary bg-white/5 border border-border-card rounded-full hover:bg-white/10 hover:text-white transition-colors"
      >
        {{ feature }}
      </a>
    </div>
  </section>
</template>
