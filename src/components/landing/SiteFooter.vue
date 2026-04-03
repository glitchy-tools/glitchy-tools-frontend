<script setup lang="ts">
import LogoIcon from '@/components/icons/LogoIcon.vue'
</script>

<template>
  <footer class="h-[68px] border-t border-border-subtle">
    <div class="site-container h-full flex items-center justify-between">
      <div class="flex items-center gap-3">
        <LogoIcon class="size-5" />
        <span class="text-xs text-text-muted">&copy; 2026 glitchy.tools</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="/terms" class="text-xs text-text-muted hover:text-white transition-colors">Terms</a>
        <a href="/privacy" class="text-xs text-text-muted hover:text-white transition-colors">Privacy</a>
        <a href="/contact" class="text-xs text-text-muted hover:text-white transition-colors">Contact</a>
      </div>
    </div>
  </footer>
</template>
