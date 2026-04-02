<script lang="ts">
export const toolMeta = {
  name: 'Phone Notification Preview',
  slug: 'phone-notification-preview',
  description: 'Preview how push notifications look on phone lock screens.',
  icon: '🔔',
  category: 'Design',
  seo: {
    title: 'Phone Notification Screen Preview Tool',
    description: 'Preview and design push notification layouts as they appear on mobile lock screens. Great for marketing and UX.',
    keywords: ['notification preview', 'push notification', 'phone screen mockup', 'notification design', 'mobile preview'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'

const appName = ref('My App')
const title = ref('New message')
const body = ref('Hey! Check out this new feature we just launched.')
const timeAgo = ref('now')
const platform = ref<'ios' | 'android'>('ios')

interface NotificationEntry {
  appName: string
  title: string
  body: string
  timeAgo: string
}

const notifications = ref<NotificationEntry[]>([])

function addNotification() {
  notifications.value.push({
    appName: appName.value,
    title: title.value,
    body: body.value,
    timeAgo: timeAgo.value,
  })
}

function removeNotification(i: number) {
  notifications.value.splice(i, 1)
}

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
})

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
})
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
    <!-- Controls -->
    <div class="flex flex-col gap-4">
      <div>
        <label for="app-name" class="text-sm font-medium mb-1 block">App name</label>
        <input
          id="app-name"
          v-model="appName"
          type="text"
          class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>
      <div>
        <label for="notif-title" class="text-sm font-medium mb-1 block">Title</label>
        <input
          id="notif-title"
          v-model="title"
          type="text"
          class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>
      <div>
        <label for="notif-body" class="text-sm font-medium mb-1 block">Body</label>
        <textarea
          id="notif-body"
          v-model="body"
          rows="3"
          class="flex w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow resize-none"
        />
      </div>
      <div>
        <label for="time-ago" class="text-sm font-medium mb-1 block">Time label</label>
        <input
          id="time-ago"
          v-model="timeAgo"
          type="text"
          placeholder="now, 2m ago, 1h ago..."
          class="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow"
        />
      </div>
      <div class="flex gap-2">
        <button
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          :class="platform === 'ios' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground'"
          @click="platform = 'ios'"
        >iOS</button>
        <button
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
          :class="platform === 'android' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-card border border-border text-muted-foreground'"
          @click="platform = 'android'"
        >Android</button>
      </div>
      <Button @click="addNotification">Add Notification</Button>
    </div>

    <!-- Phone preview -->
    <div class="flex justify-center">
      <div
        class="relative w-[320px] min-h-[580px] rounded-[40px] border-4 border-zinc-700 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl overflow-hidden"
      >
        <!-- Notch (iOS) -->
        <div v-if="platform === 'ios'" class="mx-auto mt-2 w-28 h-6 bg-black rounded-full" />
        <!-- Status bar -->
        <div class="flex justify-center items-center pt-4 pb-1">
          <span class="text-xs text-zinc-500">{{ platform === 'ios' ? '' : '● ● ●' }}</span>
        </div>

        <!-- Clock -->
        <div class="text-center mt-4 mb-1">
          <p class="text-5xl font-light text-white tracking-tight">{{ currentTime }}</p>
          <p class="text-sm text-zinc-400 mt-1">{{ currentDate }}</p>
        </div>

        <!-- Notifications -->
        <div class="mt-6 px-4 flex flex-col gap-2">
          <div
            v-for="(n, i) in notifications"
            :key="i"
            class="rounded-2xl p-3 cursor-pointer transition-colors"
            :class="platform === 'ios'
              ? 'bg-white/10 backdrop-blur-md'
              : 'bg-zinc-800/90'"
            @click="removeNotification(i)"
          >
            <div class="flex items-center gap-2 mb-1">
              <div class="w-5 h-5 rounded-md bg-primary/80 flex items-center justify-center text-[10px] text-white font-bold">
                {{ n.appName.charAt(0) }}
              </div>
              <span class="text-[11px] text-zinc-400 uppercase tracking-wider">{{ n.appName }}</span>
              <span class="ml-auto text-[11px] text-zinc-500">{{ n.timeAgo }}</span>
            </div>
            <p class="text-sm font-semibold text-white leading-tight">{{ n.title }}</p>
            <p class="text-xs text-zinc-300 mt-0.5 line-clamp-2">{{ n.body }}</p>
          </div>

          <p v-if="notifications.length === 0" class="text-center text-sm text-zinc-600 mt-8">
            No notifications yet
          </p>
        </div>

        <!-- Home indicator -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-zinc-600" />
      </div>
    </div>
  </div>
</template>
