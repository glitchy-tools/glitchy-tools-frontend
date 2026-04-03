<script lang="ts">
export const toolMeta = {
  name: 'Watermark Remover',
  slug: 'watermark-remover',
  description: 'Remove watermarks from images using canvas-based inpainting.',
  icon: '🖼️',
  category: 'Design',
  seo: {
    title: 'Free Watermark Remover Tool',
    description: 'Remove watermarks from images directly in your browser. No uploads, no sign-up — runs entirely locally.',
    keywords: ['watermark remover', 'remove watermark', 'image editor', 'watermark tool', 'photo watermark'],
  },
}
</script>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { downloadDataUrl } from '@/lib/download'

const imageFile = ref<File | null>(null)
const imageUrl = ref('')
const resultUrl = ref('')
const brushSize = ref(20)
const isDrawing = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
const maskCanvas = ref<HTMLCanvasElement | null>(null)
const processing = ref(false)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  imageFile.value = file
  resultUrl.value = ''

  const url = URL.createObjectURL(file)
  imageUrl.value = url

  const img = new Image()
  img.onload = () => {
    if (!canvas.value || !maskCanvas.value) return
    canvas.value.width = img.width
    canvas.value.height = img.height
    maskCanvas.value.width = img.width
    maskCanvas.value.height = img.height

    const ctx = canvas.value.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    const maskCtx = maskCanvas.value.getContext('2d')!
    maskCtx.clearRect(0, 0, img.width, img.height)
  }
  img.src = url
}

function getCanvasCoords(e: MouseEvent) {
  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
  const scaleX = canvas.value!.width / rect.width
  const scaleY = canvas.value!.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function startDraw(e: MouseEvent) {
  isDrawing.value = true
  draw(e)
}

function draw(e: MouseEvent) {
  if (!isDrawing.value || !maskCanvas.value) return
  const { x, y } = getCanvasCoords(e)
  const ctx = maskCanvas.value.getContext('2d')!
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  ctx.beginPath()
  ctx.arc(x, y, brushSize.value, 0, Math.PI * 2)
  ctx.fill()
}

function stopDraw() {
  isDrawing.value = false
}

function processRemoval() {
  if (!canvas.value || !maskCanvas.value) return
  processing.value = true

  const ctx = canvas.value.getContext('2d')!
  const maskCtx = maskCanvas.value.getContext('2d')!
  const w = canvas.value.width
  const h = canvas.value.height

  const imgData = ctx.getImageData(0, 0, w, h)
  const maskData = maskCtx.getImageData(0, 0, w, h)
  const pixels = imgData.data
  const mask = maskData.data

  // For each masked pixel, replace with average of surrounding non-masked pixels.
  // Process in batches of rows to avoid freezing the UI on large images.
  const radius = Math.max(brushSize.value, 10)
  const BATCH_SIZE = 50

  function processBatch(startY: number) {
    const endY = Math.min(startY + BATCH_SIZE, h)
    for (let y = startY; y < endY; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4
        if (mask[i] > 50) {
          let r = 0, g = 0, b = 0, count = 0
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const nx = x + dx
              const ny = y + dy
              if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
              const ni = (ny * w + nx) * 4
              if (mask[ni] <= 50) {
                r += pixels[ni]
                g += pixels[ni + 1]
                b += pixels[ni + 2]
                count++
              }
            }
          }
          if (count > 0) {
            pixels[i] = r / count
            pixels[i + 1] = g / count
            pixels[i + 2] = b / count
          }
        }
      }
    }

    if (endY < h) {
      setTimeout(() => processBatch(endY), 0)
    } else {
      finalize()
    }
  }

  function finalize() {
    ctx.putImageData(imgData, 0, 0)

    // Second pass: slight blur on the affected area for smoother results
    const resultCanvas = document.createElement('canvas')
    resultCanvas.width = w
    resultCanvas.height = h
    const rctx = resultCanvas.getContext('2d')!
    rctx.drawImage(canvas.value!, 0, 0)
    resultUrl.value = resultCanvas.toDataURL('image/png')

    // Clear mask
    maskCtx.clearRect(0, 0, w, h)
    processing.value = false
  }

  processBatch(0)
}

function downloadResult() {
  if (!resultUrl.value) return
  downloadDataUrl(resultUrl.value, 'watermark-removed.png')
}

function resetTool() {
  imageFile.value = null
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  imageUrl.value = ''
  resultUrl.value = ''
}

onUnmounted(() => {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Upload -->
    <Card v-if="!imageUrl">
      <CardContent class="p-6">
        <label
          class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <span class="text-4xl">📁</span>
          <span class="text-sm text-muted-foreground">Click to upload an image</span>
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>
      </CardContent>
    </Card>

    <!-- Editor -->
    <div v-if="imageUrl" class="flex flex-col gap-4">
      <div class="flex items-center gap-4 flex-wrap">
        <label class="text-sm font-medium">
          Brush size: {{ brushSize }}
          <input v-model.number="brushSize" type="range" min="5" max="60" class="ml-2 accent-primary" />
        </label>
        <Button @click="processRemoval" :disabled="processing">
          {{ processing ? 'Processing...' : 'Remove Watermark' }}
        </Button>
        <Button variant="outline" @click="resetTool">Reset</Button>
      </div>

      <p class="text-sm text-muted-foreground">Paint over the watermark area, then click "Remove Watermark".</p>

      <div class="relative inline-block max-w-full overflow-auto rounded-xl border border-border">
        <canvas
          ref="canvas"
          class="max-w-full"
          :style="{ cursor: 'crosshair' }"
        />
        <canvas
          ref="maskCanvas"
          class="absolute top-0 left-0 max-w-full"
          :style="{ cursor: 'crosshair' }"
          @mousedown="startDraw"
          @mousemove="draw"
          @mouseup="stopDraw"
          @mouseleave="stopDraw"
        />
      </div>
    </div>

    <!-- Result -->
    <Card v-if="resultUrl">
      <CardContent class="p-6 flex flex-col gap-4">
        <p class="text-sm font-medium">Result</p>
        <img :src="resultUrl" class="max-w-full rounded-xl border border-border" alt="Processed image" />
        <Button @click="downloadResult">Download Result</Button>
      </CardContent>
    </Card>
  </div>
</template>
