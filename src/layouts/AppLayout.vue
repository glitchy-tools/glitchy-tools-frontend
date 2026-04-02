<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Minimal top bar -->
    <header class="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div class="mx-auto flex h-14 max-w-screen-xl items-center px-4">
        <RouterLink to="/" class="flex items-center gap-1 text-lg font-bold text-foreground">
          Glitchy <span class="text-primary">Tools</span>
        </RouterLink>
      </div>
    </header>

    <!-- Full-width content -->
    <main class="mx-auto max-w-screen-xl p-4 lg:p-6">
      <RouterView />
    </main>
  </div>
</template>
