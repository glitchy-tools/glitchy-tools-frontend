<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import HeroCarousel from '@/components/HeroCarousel.vue'
import CinemaStudioSection from '@/components/CinemaStudioSection.vue'
import TopChoiceSection from '@/components/TopChoiceSection.vue'
import CharacterBanner from '@/components/CharacterBanner.vue'
import GallerySection from '@/components/GallerySection.vue'
import ExploreFeatures from '@/components/ExploreFeatures.vue'
import CtaSection from '@/components/CtaSection.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <SiteHeader />

    <main>
      <HeroCarousel />
      <CinemaStudioSection />
      <TopChoiceSection />
      <CharacterBanner />

      <GallerySection
        title="Email Templates"
        subtitle="Browse community-designed email templates for every campaign type"
        href="/email-templates"
      />

      <ExploreFeatures />
      <CtaSection />
    </main>

    <SiteFooter />
  </div>
</template>
