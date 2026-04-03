import { ref } from 'vue'

export function useCopyToClipboard(timeout = 2000) {
  const copied = ref(false)

  async function copy(text: string) {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), timeout)
  }

  return { copy, copied }
}
