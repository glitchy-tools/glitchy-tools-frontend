<script lang="ts">
export const toolMeta = {
  name: 'Color Picker',
  slug: 'color-picker',
  description: 'Pick a color and get its HEX, RGB, and HSL values.',
  icon: '\uD83C\uDFA8',
  category: 'Design',
  seo: {
    title: 'Free Online Color Picker — HEX, RGB & HSL Converter',
    description: 'Pick any color and instantly get its HEX, RGB, and HSL values. Copy with one click. Free, no sign-up required.',
    keywords: ['color picker', 'hex to rgb', 'rgb to hsl', 'color converter', 'color code generator'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const hex = ref('#6366f1')

/** Convert HEX to RGB values */
function hexToRgb(h: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}

/** Convert RGB to HSL values */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const rgb = computed(() => hexToRgb(hex.value))
const hsl = computed(() => {
  if (!rgb.value) return null
  return rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
})

const rgbString = computed(() => rgb.value ? `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})` : '')
const hslString = computed(() => hsl.value ? `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)` : '')

function copy(value: string) {
  navigator.clipboard.writeText(value)
}
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <div class="flex flex-col gap-4">
      <div
        class="h-48 w-full rounded-lg border"
        :style="{ backgroundColor: hex }"
        role="img"
        :aria-label="'Color preview: ' + hex"
      />
      <input
        type="color"
        :value="hex"
        aria-label="Color picker"
        class="h-10 w-full cursor-pointer rounded-md"
        @input="hex = ($event.target as HTMLInputElement).value"
      />
      <div class="flex gap-2">
        <label for="hex-input" class="sr-only">Hex value</label>
        <Input id="hex-input" v-model="hex" placeholder="#000000" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <Card v-for="{ label, value } in [
        { label: 'HEX', value: hex },
        { label: 'RGB', value: rgbString },
        { label: 'HSL', value: hslString },
      ]" :key="label">
        <CardContent class="flex items-center justify-between p-4">
          <div>
            <p class="text-xs text-muted-foreground">{{ label }}</p>
            <p class="font-mono text-sm font-medium">{{ value }}</p>
          </div>
          <Button variant="outline" size="sm" @click="copy(value)">Copy</Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
