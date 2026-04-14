<script lang="ts">
export const toolMeta = {
  name: 'Notification Mockup',
  slug: 'notification-mockup',
  description: 'Generate realistic phone notification and chat mockups for marketing.',
  icon: '📲',
  category: 'Design',
  seo: {
    title: 'Notification Mockup Generator — Glitchy Tools',
    description: 'Create realistic phone notification screenshots, iMessage, WhatsApp, and Instagram DM mockups. Export as PNG or GIF.',
    keywords: ['notification mockup', 'phone mockup', 'imessage mockup', 'whatsapp mockup', 'screenshot generator'],
  },
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// ── Types ──
interface Notification {
  id: number
  icon: string
  app: string
  title: string
  body: string
  time: string
  open: boolean
}
interface Message {
  id: number
  sender: 'me' | 'them'
  text: string
  time: string
}
interface Contact {
  name: string
  avatar: string | null
}
interface StatusBar {
  time: string
  carrier: string
  signal: number
  wifi: boolean
  battery: number
}
interface IconDef {
  name: string
  bg: string
  sym: string
}

// ── Constants ──
const ICONS: Record<string, IconDef> = {
  stripe:{name:'Stripe',bg:'#635BFF',sym:'S'},paypal:{name:'PayPal',bg:'#003087',sym:'P'},cashapp:{name:'Cash App',bg:'#00D632',sym:'$'},venmo:{name:'Venmo',bg:'#3D95CE',sym:'V'},zelle:{name:'Zelle',bg:'#6D1ED4',sym:'Z'},glitchy:{name:'Glitchy',bg:'#A855F7',sym:'\u26A1'},shopify:{name:'Shopify',bg:'#96BF48',sym:'S'},amazon:{name:'Amazon',bg:'#FF9900',sym:'a'},instagram:{name:'Instagram',bg:'linear-gradient(45deg,#f09433,#e6683c,#dc2743)',sym:'\uD83D\uDCF7'},tiktok:{name:'TikTok',bg:'#010101',sym:'\u266A'},youtube:{name:'YouTube',bg:'#FF0000',sym:'\u25B6'},twitter:{name:'Twitter/X',bg:'#000000',sym:'\uD83D\uDC26'},facebook:{name:'Facebook',bg:'#1877F2',sym:'f'},whatsapp:{name:'WhatsApp',bg:'#25D366',sym:'W'},telegram:{name:'Telegram',bg:'#0088CC',sym:'T'},imessage:{name:'iMessage',bg:'#34C759',sym:'\uD83D\uDCAC'},gmail:{name:'Gmail',bg:'#EA4335',sym:'M'},slack:{name:'Slack',bg:'#4A154B',sym:'#'},discord:{name:'Discord',bg:'#5865F2',sym:'D'},uber:{name:'Uber',bg:'#000000',sym:'U'},robinhood:{name:'Robinhood',bg:'#00C805',sym:'R'},coinbase:{name:'Coinbase',bg:'#0052FF',sym:'C'},chase:{name:'Chase',bg:'#117ACA',sym:'C'},boa:{name:'Bank of America',bg:'#E31837',sym:'B'},capitalone:{name:'Capital One',bg:'#004879',sym:'C'}
}

const WALLPAPERS = [
  {id:'purple',name:'Deep Purple',cls:'wp-purple'},
  {id:'ocean',name:'Ocean Blue',cls:'wp-ocean'},
  {id:'sunset',name:'Sunset',cls:'wp-sunset'},
  {id:'mesh',name:'Dark Mesh',cls:'wp-mesh'},
  {id:'dark',name:'Minimal Dark',cls:'wp-dark'},
  {id:'nature',name:'Nature',cls:'wp-nature'},
  {id:'neon',name:'Neon City',cls:'wp-neon'},
  {id:'pastel',name:'Soft Pastel',cls:'wp-pastel'},
]

interface TemplateItem {
  name: string
  desc: string
  mode: string
  data: {
    notifications?: Array<{ icon: string; app: string; title: string; body: string; time: string }>
    messages?: Array<{ sender: string; text: string; time: string }>
    contact?: { name: string }
    contactStatus?: string
  }
}

const TEMPLATES: Record<string, TemplateItem[]> = {
  payments:[
    {name:'Stripe Payment',desc:'Large payment notification',mode:'lockscreen',data:{notifications:[{icon:'stripe',app:'Stripe',title:'Payment received',body:'You received a payment of $2,847.00 from John D.',time:'now'}]}},
    {name:'Glitchy Payout',desc:'Commission payout',mode:'lockscreen',data:{notifications:[{icon:'glitchy',app:'Glitchy',title:'Commission Payout',body:'$4,200.00 has been deposited to your account',time:'just now'}]}},
    {name:'Money Stack',desc:'Multiple payments',mode:'lockscreen',data:{notifications:[{icon:'stripe',app:'Stripe',title:'Payment received',body:'You received $2,847.00',time:'now'},{icon:'cashapp',app:'Cash App',title:'Jordan sent you $1,500',body:'Tap to accept',time:'2m ago'},{icon:'glitchy',app:'Glitchy',title:'Commission Payout',body:'$3,100.00 deposited',time:'5m ago'}]}}
  ],
  social:[
    {name:'IG Viral Reel',desc:'Engagement burst',mode:'lockscreen',data:{notifications:[{icon:'instagram',app:'Instagram',title:'@hustlequeen liked your Reel',body:'',time:'now'},{icon:'instagram',app:'Instagram',title:'@moneymoves liked your Reel',body:'',time:'1m ago'},{icon:'instagram',app:'Instagram',title:'@digitalnomad liked your Reel',body:'',time:'2m ago'}]}},
    {name:'TikTok Viral',desc:'Viral video',mode:'lockscreen',data:{notifications:[{icon:'tiktok',app:'TikTok',title:'Your video is going viral!',body:'250K views in the last hour',time:'now'}]}}
  ],
  conversations:[
    {name:'iMessage "How?"',desc:'Someone asking about income',mode:'imessage',data:{contact:{name:'Alex'},messages:[{sender:'them',text:'Yo I saw your story... you really made $4K this week??',time:'9:35 AM'},{sender:'me',text:'Yeah bro not even kidding',time:'9:36 AM'},{sender:'them',text:'HOW. Tell me everything',time:'9:37 AM'},{sender:'me',text:"It's this platform called Glitchy. They do affiliate payouts daily.",time:'9:38 AM'},{sender:'them',text:'YES please send it',time:'9:38 AM'}]}},
    {name:'WhatsApp Earnings',desc:'Sharing earnings',mode:'whatsapp',data:{contact:{name:'Marketing Group'},contactStatus:'online',messages:[{sender:'them',text:'Did anyone actually get paid this month?',time:'10:02 AM'},{sender:'me',text:'Just got my payout from Glitchy. $3,200 this week alone',time:'10:04 AM'},{sender:'them',text:'Wait what?? Screenshot??',time:'10:04 AM'},{sender:'me',text:'Check your DMs, just sent it.',time:'10:05 AM'}]}}
  ]
}

const TEMPLATE_SECTIONS = [
  { title: 'Payment Notifications', key: 'payments' },
  { title: 'Social Proof', key: 'social' },
  { title: 'DM Conversations', key: 'conversations' },
]

// ── UID generator ──
let uid = 1000

// ── State ──
const os = ref<'ios' | 'android'>('ios')
const model = ref('dynamic-island')
const mode = ref('lockscreen')
const theme = ref<'dark' | 'light'>('dark')
const liquidGlass = ref(false)
const statusBar = reactive<StatusBar>({ time: '9:41', carrier: '', signal: 4, wifi: true, battery: 87 })
const lockTime = ref('9:41')
const lockDate = ref('Friday, February 13')
const wallpaper = ref('purple')
const customWallpaper = ref<string | null>(null)
const greenBubble = ref(false)
const showTyping = ref(false)
const contactStatus = ref('online')
const contact = reactive<Contact>({ name: 'Alex', avatar: null })
const notifications = ref<Notification[]>([
  { id: uid++, icon: 'glitchy', app: 'Glitchy', title: 'Commission Payout', body: '$4,200.00 has been deposited to your account', time: 'now', open: true },
  { id: uid++, icon: 'stripe', app: 'Stripe', title: 'Payment received', body: 'You received a payment of $2,847.00 from John D.', time: '2m ago', open: false },
])
const messages = ref<Message[]>([
  { id: uid++, sender: 'them', text: 'Yo how are you making so much money lately??', time: '9:35 AM' },
  { id: uid++, sender: 'me', text: 'Bro check out Glitchy. Changed my life fr', time: '9:36 AM' },
  { id: uid++, sender: 'them', text: 'Send me the link!!', time: '9:37 AM' },
])

const showTemplateModal = ref(false)
const modeLoading = ref(false)
const copyLabel = ref('\uD83D\uDCCB Copy')

// ── Refs to DOM ──
const exportTarget = ref<HTMLElement | null>(null)
const wpUploadInput = ref<HTMLInputElement | null>(null)
const avatarUploadInput = ref<HTMLInputElement | null>(null)

// ── Computed ──
const isIos = computed(() => os.value === 'ios')
const isDark = computed(() => theme.value === 'dark')

const modelOptions = computed(() => {
  if (isIos.value) return [
    { value: 'dynamic-island', label: 'Dynamic Island' },
    { value: 'notch', label: 'Notch' },
    { value: 'classic-ios', label: 'Classic' },
  ]
  return [
    { value: 'punch-hole', label: 'Punch Hole' },
    { value: 'teardrop', label: 'Teardrop' },
    { value: 'classic-android', label: 'Classic' },
  ]
})

const isClassic = computed(() => model.value === 'classic-ios' || model.value === 'classic-android')

const phoneFrameClass = computed(() => {
  let c = 'phone-frame'
  if (!isIos.value) c += ' android'
  if (model.value === 'classic-ios') c += ' classic-ios'
  if (model.value === 'classic-android') c += ' classic-android'
  return c
})

const screenBgClass = computed(() => {
  if (customWallpaper.value) return 'screen-bg'
  return 'screen-bg wp-' + wallpaper.value
})

const screenBgStyle = computed(() => {
  if (customWallpaper.value) {
    return { backgroundImage: `url('${customWallpaper.value}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return {}
})

const notifCardClass = computed(() => {
  if (isIos.value && liquidGlass.value) return 'ios-glass'
  if (isIos.value) return isDark.value ? 'ios-dark' : 'ios-light'
  return isDark.value ? 'android-dark' : 'android-light'
})

const statusBarColor = computed(() => {
  return theme.value === 'light' && mode.value === 'imessage' ? '#000' : '#fff'
})

const isNotifMode = computed(() => mode.value === 'lockscreen' || mode.value === 'banner')
const isChatMode = computed(() => ['imessage', 'whatsapp', 'instagram'].includes(mode.value))

const chatLabel = computed(() => {
  if (mode.value === 'whatsapp') return 'WhatsApp'
  if (mode.value === 'instagram') return 'Instagram DM'
  return isIos.value ? 'iMessage' : 'Messages'
})

const contactInitial = computed(() => contact.name ? contact.name[0].toUpperCase() : '?')

// ── Signals SVG heights ──
const signalBars = [3, 5, 7, 9]

// ── Methods ──
function setOS(newOS: 'ios' | 'android') {
  os.value = newOS
  model.value = newOS === 'ios' ? 'dynamic-island' : 'punch-hole'
}

function setMode(newMode: string) {
  if (newMode === mode.value) return
  modeLoading.value = true
  setTimeout(() => {
    mode.value = newMode
    modeLoading.value = false
  }, 250)
}

function toggleNotifEditor(id: number) {
  notifications.value.forEach(n => {
    if (n.id === id) n.open = !n.open
    else n.open = false
  })
}

function updateNotif(id: number, key: keyof Notification, value: any) {
  const n = notifications.value.find(x => x.id === id)
  if (n) (n as any)[key] = value
}

function addNotif() {
  notifications.value.push({
    id: uid++, icon: 'glitchy', app: 'Glitchy', title: 'New Notification', body: 'Body text', time: 'now', open: true,
  })
}

function delNotif(id: number) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function dupeNotif(id: number) {
  const n = notifications.value.find(x => x.id === id)
  if (n) {
    const i = notifications.value.indexOf(n)
    notifications.value.splice(i + 1, 0, { ...n, id: uid++, open: false })
  }
}

function moveNotif(id: number, dir: number) {
  const i = notifications.value.findIndex(x => x.id === id)
  const ni = i + dir
  if (ni < 0 || ni >= notifications.value.length) return
  const tmp = notifications.value[i]
  notifications.value[i] = notifications.value[ni]
  notifications.value[ni] = tmp
}

function addMsg() {
  const ls = messages.value.length ? messages.value[messages.value.length - 1].sender : 'them'
  messages.value.push({ id: uid++, sender: ls === 'me' ? 'them' : 'me', text: 'New message', time: '' })
}

function delMsg(id: number) {
  messages.value = messages.value.filter(m => m.id !== id)
}

function updateMsg(id: number, key: keyof Message, value: any) {
  const m = messages.value.find(x => x.id === id)
  if (m) (m as any)[key] = value
}

function toggleMsgSender(id: number) {
  const m = messages.value.find(x => x.id === id)
  if (m) m.sender = m.sender === 'me' ? 'them' : 'me'
}

function handleWpUpload(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => { customWallpaper.value = r.result as string; wallpaper.value = 'custom' }
  r.readAsDataURL(f)
}

function handleAvatarUpload(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => { contact.avatar = r.result as string }
  r.readAsDataURL(f)
}

function selectWallpaper(id: string) {
  wallpaper.value = id
  customWallpaper.value = null
}

function openTemplates() { showTemplateModal.value = true }
function closeTemplates() { showTemplateModal.value = false }

function applyTemplate(catKey: string, idx: number) {
  const t = TEMPLATES[catKey][idx]
  mode.value = t.mode
  if (t.data.notifications) {
    notifications.value = t.data.notifications.map(n => ({ ...n, id: uid++, open: false }))
  }
  if (t.data.messages) {
    messages.value = t.data.messages.map(m => ({ ...m, id: uid++, sender: m.sender as 'me' | 'them' }))
  }
  if (t.data.contact) {
    Object.assign(contact, t.data.contact)
  }
  if (t.data.contactStatus) {
    contactStatus.value = t.data.contactStatus
  }
  closeTemplates()
}

function getIconBg(key: string): string {
  const ic = ICONS[key]
  return ic ? ic.bg : '#666'
}
function getIconSym(key: string): string {
  const ic = ICONS[key]
  return ic ? ic.sym : '?'
}

// ── Bubble classes ──
function bubbleClass(m: Message): string {
  const base = 'im-bubble ' + m.sender
  if (isIos.value) {
    let c = base + ' ios'
    if (m.sender === 'me' && greenBubble.value) c += ' green-bubble'
    if (m.sender === 'them') c += isDark.value ? ' ios-dark' : ' ios-light'
    return c
  }
  let c = base + ' android'
  if (m.sender === 'them') c += isDark.value ? '-dark' : '-light'
  return c
}

function waBubbleClass(m: Message): string {
  return 'wa-bubble ' + m.sender
}

function igBubbleClass(m: Message): string {
  return 'ig-bubble ' + m.sender
}

// ── Export helpers ──
let html2canvasLib: any = null

function loadHtml2Canvas(): Promise<any> {
  if (html2canvasLib) return Promise.resolve(html2canvasLib)
  if ((window as any).html2canvas) {
    html2canvasLib = (window as any).html2canvas
    return Promise.resolve(html2canvasLib)
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    script.onload = () => { html2canvasLib = (window as any).html2canvas; resolve(html2canvasLib) }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function downloadPNG() {
  const el = exportTarget.value
  if (!el) return
  const h2c = await loadHtml2Canvas()
  const origTransform = el.style.transform
  el.style.transform = 'none'
  try {
    const cv = await h2c(el, { scale: 3, backgroundColor: mode.value === 'banner' ? null : '#000', useCORS: true, logging: false })
    el.style.transform = origTransform
    const a = document.createElement('a')
    a.download = 'glitchy-mockup-' + Date.now() + '.png'
    a.href = cv.toDataURL('image/png')
    a.click()
  } catch {
    el.style.transform = origTransform
    alert('Export failed')
  }
}

async function copyToClipboard() {
  const el = exportTarget.value
  if (!el) return
  const h2c = await loadHtml2Canvas()
  const origTransform = el.style.transform
  el.style.transform = 'none'
  try {
    const cv = await h2c(el, { scale: 3, backgroundColor: mode.value === 'banner' ? null : '#000', useCORS: true, logging: false })
    el.style.transform = origTransform
    cv.toBlob(async (b: Blob | null) => {
      if (!b) return
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })])
        copyLabel.value = '\u2713 Copied!'
        setTimeout(() => { copyLabel.value = '\uD83D\uDCCB Copy' }, 1500)
      } catch {
        alert('Clipboard requires HTTPS')
      }
    })
  } catch {
    el.style.transform = origTransform
  }
}

// ── Resize handling ──
const windowScale = ref(0.72)

function handleResize() {
  const fh = isClassic.value ? 750 : 844
  const ah = window.innerHeight - 52 - 60
  windowScale.value = Math.min(ah / fh, 0.72)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeTemplates()
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
})

// ── Msg sender toggle bg for editor ──
function msgSenderBg(m: Message): string {
  if (m.sender === 'me') {
    if (mode.value === 'whatsapp') return '#005c4b'
    if (mode.value === 'instagram') return '#5b51d8'
    return 'var(--nm-blue)'
  }
  return 'var(--nm-border-light)'
}
</script>

<template>
  <div class="nm-tool">
    <!-- Hero -->
    <div style="border-radius:16px;background:linear-gradient(135deg,rgba(88,28,135,0.3),rgba(67,56,202,0.2));padding:24px;border:1px solid rgba(255,255,255,0.08);margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="height:40px;width:40px;border-radius:12px;background:rgba(168,130,255,0.1);display:flex;align-items:center;justify-content:center;font-size:20px">📲</div>
        <div>
          <h2 style="font-size:18px;font-weight:700;color:#f7f7f8;margin:0">Notification Mockup</h2>
          <p style="font-size:14px;color:rgba(255,255,255,0.6);margin:4px 0 0">Generate realistic phone notification and chat mockups</p>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="nm-header-actions">
      <button class="nm-btn nm-btn-ghost" @click="openTemplates">&#9889; Templates</button>
      <button class="nm-btn nm-btn-ghost" @click="copyToClipboard">{{ copyLabel }}</button>
      <button class="nm-btn nm-btn-primary" @click="downloadPNG">&#11015; Download PNG</button>
    </div>

    <div class="nm-app">
      <!-- LEFT PANEL -->
      <div class="nm-panel nm-panel-left">
        <!-- Device -->
        <div class="nm-section">
          <div class="nm-section-title">Device</div>
          <div class="nm-toggle-group" style="margin-bottom:10px">
            <div class="nm-tg-btn" :class="{ active: os === 'ios' }" @click="setOS('ios')">iOS</div>
            <div class="nm-tg-btn" :class="{ active: os === 'android' }" @click="setOS('android')">Android</div>
          </div>
          <div class="nm-select-wrap">
            <select v-model="model">
              <option v-for="opt in modelOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <!-- Screen Mode -->
        <div class="nm-section">
          <div class="nm-section-title">Screen Mode</div>
          <div class="nm-mode-tabs">
            <button class="nm-mode-tab" :class="{ active: mode === 'lockscreen' }" @click="setMode('lockscreen')">Lock Screen</button>
            <button class="nm-mode-tab" :class="{ active: mode === 'imessage' }" @click="setMode('imessage')">{{ isIos ? 'iMessage' : 'Messages' }}</button>
            <button class="nm-mode-tab" :class="{ active: mode === 'whatsapp' }" @click="setMode('whatsapp')">WhatsApp</button>
            <button class="nm-mode-tab" :class="{ active: mode === 'instagram' }" @click="setMode('instagram')">IG DM</button>
            <button class="nm-mode-tab" :class="{ active: mode === 'banner' }" @click="setMode('banner')">Banner</button>
          </div>
        </div>

        <!-- Appearance -->
        <div class="nm-section">
          <div class="nm-section-title">Appearance</div>
          <div class="nm-toggle-group" style="margin-bottom:10px">
            <div class="nm-tg-btn" :class="{ active: theme === 'dark' }" @click="theme = 'dark'">Dark</div>
            <div class="nm-tg-btn" :class="{ active: theme === 'light' }" @click="theme = 'light'">Light</div>
          </div>
          <div v-if="isIos" class="nm-switch-row">
            <span class="nm-switch-label">Liquid Glass</span>
            <div class="nm-switch" :class="{ on: liquidGlass }" @click="liquidGlass = !liquidGlass"></div>
          </div>
          <div v-if="mode === 'imessage' && isIos" class="nm-switch-row">
            <span class="nm-switch-label">Green Bubble</span>
            <div class="nm-switch" :class="{ on: greenBubble }" @click="greenBubble = !greenBubble"></div>
          </div>
          <div v-if="isChatMode" class="nm-switch-row">
            <span class="nm-switch-label">Typing Indicator</span>
            <div class="nm-switch" :class="{ on: showTyping }" @click="showTyping = !showTyping"></div>
          </div>
        </div>

        <!-- Status Bar -->
        <div class="nm-section">
          <div class="nm-section-title">Status Bar</div>
          <div class="nm-input-row">
            <input class="nm-input" v-model="statusBar.time" placeholder="Time">
            <input class="nm-input" v-model="statusBar.carrier" placeholder="Carrier">
          </div>
          <div class="nm-slider-row">
            <label>Signal: {{ statusBar.signal }}</label>
            <input type="range" min="0" max="4" v-model.number="statusBar.signal">
          </div>
          <div class="nm-slider-row">
            <label>Battery: {{ statusBar.battery }}%</label>
            <input type="range" min="1" max="100" v-model.number="statusBar.battery">
          </div>
        </div>

        <!-- Lock Screen time/date -->
        <div v-if="isNotifMode" class="nm-section">
          <div class="nm-section-title">Lock Screen</div>
          <div class="nm-input-row">
            <input class="nm-input" v-model="lockTime">
          </div>
          <input class="nm-input" v-model="lockDate" style="margin-bottom:8px">
        </div>

        <!-- Wallpaper -->
        <div class="nm-section">
          <div class="nm-section-title">Wallpaper</div>
          <div class="nm-wallpaper-grid">
            <div
              v-for="w in WALLPAPERS" :key="w.id"
              class="nm-wp-thumb"
              :class="[w.cls, { active: wallpaper === w.id && !customWallpaper }]"
              :title="w.name"
              @click="selectWallpaper(w.id)"
            ></div>
            <div
              class="nm-wp-thumb nm-wp-upload"
              :class="{ active: wallpaper === 'custom' }"
              title="Upload"
              @click="wpUploadInput?.click()"
            >+</div>
          </div>
          <input ref="wpUploadInput" type="file" accept="image/*" style="display:none" @change="handleWpUpload">
        </div>
      </div>

      <!-- CENTER PANEL (Phone preview) -->
      <div class="nm-panel-center">
        <!-- Banner mode -->
        <template v-if="mode === 'banner'">
          <div ref="exportTarget" style="padding:40px">
            <div v-if="notifications.length" class="nm-banner-container">
              <div class="nm-banner-card">
                <div class="notif-card" :class="notifCardClass">
                  <div class="notif-icon" :style="{ background: getIconBg(notifications[0].icon) }">{{ getIconSym(notifications[0].icon) }}</div>
                  <div class="notif-content">
                    <div class="notif-header">
                      <span class="notif-app">{{ notifications[0].app }}</span>
                      <span class="notif-time">{{ notifications[0].time }}</span>
                    </div>
                    <div class="notif-title">{{ notifications[0].title }}</div>
                    <div v-if="notifications[0].body" class="notif-body">{{ notifications[0].body }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="nm-banner-container"><p style="color:var(--nm-text-muted)">Add a notification</p></div>
          </div>
        </template>

        <!-- Phone mode -->
        <template v-else>
          <div ref="exportTarget" :class="phoneFrameClass" :style="{ transform: `scale(${windowScale})` }">
            <div class="phone-screen">
              <div :class="screenBgClass" :style="screenBgStyle"></div>
              <!-- Cutout -->
              <div v-if="model === 'dynamic-island'" class="dynamic-island"></div>
              <div v-else-if="model === 'notch'" class="notch"></div>
              <div v-else-if="model === 'punch-hole'" class="punch-hole"></div>
              <div v-else-if="model === 'teardrop'" class="teardrop"></div>

              <!-- Status Bar -->
              <div class="status-bar" :style="{ color: statusBarColor }">
                <div class="sb-left">
                  <span>{{ statusBar.time }}</span>
                  <span v-if="statusBar.carrier" style="font-size:11px;font-weight:400;margin-left:2px">{{ statusBar.carrier }}</span>
                </div>
                <div class="sb-right">
                  <div class="sb-signal">
                    <i v-for="(h, idx) in signalBars" :key="idx" :style="{ height: h + 'px', opacity: idx < statusBar.signal ? 1 : 0.25 }"></i>
                  </div>
                  <svg v-if="statusBar.wifi" width="14" height="10" viewBox="0 0 14 10" fill="none" style="vertical-align:middle">
                    <path d="M7 9.5a1 1 0 100-2 1 1 0 000 2z" fill="currentColor"/>
                    <path d="M4.17 6.83a4 4 0 015.66 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M1.76 4.41a7 7 0 0110.48 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                  <div class="sb-battery">
                    <span>{{ statusBar.battery }}%</span>
                    <div class="sb-battery-icon">
                      <div class="sb-battery-fill" :style="{ width: statusBar.battery + '%', background: statusBar.battery <= 20 ? 'var(--nm-red)' : '#fff' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mode loading overlay -->
              <div class="nm-mode-loading" :class="{ show: modeLoading }">
                <div style="font-size:32px;animation:nm-glitchLoad .4s">&#9889;</div>
              </div>

              <!-- LOCKSCREEN -->
              <div v-if="mode === 'lockscreen'" class="lockscreen-content">
                <div class="ls-time" :style="{ color: isDark ? '#fff' : '#000' }">{{ lockTime }}</div>
                <div class="ls-date" :style="{ color: isDark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.7)' }">{{ lockDate }}</div>
                <div class="ls-notifications">
                  <div v-for="n in notifications" :key="n.id" class="notif-card" :class="notifCardClass">
                    <div class="notif-icon" :style="{ background: getIconBg(n.icon) }">{{ getIconSym(n.icon) }}</div>
                    <div class="notif-content">
                      <div class="notif-header">
                        <span class="notif-app">{{ n.app }}</span>
                        <span class="notif-time">{{ n.time }}</span>
                      </div>
                      <div class="notif-title">{{ n.title }}</div>
                      <div v-if="n.body" class="notif-body">{{ n.body }}</div>
                    </div>
                  </div>
                </div>
                <div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:134px;height:5px;border-radius:3px;background:rgba(255,255,255,.2)"></div>
              </div>

              <!-- IMESSAGE -->
              <div v-if="mode === 'imessage'" class="imessage-content">
                <div class="im-header" :class="isDark ? 'ios-dark' : 'ios-light'">
                  <span class="im-back">&#8249;</span>
                  <div class="im-avatar">
                    <img v-if="contact.avatar" :src="contact.avatar">
                    <template v-else>{{ contactInitial }}</template>
                  </div>
                  <span class="im-contact-name" :style="{ color: isDark ? '#fff' : '#000' }">{{ contact.name || 'Contact' }}</span>
                </div>
                <div class="im-messages" :style="{ background: isDark ? 'rgba(0,0,0,.3)' : 'rgba(245,245,245,.9)' }">
                  <div v-for="m in messages" :key="m.id" :class="bubbleClass(m)">{{ m.text }}</div>
                  <div v-if="showTyping" class="im-typing"><i></i><i></i><i></i></div>
                </div>
                <div class="im-inputbar" :class="isDark ? 'ios-dark' : 'ios-light'">
                  <div class="im-inputbar-field" style="display:flex;align-items:center">{{ isIos ? 'iMessage' : 'Text Message' }}</div>
                </div>
                <div :style="{ height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(20,20,28,.85)' : 'rgba(245,245,245,.9)' }">
                  <div :style="{ width: '134px', height: '5px', borderRadius: '3px', background: isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.15)' }"></div>
                </div>
              </div>

              <!-- WHATSAPP -->
              <div v-if="mode === 'whatsapp'" class="wa-content">
                <div class="wa-header wa-header-dark">
                  <span style="color:#8696a0;font-size:18px">&#8249;</span>
                  <div class="wa-avatar">
                    <img v-if="contact.avatar" :src="contact.avatar">
                    <template v-else>{{ contactInitial }}</template>
                  </div>
                  <div class="wa-contact-info">
                    <div class="wa-contact-name">{{ contact.name || 'Contact' }}</div>
                    <div class="wa-contact-status">{{ contactStatus || 'online' }}</div>
                  </div>
                </div>
                <div class="wa-bg">
                  <div class="wa-date-divider"><span>TODAY</span></div>
                  <div v-for="m in messages" :key="m.id" :class="waBubbleClass(m)">
                    {{ m.text }}
                    <div class="wa-bubble-footer">
                      <span v-if="m.time" class="wa-bubble-time">{{ m.time }}</span>
                      <span v-if="m.sender === 'me'" class="wa-ticks">&#10003;&#10003;</span>
                    </div>
                  </div>
                  <div v-if="showTyping" class="wa-bubble them" style="padding:10px 14px">
                    <div style="display:flex;gap:4px">
                      <i class="nm-typing-dot" style="animation-delay:0s"></i>
                      <i class="nm-typing-dot" style="animation-delay:.2s"></i>
                      <i class="nm-typing-dot" style="animation-delay:.4s"></i>
                    </div>
                  </div>
                </div>
                <div class="wa-inputbar">
                  <div class="wa-inputbar-field" style="display:flex;align-items:center;padding:0 14px;color:#8696a0">Type a message</div>
                </div>
                <div style="height:20px;display:flex;align-items:center;justify-content:center;background:#1f2c34">
                  <div style="width:134px;height:5px;border-radius:3px;background:rgba(255,255,255,.15)"></div>
                </div>
              </div>

              <!-- INSTAGRAM DM -->
              <div v-if="mode === 'instagram'" class="ig-content">
                <div class="ig-header">
                  <span style="color:#f5f5f5;font-size:18px">&#8249;</span>
                  <div class="ig-avatar">
                    <img v-if="contact.avatar" :src="contact.avatar">
                    <template v-else>{{ contactInitial }}</template>
                  </div>
                  <div class="ig-contact-info">
                    <div class="ig-contact-name">{{ contact.name || 'user' }}</div>
                    <div class="ig-contact-active">{{ contactStatus || 'Active now' }}</div>
                  </div>
                </div>
                <div class="ig-messages">
                  <div v-for="m in messages" :key="m.id" :class="igBubbleClass(m)">{{ m.text }}</div>
                  <div v-if="showTyping" class="ig-bubble them" style="padding:10px 14px;display:flex;gap:4px">
                    <i class="nm-typing-dot" style="animation-delay:0s"></i>
                    <i class="nm-typing-dot" style="animation-delay:.2s"></i>
                    <i class="nm-typing-dot" style="animation-delay:.4s"></i>
                  </div>
                  <div v-if="messages.length && messages[messages.length - 1].sender === 'me'" class="ig-seen">Seen</div>
                </div>
                <div style="padding:10px 16px;background:#000;border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px">
                  <div style="flex:1;height:36px;border-radius:20px;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;padding:0 14px;font-size:13px;color:#8e8e8e">Message...</div>
                </div>
                <div style="height:20px;display:flex;align-items:center;justify-content:center;background:#000">
                  <div style="width:134px;height:5px;border-radius:3px;background:rgba(255,255,255,.15)"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- RIGHT PANEL -->
      <div class="nm-panel nm-panel-right">
        <!-- Notification editor (lockscreen / banner) -->
        <template v-if="isNotifMode">
          <div class="nm-editor-header">
            <h3>Notifications</h3>
            <button class="nm-btn nm-btn-sm nm-btn-primary" @click="addNotif">+ Add</button>
          </div>
          <div v-for="(n, nIdx) in notifications" :key="n.id" class="nm-notif-editor-card">
            <div class="nm-notif-editor-top" @click="toggleNotifEditor(n.id)">
              <div class="nm-notif-editor-preview">
                <div class="nm-notif-editor-icon" :style="{ background: getIconBg(n.icon) }">{{ getIconSym(n.icon) }}</div>
                <span class="nm-notif-editor-name">{{ n.app || 'Notification' }}</span>
              </div>
              <div class="nm-notif-editor-actions">
                <button v-if="nIdx > 0" class="nm-btn nm-btn-sm nm-btn-ghost" @click.stop="moveNotif(n.id, -1)">&uarr;</button>
                <button v-if="nIdx < notifications.length - 1" class="nm-btn nm-btn-sm nm-btn-ghost" @click.stop="moveNotif(n.id, 1)">&darr;</button>
                <button class="nm-btn nm-btn-sm nm-btn-ghost" @click.stop="dupeNotif(n.id)">&#10697;</button>
                <button class="nm-btn nm-btn-sm nm-btn-danger" @click.stop="delNotif(n.id)">&#10005;</button>
              </div>
            </div>
            <div class="nm-notif-editor-body" :class="{ open: n.open }">
              <div class="nm-field">
                <label>App Icon</label>
                <div class="nm-icon-picker-grid">
                  <div
                    v-for="(ic, key) in ICONS" :key="key"
                    class="nm-icon-pick"
                    :class="{ active: key === n.icon }"
                    :style="{ background: ic.bg }"
                    :title="ic.name"
                    @click.stop="updateNotif(n.id, 'icon', key)"
                  >{{ ic.sym }}</div>
                </div>
              </div>
              <div class="nm-field">
                <label>App Name</label>
                <input class="nm-input" :value="n.app" @input="updateNotif(n.id, 'app', ($event.target as HTMLInputElement).value)">
              </div>
              <div class="nm-field">
                <label>Title</label>
                <input class="nm-input" :value="n.title" @input="updateNotif(n.id, 'title', ($event.target as HTMLInputElement).value)">
              </div>
              <div class="nm-field">
                <label>Body</label>
                <textarea class="nm-input" rows="2" :value="n.body" @input="updateNotif(n.id, 'body', ($event.target as HTMLTextAreaElement).value)"></textarea>
              </div>
              <div class="nm-field">
                <label>Timestamp</label>
                <input class="nm-input" :value="n.time" @input="updateNotif(n.id, 'time', ($event.target as HTMLInputElement).value)">
              </div>
            </div>
          </div>
        </template>

        <!-- Message editor (chat modes) -->
        <template v-else>
          <div class="nm-editor-header">
            <h3>{{ chatLabel }}</h3>
            <button class="nm-btn nm-btn-sm nm-btn-primary" @click="addMsg">+ Message</button>
          </div>
          <!-- Contact section -->
          <div class="nm-section">
            <div class="nm-section-title">Contact</div>
            <div class="nm-input-row">
              <input class="nm-input" v-model="contact.name" placeholder="Contact name">
            </div>
            <input v-if="mode === 'whatsapp' || mode === 'instagram'" class="nm-input" v-model="contactStatus" :placeholder="mode === 'whatsapp' ? 'online' : 'Active now'" style="margin-bottom:8px">
            <button class="nm-btn nm-btn-sm nm-btn-ghost" style="width:100%" @click="avatarUploadInput?.click()">
              {{ contact.avatar ? '\u2713 Avatar uploaded' : 'Upload Avatar' }}
            </button>
            <input ref="avatarUploadInput" type="file" accept="image/*" style="display:none" @change="handleAvatarUpload">
          </div>
          <!-- Messages -->
          <div class="nm-section">
            <div class="nm-section-title">Messages</div>
            <div v-for="m in messages" :key="m.id" class="nm-msg-editor-card">
              <div
                class="nm-msg-sender-toggle"
                :class="m.sender"
                :style="{ background: msgSenderBg(m) }"
                @click="toggleMsgSender(m.id)"
                title="Toggle sender"
              >{{ m.sender === 'me' ? 'You' : '\u2190' }}</div>
              <div class="nm-msg-editor-fields">
                <textarea :value="m.text" @input="updateMsg(m.id, 'text', ($event.target as HTMLTextAreaElement).value)"></textarea>
                <div class="nm-msg-time-row">
                  <input class="nm-input" :value="m.time" placeholder="Time" @input="updateMsg(m.id, 'time', ($event.target as HTMLInputElement).value)" style="font-size:11px">
                  <button class="nm-btn nm-btn-sm nm-btn-danger" @click="delMsg(m.id)">&#10005;</button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Template Modal -->
    <div v-if="showTemplateModal" class="nm-modal-overlay" @click.self="closeTemplates">
      <div class="nm-modal">
        <div class="nm-modal-header">
          <h2>&#9889; Quick Templates</h2>
          <button class="nm-modal-close" @click="closeTemplates">&times;</button>
        </div>
        <div class="nm-modal-body">
          <div v-for="sec in TEMPLATE_SECTIONS" :key="sec.key" class="nm-template-category">
            <h3>{{ sec.title }}</h3>
            <div class="nm-template-grid">
              <div
                v-for="(t, tIdx) in TEMPLATES[sec.key]" :key="tIdx"
                class="nm-template-card"
                @click="applyTemplate(sec.key, tIdx)"
              >
                <span class="nm-template-tag">{{ t.mode }}</span>
                <h4>{{ t.name }}</h4>
                <p>{{ t.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables (scoped to this tool) ── */
.nm-tool {
  --nm-bg-deep:#07070d;--nm-bg-primary:#0c0c14;--nm-bg-panel:#111119;--nm-bg-card:#16161f;--nm-bg-hover:#1e1e2a;
  --nm-border:#252535;--nm-border-light:#303045;
  --nm-text:#ededf2;--nm-text-dim:#9999b0;--nm-text-muted:#666680;
  --nm-accent:#a855f7;--nm-accent-dim:#7c3aed;--nm-accent-glow:rgba(168,85,247,.25);--nm-accent-glow-strong:rgba(168,85,247,.45);
  --nm-green:#22c55e;--nm-blue:#3b82f6;--nm-red:#ef4444;--nm-orange:#f59e0b;
  --nm-radius:12px;--nm-radius-sm:8px;--nm-radius-xs:6px;
  --nm-font:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
  --nm-transition:all .2s cubic-bezier(.4,0,.2,1);
  font-family: var(--nm-font);
  color: var(--nm-text);
  font-size: 13px;
  line-height: 1.5;
  background: var(--nm-bg-deep);
  margin: -1.5rem;
  width: calc(100% + 3rem);
}

.nm-tool ::-webkit-scrollbar{width:5px}
.nm-tool ::-webkit-scrollbar-track{background:transparent}
.nm-tool ::-webkit-scrollbar-thumb{background:var(--nm-border);border-radius:9px}

.nm-tool input,.nm-tool select,.nm-tool textarea,.nm-tool button{font-family:inherit;font-size:inherit;color:inherit;outline:none}
.nm-tool button{cursor:pointer;border:none;background:none}

/* ── Header actions ── */
.nm-header-actions{height:52px;background:var(--nm-bg-panel);border-bottom:1px solid var(--nm-border);display:flex;align-items:center;justify-content:flex-end;padding:0 20px;position:relative;z-index:100;gap:8px}
.nm-header-actions::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--nm-accent-glow),transparent)}

/* ── Buttons ── */
.nm-btn{padding:8px 16px;border-radius:var(--nm-radius-sm);font-weight:600;font-size:12px;transition:var(--nm-transition);display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.nm-btn-ghost{background:var(--nm-bg-card);border:1px solid var(--nm-border);color:var(--nm-text-dim)}.nm-btn-ghost:hover{background:var(--nm-bg-hover);color:var(--nm-text)}
.nm-btn-primary{background:linear-gradient(135deg,var(--nm-accent),var(--nm-accent-dim));color:#fff;border:1px solid rgba(168,85,247,.3)}.nm-btn-primary:hover{box-shadow:0 0 20px var(--nm-accent-glow);transform:translateY(-1px)}
.nm-btn-sm{padding:5px 10px;font-size:11px;border-radius:var(--nm-radius-xs)}
.nm-btn-danger{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:var(--nm-red)}.nm-btn-danger:hover{background:rgba(239,68,68,.2)}

/* ── Layout ── */
.nm-app{display:flex;height:calc(100vh - 52px - 120px);min-height:600px}
.nm-panel{background:var(--nm-bg-panel);border-right:1px solid var(--nm-border);overflow-y:auto;overflow-x:hidden;padding:16px}
.nm-panel-left{width:280px;flex-shrink:0}
.nm-panel-center{flex:1;display:flex;align-items:center;justify-content:center;background:var(--nm-bg-deep);position:relative;overflow:hidden}
.nm-panel-center::before{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,var(--nm-accent-glow) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);opacity:.15;pointer-events:none}
.nm-panel-right{width:340px;flex-shrink:0;border-right:none;border-left:1px solid var(--nm-border);background:var(--nm-bg-panel);overflow-y:auto;padding:16px}

/* ── Sections ── */
.nm-section{margin-bottom:20px}
.nm-section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--nm-text-muted);margin-bottom:10px;display:flex;align-items:center;gap:6px}

/* ── Toggle group ── */
.nm-toggle-group{display:flex;background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:var(--nm-radius-sm);overflow:hidden}
.nm-tg-btn{flex:1;padding:7px 12px;text-align:center;font-size:11px;font-weight:600;color:var(--nm-text-muted);transition:var(--nm-transition);border-right:1px solid var(--nm-border);cursor:pointer}
.nm-tg-btn:last-child{border-right:none}
.nm-tg-btn.active{background:var(--nm-accent);color:#fff;box-shadow:0 0 15px var(--nm-accent-glow)}
.nm-tg-btn:not(.active):hover{background:var(--nm-bg-hover);color:var(--nm-text-dim)}

/* ── Select ── */
.nm-select-wrap{position:relative}
.nm-select-wrap select{width:100%;padding:8px 30px 8px 10px;background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:var(--nm-radius-xs);color:var(--nm-text);font-size:12px;appearance:none;cursor:pointer;transition:var(--nm-transition)}
.nm-select-wrap select:focus{border-color:var(--nm-accent);box-shadow:0 0 0 2px var(--nm-accent-glow)}
.nm-select-wrap::after{content:'\25BE';position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--nm-text-muted);pointer-events:none;font-size:11px}

/* ── Inputs ── */
.nm-input{width:100%;padding:8px 10px;background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:var(--nm-radius-xs);color:var(--nm-text);font-size:12px;transition:var(--nm-transition)}
.nm-input:focus{border-color:var(--nm-accent);box-shadow:0 0 0 2px var(--nm-accent-glow)}
.nm-input-row{display:flex;gap:8px;margin-bottom:8px}
.nm-input-row .nm-input{flex:1}

/* ── Switch ── */
.nm-switch-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0}
.nm-switch-label{font-size:12px;font-weight:500;color:var(--nm-text-dim)}
.nm-switch{width:38px;height:22px;background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:11px;position:relative;cursor:pointer;transition:var(--nm-transition)}
.nm-switch.on{background:var(--nm-accent);border-color:var(--nm-accent)}
.nm-switch::after{content:'';width:16px;height:16px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;transition:var(--nm-transition);box-shadow:0 1px 3px rgba(0,0,0,.3)}
.nm-switch.on::after{left:18px}

/* ── Sliders ── */
.nm-slider-row{margin-bottom:8px}
.nm-slider-row label{font-size:11px;color:var(--nm-text-muted);display:block;margin-bottom:4px}
.nm-slider-row input[type=range]{width:100%;height:4px;appearance:none;background:var(--nm-border);border-radius:2px;outline:none}
.nm-slider-row input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;background:var(--nm-accent);border-radius:50%;cursor:pointer;box-shadow:0 0 8px var(--nm-accent-glow)}

/* ── Mode tabs ── */
.nm-mode-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px}
.nm-mode-tab{padding:6px 10px;border-radius:var(--nm-radius-xs);font-size:10px;font-weight:600;color:var(--nm-text-muted);background:var(--nm-bg-card);border:1px solid var(--nm-border);transition:var(--nm-transition);text-transform:uppercase;letter-spacing:.04em;cursor:pointer}
.nm-mode-tab:hover{color:var(--nm-text-dim);border-color:var(--nm-border-light)}
.nm-mode-tab.active{background:var(--nm-accent);color:#fff;border-color:var(--nm-accent);box-shadow:0 0 12px var(--nm-accent-glow)}

/* ── Wallpaper grid ── */
.nm-wallpaper-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.nm-wp-thumb{width:100%;aspect-ratio:9/16;border-radius:var(--nm-radius-xs);cursor:pointer;border:2px solid transparent;transition:var(--nm-transition);position:relative;overflow:hidden}
.nm-wp-thumb:hover{border-color:var(--nm-border-light);transform:scale(1.05)}
.nm-wp-thumb.active{border-color:var(--nm-accent);box-shadow:0 0 10px var(--nm-accent-glow)}
.nm-wp-upload{display:flex;align-items:center;justify-content:center;background:var(--nm-bg-card);border:2px dashed var(--nm-border);color:var(--nm-text-muted);font-size:16px}
.nm-wp-upload:hover{border-color:var(--nm-accent);color:var(--nm-accent)}

/* ── Phone frame ── */
.phone-frame{width:390px;height:844px;border-radius:52px;background:#000;border:3px solid #2a2a2a;box-shadow:0 0 0 1px #1a1a1a,0 20px 60px rgba(0,0,0,.5);position:relative;overflow:hidden;transform-origin:center center;animation:nm-glitchLoad .5s cubic-bezier(.4,0,.2,1)}
.phone-frame.android{border-radius:36px}
.phone-frame.classic-ios{border-radius:40px;height:750px}
.phone-frame.classic-android{border-radius:28px;height:750px}
.phone-frame::before{content:'';position:absolute;right:-3px;top:160px;width:3px;height:56px;background:#2a2a2a;border-radius:0 2px 2px 0;z-index:60}
.phone-frame::after{content:'';position:absolute;left:-3px;top:130px;width:3px;height:32px;background:#2a2a2a;border-radius:2px 0 0 2px;z-index:60;box-shadow:0 40px 0 #2a2a2a,0 72px 0 #2a2a2a}

.phone-screen{width:100%;height:100%;border-radius:49px;overflow:hidden;position:relative}
.phone-frame.android .phone-screen{border-radius:33px}
.phone-frame.classic-ios .phone-screen{border-radius:37px}
.phone-frame.classic-android .phone-screen{border-radius:25px}

.screen-bg{position:absolute;inset:0;z-index:0}

/* ── Wallpaper gradients ── */
.wp-purple{background:linear-gradient(145deg,#1a0533 0%,#3b0764 30%,#6d28d9 60%,#2e1065 100%)}
.wp-ocean{background:linear-gradient(145deg,#0c1445 0%,#1e3a8a 40%,#0ea5e9 80%,#0c4a6e 100%)}
.wp-sunset{background:linear-gradient(145deg,#7c2d12 0%,#dc2626 30%,#f97316 55%,#db2777 100%)}
.wp-mesh{background:linear-gradient(145deg,#0f0f1a 0%,#1a1a3e 30%,#0f172a 60%,#1e1b4b 100%)}
.wp-dark{background:linear-gradient(145deg,#0a0a0e 0%,#111118 50%,#0a0a0e 100%)}
.wp-nature{background:linear-gradient(145deg,#052e16 0%,#14532d 30%,#166534 60%,#0d3320 100%)}
.wp-neon{background:linear-gradient(145deg,#0c0a1a 0%,#1e1b4b 25%,#4338ca 50%,#7e22ce 75%,#0c0a1a 100%)}
.wp-pastel{background:linear-gradient(145deg,#2e1065 0%,#4c1d95 30%,#6d28d9 50%,#7c3aed 80%,#4c1d95 100%)}

/* ── Cutouts ── */
.dynamic-island{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:126px;height:36px;background:#000;border-radius:20px;z-index:50}
.notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:200px;height:30px;background:#000;border-radius:0 0 20px 20px;z-index:50}
.punch-hole{position:absolute;top:14px;left:50%;transform:translateX(-50%);width:14px;height:14px;background:#000;border-radius:50%;z-index:50}
.teardrop{position:absolute;top:0;left:50%;transform:translateX(-50%);width:24px;height:24px;background:#000;border-radius:0 0 50% 50%;z-index:50}

/* ── Status bar ── */
.status-bar{position:absolute;top:0;left:0;right:0;height:54px;z-index:40;display:flex;align-items:flex-end;justify-content:space-between;padding:0 28px 6px;font-size:13px;font-weight:600;color:#fff}
.phone-frame.classic-ios .status-bar,.phone-frame.classic-android .status-bar{height:36px;padding:0 20px 6px;font-size:12px}
.sb-left{display:flex;align-items:center;gap:4px}
.sb-right{display:flex;align-items:center;gap:5px;font-size:12px}
.sb-signal{display:flex;gap:1.5px;align-items:flex-end;height:11px}
.sb-signal i{width:3px;background:#fff;border-radius:1px;display:block}
.sb-battery{display:flex;align-items:center;gap:2px;font-size:11px}
.sb-battery-icon{width:22px;height:11px;border:1.5px solid #fff;border-radius:2.5px;position:relative;display:flex;align-items:center;padding:1.5px}
.sb-battery-icon::after{content:'';width:2px;height:5px;background:#fff;border-radius:0 1px 1px 0;position:absolute;right:-3.5px}
.sb-battery-fill{height:100%;border-radius:1px;transition:width .3s}

/* ── Mode loading ── */
.nm-mode-loading{position:absolute;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(10px);opacity:0;pointer-events:none;transition:opacity .15s ease}
.nm-mode-loading.show{opacity:1}

/* ── Lockscreen ── */
.lockscreen-content{position:relative;z-index:10;height:100%;display:flex;flex-direction:column;padding-top:70px}
.ls-time{text-align:center;font-size:82px;font-weight:300;color:#fff;line-height:1;letter-spacing:-2px;text-shadow:0 2px 20px rgba(0,0,0,.3)}
.ls-date{text-align:center;font-size:17px;font-weight:500;color:rgba(255,255,255,.85);margin-top:4px;text-shadow:0 1px 8px rgba(0,0,0,.3)}
.ls-notifications{margin-top:24px;padding:0 14px;display:flex;flex-direction:column;gap:8px;overflow-y:auto;flex:1;padding-bottom:80px}

/* ── Notification cards ── */
.notif-card{border-radius:14px;padding:12px;display:flex;gap:10px;backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);transition:all .3s;animation:nm-notifSlideIn .4s cubic-bezier(.4,0,.2,1)}
.notif-card.ios-dark{background:rgba(30,30,40,.65);border:1px solid rgba(255,255,255,.08)}
.notif-card.ios-light{background:rgba(255,255,255,.78);border:1px solid rgba(255,255,255,.3);color:#000}
.notif-card.ios-light .notif-app{color:rgba(0,0,0,.5)}
.notif-card.ios-light .notif-body{color:rgba(0,0,0,.7)}
.notif-card.ios-light .notif-time{color:rgba(0,0,0,.4)}
.notif-card.ios-glass{background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.04),rgba(255,255,255,.08));border:1px solid rgba(255,255,255,.22);box-shadow:0 8px 32px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.2);backdrop-filter:blur(40px) saturate(1.8) brightness(1.05)}
.notif-card.android-dark{background:rgba(30,30,40,.85);border-radius:20px;border:1px solid rgba(255,255,255,.06)}
.notif-card.android-light{background:rgba(255,255,255,.88);border-radius:20px;border:1px solid rgba(0,0,0,.06);color:#000}
.notif-card.android-light .notif-app{color:rgba(0,0,0,.5)}
.notif-card.android-light .notif-body{color:rgba(0,0,0,.6)}
.notif-card.android-light .notif-time{color:rgba(0,0,0,.4)}

.notif-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
.notif-card.android-dark .notif-icon,.notif-card.android-light .notif-icon{border-radius:50%}
.notif-content{flex:1;min-width:0}
.notif-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
.notif-app{font-size:11px;font-weight:600;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.02em}
.notif-time{font-size:10px;color:rgba(255,255,255,.35)}
.notif-title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.notif-body{font-size:12px;color:rgba(255,255,255,.65);margin-top:1px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

/* ── iMessage ── */
.imessage-content{position:relative;z-index:10;height:100%;display:flex;flex-direction:column}
.im-header{padding:54px 16px 10px;display:flex;align-items:center;gap:8px}
.im-header.ios-dark{background:rgba(20,20,28,.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08)}
.im-header.ios-light{background:rgba(245,245,245,.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.08);color:#000}
.im-back{font-size:18px;color:var(--nm-blue)}
.im-avatar{width:32px;height:32px;border-radius:50%;background:var(--nm-border-light);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;overflow:hidden}
.im-avatar img{width:100%;height:100%;object-fit:cover}
.im-contact-name{font-size:14px;font-weight:600;flex:1}
.im-messages{flex:1;padding:12px 16px;display:flex;flex-direction:column;gap:6px;overflow-y:auto;justify-content:flex-end}
.im-bubble{max-width:72%;padding:8px 12px;font-size:14px;line-height:1.35;word-wrap:break-word;position:relative;animation:nm-msgFadeIn .3s ease}
.im-bubble.me{align-self:flex-end;border-radius:18px 18px 4px 18px}
.im-bubble.them{align-self:flex-start;border-radius:18px 18px 18px 4px}
.im-bubble.me.ios{background:var(--nm-blue);color:#fff}
.im-bubble.me.ios.green-bubble{background:var(--nm-green)}
.im-bubble.them.ios-dark{background:rgba(60,60,70,.8);color:#fff}
.im-bubble.them.ios-light{background:rgba(220,220,225,.9);color:#000}
.im-bubble.me.android{background:#00695c;color:#fff;border-radius:20px 20px 4px 20px}
.im-bubble.them.android-dark{background:rgba(50,50,60,.8);color:#fff;border-radius:20px 20px 20px 4px}
.im-bubble.them.android-light{background:rgba(220,222,225,.9);color:#000;border-radius:20px 20px 20px 4px}
.im-typing{align-self:flex-start;padding:10px 14px;border-radius:18px;background:rgba(60,60,70,.8);display:flex;gap:4px;animation:nm-msgFadeIn .3s ease}
.im-typing i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.4);animation:nm-typingDot 1.4s infinite;display:block}
.im-typing i:nth-child(2){animation-delay:.2s}
.im-typing i:nth-child(3){animation-delay:.4s}
.im-inputbar{padding:8px 12px;display:flex;align-items:center;gap:8px}
.im-inputbar.ios-dark{background:rgba(20,20,28,.85);border-top:1px solid rgba(255,255,255,.08)}
.im-inputbar.ios-light{background:rgba(245,245,245,.9);border-top:1px solid rgba(0,0,0,.08)}
.im-inputbar-field{flex:1;height:34px;border-radius:17px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);padding:0 12px;font-size:13px;color:rgba(255,255,255,.3)}
.im-inputbar.ios-light .im-inputbar-field{background:rgba(0,0,0,.05);border-color:rgba(0,0,0,.1);color:rgba(0,0,0,.3)}

/* ── WhatsApp ── */
.wa-content{position:relative;z-index:10;height:100%;display:flex;flex-direction:column}
.wa-header{padding:54px 16px 10px;display:flex;align-items:center;gap:10px}
.wa-header-dark{background:#1f2c34;border-bottom:1px solid rgba(255,255,255,.06)}
.wa-avatar{width:36px;height:36px;border-radius:50%;background:#2a3942;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#8696a0;overflow:hidden}
.wa-avatar img{width:100%;height:100%;object-fit:cover}
.wa-contact-info{flex:1}
.wa-contact-name{font-size:15px;font-weight:500;color:#e9edef}
.wa-contact-status{font-size:11px;color:#8696a0}
.wa-bg{flex:1;background:#0b141a;padding:8px 12px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;justify-content:flex-end}
.wa-bubble{max-width:75%;padding:6px 8px;font-size:13.5px;line-height:1.35;position:relative;animation:nm-msgFadeIn .3s ease}
.wa-bubble.me{align-self:flex-end;background:#005c4b;color:#e9edef;border-radius:10px 10px 2px 10px}
.wa-bubble.them{align-self:flex-start;background:#202c33;color:#e9edef;border-radius:10px 10px 10px 2px}
.wa-bubble-footer{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:2px}
.wa-bubble-time{font-size:10px;color:rgba(233,237,239,.5)}
.wa-ticks{font-size:12px;color:#53bdeb;letter-spacing:-2px}
.wa-date-divider{text-align:center;padding:4px 0}
.wa-date-divider span{background:#182229;color:#8696a0;font-size:11px;padding:4px 10px;border-radius:6px}
.wa-inputbar{padding:6px 8px;display:flex;align-items:center;gap:8px;background:#1f2c34}
.wa-inputbar-field{flex:1;height:36px;border-radius:20px;background:#2a3942;border:none;padding:0 14px;font-size:13px;color:#8696a0}

/* ── Instagram DM ── */
.ig-content{position:relative;z-index:10;height:100%;display:flex;flex-direction:column;background:#000}
.ig-header{padding:54px 16px 10px;display:flex;align-items:center;gap:10px;background:rgba(0,0,0,.9);border-bottom:1px solid rgba(255,255,255,.08)}
.ig-avatar{width:28px;height:28px;border-radius:50%;background:#333;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#aaa;overflow:hidden}
.ig-avatar img{width:100%;height:100%;object-fit:cover}
.ig-contact-info{flex:1}
.ig-contact-name{font-size:14px;font-weight:600;color:#f5f5f5}
.ig-contact-active{font-size:11px;color:#8e8e8e}
.ig-messages{flex:1;padding:12px 16px;display:flex;flex-direction:column;gap:6px;overflow-y:auto;justify-content:flex-end;background:#000}
.ig-bubble{max-width:70%;padding:10px 14px;font-size:14px;line-height:1.35;animation:nm-msgFadeIn .3s ease}
.ig-bubble.me{align-self:flex-end;background:linear-gradient(135deg,#5b51d8,#833ab4);color:#fff;border-radius:22px 22px 4px 22px}
.ig-bubble.them{align-self:flex-start;background:#262626;color:#f5f5f5;border-radius:22px 22px 22px 4px}
.ig-seen{text-align:right;font-size:10px;color:#8e8e8e;padding-right:4px}

/* ── Banner ── */
.nm-banner-container{display:flex;align-items:center;justify-content:center}
.nm-banner-card{width:350px;animation:nm-bannerSlide .5s cubic-bezier(.4,0,.2,1)}
.nm-banner-card .notif-card{box-shadow:0 10px 40px rgba(0,0,0,.3)}

/* ── Right panel: Editor ── */
.nm-editor-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.nm-editor-header h3{font-size:14px;font-weight:700}

/* Notification editor cards */
.nm-notif-editor-card{background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:var(--nm-radius);padding:12px;margin-bottom:8px;transition:var(--nm-transition)}
.nm-notif-editor-card:hover{border-color:var(--nm-border-light)}
.nm-notif-editor-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;cursor:pointer}
.nm-notif-editor-preview{display:flex;align-items:center;gap:8px}
.nm-notif-editor-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.nm-notif-editor-name{font-size:12px;font-weight:600}
.nm-notif-editor-actions{display:flex;gap:4px}
.nm-notif-editor-body{overflow:hidden;transition:max-height .3s ease,opacity .3s ease;max-height:0;opacity:0}
.nm-notif-editor-body.open{max-height:500px;opacity:1}
.nm-field{margin-top:8px}
.nm-field label{display:block;font-size:10px;font-weight:600;color:var(--nm-text-muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}

/* Icon picker */
.nm-icon-picker-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;max-height:200px;overflow-y:auto;padding:4px;background:var(--nm-bg-deep);border:1px solid var(--nm-border);border-radius:var(--nm-radius-sm);margin-top:4px}
.nm-icon-pick{width:100%;aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;cursor:pointer;border:2px solid transparent;transition:var(--nm-transition)}
.nm-icon-pick:hover{transform:scale(1.1);border-color:var(--nm-border-light)}
.nm-icon-pick.active{border-color:var(--nm-accent);box-shadow:0 0 8px var(--nm-accent-glow)}

/* Message editor cards */
.nm-msg-editor-card{background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:var(--nm-radius);padding:10px;margin-bottom:6px;display:flex;gap:8px;align-items:flex-start;transition:var(--nm-transition)}
.nm-msg-editor-card:hover{border-color:var(--nm-border-light)}
.nm-msg-sender-toggle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;cursor:pointer;transition:var(--nm-transition);flex-shrink:0;margin-top:2px;color:#fff}
.nm-msg-sender-toggle.them{color:var(--nm-text-dim)}
.nm-msg-editor-fields{flex:1;min-width:0}
.nm-msg-editor-fields textarea{width:100%;min-height:40px;resize:vertical;padding:6px 8px;background:var(--nm-bg-deep);border:1px solid var(--nm-border);border-radius:var(--nm-radius-xs);color:var(--nm-text);font-size:12px;font-family:var(--nm-font);line-height:1.4}
.nm-msg-editor-fields textarea:focus{border-color:var(--nm-accent);box-shadow:0 0 0 2px var(--nm-accent-glow)}
.nm-msg-time-row{display:flex;align-items:center;gap:6px;margin-top:4px}
.nm-msg-time-row input{flex:1}

/* ── Modal ── */
.nm-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:500;display:flex;align-items:center;justify-content:center}
.nm-modal{background:var(--nm-bg-panel);border:1px solid var(--nm-border);border-radius:16px;width:90%;max-width:680px;max-height:80vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);animation:nm-modalIn .3s cubic-bezier(.4,0,.2,1)}
.nm-modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--nm-border)}
.nm-modal-header h2{font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px}
.nm-modal-close{width:32px;height:32px;border-radius:8px;background:var(--nm-bg-card);border:1px solid var(--nm-border);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--nm-text-dim);transition:var(--nm-transition)}
.nm-modal-close:hover{background:var(--nm-bg-hover);color:var(--nm-text)}
.nm-modal-body{padding:16px 20px;overflow-y:auto;max-height:calc(80vh - 60px)}
.nm-template-category{margin-bottom:20px}
.nm-template-category h3{font-size:12px;font-weight:700;color:var(--nm-accent);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.nm-template-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.nm-template-card{background:var(--nm-bg-card);border:1px solid var(--nm-border);border-radius:var(--nm-radius);padding:12px;cursor:pointer;transition:var(--nm-transition)}
.nm-template-card:hover{border-color:var(--nm-accent);background:var(--nm-bg-hover);transform:translateY(-1px)}
.nm-template-card h4{font-size:12px;font-weight:600;margin-bottom:4px}
.nm-template-card p{font-size:11px;color:var(--nm-text-muted);line-height:1.4}
.nm-template-tag{display:inline-block;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;background:var(--nm-accent-glow);color:var(--nm-accent);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}

/* ── Typing dot helper ── */
.nm-typing-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.4);display:inline-block;animation:nm-typingDot 1.4s infinite}

/* ── Animations ── */
@keyframes nm-notifSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes nm-msgFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes nm-bannerSlide{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:translateY(0)}}
@keyframes nm-modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes nm-typingDot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
@keyframes nm-glitchLoad{0%{opacity:0;transform:scale(.8) rotate(-2deg)}50%{opacity:1;transform:scale(1.02) rotate(.5deg)}100%{transform:scale(1) rotate(0)}}
</style>