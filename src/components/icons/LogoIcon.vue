<script setup lang="ts">
defineProps<{ class?: string }>()
</script>

<template>
  <svg :class="$props.class || 'size-8'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 7L19.5 13.5H12.5L16 7Z" fill="white" />
  </svg>
</template>
