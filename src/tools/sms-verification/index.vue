<script lang="ts">
export const toolMeta = {
  name: 'SMS Verification',
  slug: 'sms-verification',
  description: 'Generate and verify SMS codes for testing workflows.',
  icon: '📱',
  category: 'Productivity',
  seo: {
    title: 'SMS Verification Code Tool',
    description: 'Generate OTP codes and test SMS verification flows. Useful for development and testing.',
    keywords: ['sms verification', 'otp generator', 'verification code', 'sms testing', 'two factor auth'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

const { copy: copyToClipboard } = useCopyToClipboard()

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
  const chars = codeType.value === 'numeric' ? '0123456789' : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
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

const isExpired = computed(() => timeRemaining.value <= 0 && generatedCode.value !== '')
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Hero -->
    <div class="rounded-2xl bg-gradient-to-br from-violet-900/30 to-blue-900/20 p-6 border border-border-subtle">
      <div class="flex items-center gap-3 mb-2">
        <div class="h-10 w-10 rounded-xl bg-accent-lime/10 flex items-center justify-center text-xl">📱</div>
        <div>
          <h2 class="text-lg font-bold text-text-primary">SMS Verification</h2>
          <p class="text-sm text-text-secondary">Generate and verify OTP codes for testing workflows</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Generator -->
      <div class="flex flex-col gap-4">
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-4">Configuration</h3>
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Code length: {{ codeLength }}</label>
              <input v-model.number="codeLength" type="range" min="4" max="8" class="w-full accent-[rgb(168,130,255)]" />
              <div class="flex justify-between text-xs text-text-muted"><span>4</span><span>8</span></div>
            </div>

            <div>
              <label class="text-xs font-medium text-text-secondary mb-2 block">Code type</label>
              <div class="flex gap-2">
                <button
                  class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                  :class="codeType === 'numeric' ? 'bg-accent-lime text-bg-primary shadow-md shadow-accent-lime/25' : 'bg-bg-surface border border-border-card text-text-secondary hover:text-text-primary'"
                  @click="codeType = 'numeric'"
                >Numeric</button>
                <button
                  class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                  :class="codeType === 'alphanumeric' ? 'bg-accent-lime text-bg-primary shadow-md shadow-accent-lime/25' : 'bg-bg-surface border border-border-card text-text-secondary hover:text-text-primary'"
                  @click="codeType = 'alphanumeric'"
                >Alphanumeric</button>
              </div>
            </div>

            <div>
              <label class="text-xs font-medium text-text-secondary mb-1.5 block">Expiry: {{ expirySeconds }}s</label>
              <input v-model.number="expirySeconds" type="range" min="15" max="300" step="15" class="w-full accent-[rgb(168,130,255)]" />
            </div>
          </div>
        </div>

        <button @click="generateCode" class="w-full rounded-xl bg-accent-lime text-bg-primary py-3 text-sm font-semibold hover:brightness-110 transition-all">
          Generate Code
        </button>

        <!-- Generated code display -->
        <div v-if="generatedCode" class="rounded-2xl bg-bg-card p-6 border border-border-card text-center">
          <p class="text-xs text-text-muted mb-2">Your verification code</p>
          <p class="text-4xl font-mono font-bold tracking-[0.3em] mb-2" :class="isExpired ? 'text-red-400 line-through' : 'text-accent-lime'">
            {{ generatedCode }}
          </p>
          <p class="text-xs mb-3" :class="isExpired ? 'text-red-400' : 'text-text-muted'">
            {{ isExpired ? 'Expired' : `Expires in ${timeRemaining}s` }}
          </p>
          <button @click="copyToClipboard(generatedCode)" class="rounded-lg border border-border-card text-text-secondary px-3 py-1.5 text-xs font-medium hover:text-text-primary hover:border-white/20 transition-colors">
            Copy Code
          </button>
        </div>
      </div>

      <!-- Verifier -->
      <div class="flex flex-col gap-4">
        <div class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-4">Verify Code</h3>
          <div class="flex flex-col gap-3">
            <input
              v-model="verifyInput"
              type="text"
              :maxlength="codeLength"
              placeholder="Enter code..."
              class="w-full rounded-xl border border-border-card bg-bg-surface px-3 py-3 text-lg text-text-primary font-mono tracking-[0.3em] text-center placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-lime/50 transition-shadow"
            />
            <button
              @click="verifyCode"
              :disabled="!verifyInput || !generatedCode"
              class="w-full rounded-xl bg-accent-lime text-bg-primary py-3 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify
            </button>
          </div>
        </div>

        <!-- Result -->
        <div v-if="verifyResult !== 'idle'" class="rounded-2xl p-4 text-center text-sm font-medium" :class="{
          'bg-green-500/10 text-green-400 border border-green-500/20': verifyResult === 'success',
          'bg-red-500/10 text-red-400 border border-red-500/20': verifyResult === 'fail',
          'bg-amber-500/10 text-amber-400 border border-amber-500/20': verifyResult === 'expired',
        }">
          {{ verifyResult === 'success' ? 'Code verified successfully!' : verifyResult === 'expired' ? 'Code has expired.' : 'Invalid code.' }}
        </div>

        <!-- History -->
        <div v-if="history.length > 0" class="rounded-2xl bg-bg-card p-5 border border-border-card">
          <h3 class="text-sm font-semibold text-text-primary mb-3">Verification history</h3>
          <div class="flex flex-col gap-2">
            <div v-for="(entry, i) in history" :key="i" class="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
              <code class="font-mono text-sm text-text-secondary">{{ entry.code }}</code>
              <span class="text-xs text-text-muted">{{ entry.time }}</span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="{
                'bg-green-500/10 text-green-400': entry.status === 'Valid',
                'bg-red-500/10 text-red-400': entry.status === 'Invalid',
                'bg-amber-500/10 text-amber-400': entry.status === 'Expired',
              }">{{ entry.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
