<script lang="ts">
export const toolMeta = {
  name: 'SMS Verification',
  slug: 'sms-verification',
  description: 'Generate and verify SMS codes for testing workflows.',
  icon: '📱',
  category: 'Utility',
  seo: {
    title: 'SMS Verification Code Tool',
    description: 'Generate OTP codes and test SMS verification flows. Useful for development and testing.',
    keywords: ['sms verification', 'otp generator', 'verification code', 'sms testing', 'two factor auth'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const codeLength = ref(6)
const codeType = ref<'numeric' | 'alphanumeric'>('numeric')
const expirySeconds = ref(60)
const generatedCode = ref('')
const generatedAt = ref<number | null>(null)
const verifyInput = ref('')
const verifyResult = ref<'idle' | 'success' | 'fail' | 'expired'>('idle')
const history = ref<{ code: string; time: string; status: string }[]>([])

let timer: ReturnType<typeof setInterval> | null = null
const timeRemaining = ref(0)

function generateCode() {
  const chars = codeType.value === 'numeric'
    ? '0123456789'
    : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const arr = new Uint32Array(codeLength.value)
  crypto.getRandomValues(arr)
  generatedCode.value = Array.from(arr, (v) => chars[v % chars.length]).join('')
  generatedAt.value = Date.now()
  verifyResult.value = 'idle'
  verifyInput.value = ''
  timeRemaining.value = expirySeconds.value

  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function verifyCode() {
  if (!generatedCode.value || !generatedAt.value) return

  const elapsed = (Date.now() - generatedAt.value) / 1000
  if (elapsed > expirySeconds.value) {
    verifyResult.value = 'expired'
    history.value.unshift({ code: verifyInput.value, time: new Date().toLocaleTimeString(), status: 'Expired' })
  } else if (verifyInput.value === generatedCode.value) {
    verifyResult.value = 'success'
    history.value.unshift({ code: verifyInput.value, time: new Date().toLocaleTimeString(), status: 'Valid' })
  } else {
    verifyResult.value = 'fail'
    history.value.unshift({ code: verifyInput.value, time: new Date().toLocaleTimeString(), status: 'Invalid' })
  }
  if (history.value.length > 10) history.value.pop()
}

function copyCode() {
  if (generatedCode.value) navigator.clipboard.writeText(generatedCode.value)
}

const isExpired = computed(() => timeRemaining.value <= 0 && generatedCode.value !== '')
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Generator -->
    <div class="flex flex-col gap-4">
      <div>
        <label class="text-sm font-medium mb-1 block">Code length: {{ codeLength }}</label>
        <input v-model.number="codeLength" type="range" min="4" max="8" class="w-full accent-primary" />
        <div class="flex justify-between text-xs text-muted-foreground"><span>4</span><span>8</span></div>
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Code type</label>
        <div class="flex gap-2">
          <button
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            :class="codeType === 'numeric' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground'"
            @click="codeType = 'numeric'"
          >Numeric</button>
          <button
            class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            :class="codeType === 'alphanumeric' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground'"
            @click="codeType = 'alphanumeric'"
          >Alphanumeric</button>
        </div>
      </div>

      <div>
        <label class="text-sm font-medium mb-1 block">Expiry: {{ expirySeconds }}s</label>
        <input v-model.number="expirySeconds" type="range" min="15" max="300" step="15" class="w-full accent-primary" />
      </div>

      <Button @click="generateCode">Generate Code</Button>

      <Card v-if="generatedCode">
        <CardContent class="p-4 flex flex-col items-center gap-2">
          <p class="text-sm text-muted-foreground">Your verification code</p>
          <p class="text-4xl font-mono font-bold tracking-[0.3em]" :class="isExpired ? 'text-red-400 line-through' : ''">
            {{ generatedCode }}
          </p>
          <p class="text-xs" :class="isExpired ? 'text-red-400' : 'text-muted-foreground'">
            {{ isExpired ? 'Expired' : `Expires in ${timeRemaining}s` }}
          </p>
          <Button size="sm" variant="outline" @click="copyCode">Copy</Button>
        </CardContent>
      </Card>
    </div>

    <!-- Verifier -->
    <div class="flex flex-col gap-4">
      <div>
        <label for="verify-input" class="text-sm font-medium mb-1 block">Enter code to verify</label>
        <input
          id="verify-input"
          v-model="verifyInput"
          type="text"
          :maxlength="codeLength"
          placeholder="Enter code..."
          class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground font-mono tracking-widest text-center placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>
      <Button @click="verifyCode" :disabled="!verifyInput || !generatedCode">Verify</Button>

      <div v-if="verifyResult !== 'idle'" class="rounded-xl p-4 text-center text-sm font-medium" :class="{
        'bg-green-500/10 text-green-400': verifyResult === 'success',
        'bg-red-500/10 text-red-400': verifyResult === 'fail',
        'bg-amber-500/10 text-amber-400': verifyResult === 'expired',
      }">
        {{ verifyResult === 'success' ? 'Code verified successfully!' : verifyResult === 'expired' ? 'Code has expired.' : 'Invalid code.' }}
      </div>

      <!-- History -->
      <div v-if="history.length > 0" class="flex flex-col gap-2">
        <p class="text-sm font-medium">Verification history</p>
        <Card v-for="(entry, i) in history" :key="i">
          <CardContent class="p-3 flex items-center justify-between text-sm">
            <code class="font-mono">{{ entry.code }}</code>
            <span class="text-xs text-muted-foreground">{{ entry.time }}</span>
            <span class="text-xs font-medium" :class="{
              'text-green-400': entry.status === 'Valid',
              'text-red-400': entry.status === 'Invalid',
              'text-amber-400': entry.status === 'Expired',
            }">{{ entry.status }}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
