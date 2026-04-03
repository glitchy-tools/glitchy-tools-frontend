<script setup lang="ts">
defineProps<{ class?: string }>()
</script>

<template>
  <svg :class="$props.class || 'size-8'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
    <path d="M16 7L19.5 13.5H12.5L16 7Z" fill="white" />
    <path d="M10 15H22L16 25L10 15Z" fill="white" fill-opacity="0.9" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stop-color="#A882FF" />
        <stop offset="1" stop-color="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
</template>
