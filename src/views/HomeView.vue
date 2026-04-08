<script setup lang="ts">
import SiteHeader from '@/components/landing/SiteHeader.vue'
import HeroCarousel from '@/components/landing/HeroCarousel.vue'
import OpenToolsSection from '@/components/landing/OpenToolsSection.vue'
import BuilderCTA from '@/components/landing/BuilderCTA.vue'
import CreativeSuiteSection from '@/components/landing/CreativeSuiteSection.vue'
import BrandBanner from '@/components/landing/BrandBanner.vue'
import GallerySection from '@/components/landing/GallerySection.vue'
import ExploreToolsSection from '@/components/landing/ExploreToolsSection.vue'
import CallToActionSection from '@/components/landing/CallToActionSection.vue'
import SiteFooter from '@/components/landing/SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <SiteHeader />

    <main>
      <HeroCarousel />
      <BuilderCTA />
      <OpenToolsSection />
      <CreativeSuiteSection />
      <BrandBanner />

      <GallerySection
        title="Email Templates"
        subtitle="Browse community-designed email templates for every campaign type"
        href="/email-templates"
      />

      <ExploreToolsSection />
      <CallToActionSection />
    </main>

    <SiteFooter />
  </div>
</template>
