import { ref } from 'vue'

/**
 * Detects if the app is running inside an iframe (embedded in glitchy.com).
 * Used to hide redundant UI like the header/footer when embedded.
 */
const isEmbedded = ref(false)

if (typeof window !== 'undefined') {
  try {
    isEmbedded.value = window.self !== window.top
  } catch {
    isEmbedded.value = true
  }
}

export function useEmbedded() {
  return { isEmbedded }
}
