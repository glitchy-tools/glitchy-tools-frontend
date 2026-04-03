<script lang="ts">
export const toolMeta = {
  name: 'Trending Angles',
  slug: 'trending-angles',
  description: 'Discover trending affiliate angles with ready-to-use hooks and matched offers.',
  icon: '⚡',
  category: 'Marketing',
  seo: {
    title: 'Trending Angles — Glitchy Tools',
    description: 'Find trending affiliate angles with matched offers and copy-ready hooks. Built for the Glitchy team.',
    keywords: ['trending angles', 'affiliate marketing', 'hooks', 'offers', 'glitchy'],
  },
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

/* ---------- types ---------- */
interface Trend {
  id: string
  headline: string
  category: string
  hooks: string[]
  offerIds: string[]
  status: 'active' | 'paused'
  createdAt: number
  expiresAt: number
  views: number
  hookCopies: number
  offerClicks: number
}

interface Offer {
  id: string
  name: string
  category: string
  payout: string
  url: string
  status: 'active' | 'paused'
}

interface Analytics {
  totalTrendClicks: number
  totalHookCopies: number
  totalOfferViews: number
}

/* ---------- storage keys ---------- */
const SK = { trends: 'glitchy_trends', offers: 'glitchy_offers', analytics: 'glitchy_analytics' }

/* ---------- state ---------- */
const currentView = ref<'affiliate-trends' | 'admin-trends' | 'admin-offers' | 'admin-analytics'>('affiliate-trends')

const trends = ref<Trend[]>([])
const offers = ref<Offer[]>([])
const analytics = ref<Analytics>({ totalTrendClicks: 0, totalHookCopies: 0, totalOfferViews: 0 })

// filters
const affiliateSearch = ref('')
const affiliateCategoryFilter = ref('')
const adminTrendSearch = ref('')
const adminCategoryFilter = ref('')
const adminTrendStatusFilter = ref('all')
const adminOfferSearch = ref('')
const adminOfferCategoryFilter = ref('')

// modals
const showTrendModal = ref(false)
const showOfferModal = ref(false)
const showViewOffersModal = ref(false)

// trend form
const trendFormId = ref('')
const trendFormHeadline = ref('')
const trendFormCategory = ref('')
const trendFormExpiry = ref(72)
const trendFormHooks = ref<string[]>([''])
const trendFormOfferIds = ref<string[]>([])
const trendFormStatus = ref<'active' | 'paused'>('active')

// offer form
const offerFormId = ref('')
const offerFormName = ref('')
const offerFormCategory = ref('')
const offerFormPayout = ref('')
const offerFormUrl = ref('')
const offerFormStatus = ref<'active' | 'paused'>('active')

// view offers modal
const viewOffersTitle = ref('Linked Offers')
const viewOffersTrendId = ref('')

// toast
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const categories = ['finance', 'ecommerce', 'health', 'insurance', 'tech', 'legal'] as const

/* ---------- helpers ---------- */
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

function persist() {
  localStorage.setItem(SK.trends, JSON.stringify(trends.value))
  localStorage.setItem(SK.offers, JSON.stringify(offers.value))
  localStorage.setItem(SK.analytics, JSON.stringify(analytics.value))
}

function toast(msg: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 3000)
}

function hoursLeft(expiresAt: number) {
  return Math.max(0, Math.round((expiresAt - Date.now()) / 3.6e6))
}

/* ---------- seed data ---------- */
function initData() {
  const storedOffers = localStorage.getItem(SK.offers)
  if (storedOffers) {
    offers.value = JSON.parse(storedOffers)
  } else {
    offers.value = [
      { id: '1', name: 'TurboTax Free Edition', category: 'finance', payout: '$24.00', url: '#', status: 'active' },
      { id: '2', name: 'Credit Karma Tax', category: 'finance', payout: '$18.00', url: '#', status: 'active' },
      { id: '3', name: 'H&R Block Online', category: 'finance', payout: '$22.00', url: '#', status: 'active' },
      { id: '4', name: 'TaxAct Free', category: 'finance', payout: '$16.00', url: '#', status: 'active' },
      { id: '5', name: 'Shopify Free Trial', category: 'ecommerce', payout: '$45.00', url: '#', status: 'active' },
      { id: '6', name: 'WooCommerce Hosting', category: 'ecommerce', payout: '$32.00', url: '#', status: 'active' },
      { id: '7', name: 'Debt Relief Program', category: 'finance', payout: '$85.00', url: '#', status: 'active' },
      { id: '8', name: 'Credit Score Monitor', category: 'finance', payout: '$12.00', url: '#', status: 'active' },
      { id: '9', name: 'Medicare Advantage Plans', category: 'insurance', payout: '$42.00', url: '#', status: 'active' },
      { id: '10', name: 'AARP Medicare', category: 'insurance', payout: '$38.00', url: '#', status: 'active' },
      { id: '11', name: 'Noom Weight Loss', category: 'health', payout: '$28.00', url: '#', status: 'active' },
      { id: '12', name: 'Weight Watchers', category: 'health', payout: '$22.00', url: '#', status: 'active' },
    ]
  }

  const storedTrends = localStorage.getItem(SK.trends)
  if (storedTrends) {
    trends.value = JSON.parse(storedTrends)
  } else {
    const now = Date.now()
    trends.value = [
      { id: '1', headline: 'IRS Tax Refund Delays Increase Nationwide', category: 'finance', hooks: ['Still waiting on your refund? Here\'s why...', 'IRS delays hitting millions\u2014check your status', 'Tax refund taking forever? You\'re not alone'], offerIds: ['1', '2', '3', '4'], status: 'active', createdAt: now, expiresAt: now + 18 * 3.6e6, views: 342, hookCopies: 89, offerClicks: 156 },
      { id: '2', headline: 'TikTok Restricts Dropshipping Ads', category: 'ecommerce', hooks: ['TikTok just killed dropshipping\u2014now what?', 'The new TikTok rules every seller needs to know'], offerIds: ['5', '6'], status: 'active', createdAt: now, expiresAt: now + 42 * 3.6e6, views: 218, hookCopies: 64, offerClicks: 92 },
      { id: '3', headline: 'Credit Card Defaults Hit New Highs', category: 'finance', hooks: ['Americans drowning in credit card debt\u2014relief options', 'Credit scores tanking? Here\'s how to recover', 'Banks are worried\u2014default rates just spiked'], offerIds: ['7', '8'], status: 'active', createdAt: now, expiresAt: now + 36 * 3.6e6, views: 456, hookCopies: 134, offerClicks: 201 },
      { id: '4', headline: 'Medicare Open Enrollment Ends Soon', category: 'insurance', hooks: ['Don\'t miss the Medicare deadline\u2014compare plans now', 'Seniors: You have 48 hours to switch plans', 'Medicare enrollment closing\u2014are you covered?'], offerIds: ['9', '10'], status: 'active', createdAt: now, expiresAt: now + 48 * 3.6e6, views: 567, hookCopies: 178, offerClicks: 234 },
      { id: '5', headline: 'Ozempic Shortages Continue Nationwide', category: 'health', hooks: ['Can\'t find Ozempic? Try these alternatives', 'Weight loss without the shortage struggle'], offerIds: ['11', '12'], status: 'active', createdAt: now, expiresAt: now + 60 * 3.6e6, views: 723, hookCopies: 245, offerClicks: 312 },
    ]
  }

  const storedAnalytics = localStorage.getItem(SK.analytics)
  if (storedAnalytics) {
    analytics.value = JSON.parse(storedAnalytics)
  } else {
    analytics.value = { totalTrendClicks: 2306, totalHookCopies: 710, totalOfferViews: 995 }
  }

  persist()
}

/* ---------- computed: affiliate view ---------- */
const activeTrends = computed(() => {
  const now = Date.now()
  const q = affiliateSearch.value.toLowerCase()
  const cat = affiliateCategoryFilter.value
  return trends.value.filter(t =>
    t.status === 'active' &&
    t.expiresAt >= now &&
    (!q || t.headline.toLowerCase().includes(q)) &&
    (!cat || t.category === cat)
  )
})

const statActiveTrends = computed(() => activeTrends.value.length)

const statMatchedOffers = computed(() =>
  activeTrends.value.reduce((sum, t) =>
    sum + offers.value.filter(o => t.offerIds.includes(o.id) && o.status === 'active').length, 0)
)

const statReadyHooks = computed(() =>
  activeTrends.value.reduce((sum, t) => sum + t.hooks.length, 0)
)

const statAvgTime = computed(() => {
  if (!activeTrends.value.length) return '0h'
  const avg = Math.round(activeTrends.value.reduce((s, t) => s + Math.max(0, (t.expiresAt - Date.now()) / 3.6e6), 0) / activeTrends.value.length)
  return avg + 'h'
})

function offersForTrend(t: Trend) {
  return offers.value.filter(o => t.offerIds.includes(o.id) && o.status === 'active')
}

/* ---------- computed: admin trends ---------- */
const filteredAdminTrends = computed(() => {
  const q = adminTrendSearch.value.toLowerCase()
  const cat = adminCategoryFilter.value
  const sf = adminTrendStatusFilter.value
  const now = Date.now()
  return trends.value.filter(t => {
    if (q && !t.headline.toLowerCase().includes(q)) return false
    if (cat && t.category !== cat) return false
    const effectiveStatus = t.expiresAt < now ? 'expired' : t.status
    if (sf !== 'all' && effectiveStatus !== sf) return false
    return true
  })
})

function effectiveStatus(t: Trend) {
  return t.expiresAt < Date.now() ? 'expired' : t.status
}

/* ---------- computed: admin offers ---------- */
const filteredAdminOffers = computed(() => {
  const q = adminOfferSearch.value.toLowerCase()
  const cat = adminOfferCategoryFilter.value
  return offers.value.filter(o =>
    (!q || o.name.toLowerCase().includes(q)) &&
    (!cat || o.category === cat)
  )
})

function linkedTrendsCount(offerId: string) {
  return trends.value.filter(t => t.offerIds.includes(offerId)).length
}

/* ---------- computed: analytics ---------- */
const sortedTrendsByViews = computed(() =>
  [...trends.value].sort((a, b) => (b.views || 0) - (a.views || 0))
)

/* ---------- affiliate actions ---------- */
function copyHook(hook: string, trendId: string) {
  navigator.clipboard.writeText(hook)
  toast('Hook copied!')
  analytics.value.totalHookCopies = (analytics.value.totalHookCopies || 0) + 1
  const t = trends.value.find(x => x.id === trendId)
  if (t) t.hookCopies = (t.hookCopies || 0) + 1
  persist()
}

function copyAllHooks(trendId: string) {
  const t = trends.value.find(x => x.id === trendId)
  if (!t) return
  navigator.clipboard.writeText(t.hooks.join('\n'))
  toast('All hooks copied!')
  analytics.value.totalHookCopies = (analytics.value.totalHookCopies || 0) + t.hooks.length
  t.hookCopies = (t.hookCopies || 0) + t.hooks.length
  persist()
}

function openViewOffers(trendId: string) {
  const t = trends.value.find(x => x.id === trendId)
  if (!t) return
  viewOffersTitle.value = 'Offers for: ' + t.headline
  viewOffersTrendId.value = trendId
  showViewOffersModal.value = true
  analytics.value.totalOfferViews = (analytics.value.totalOfferViews || 0) + 1
  t.views = (t.views || 0) + 1
  persist()
}

const viewOffersLinked = computed(() => {
  const t = trends.value.find(x => x.id === viewOffersTrendId.value)
  if (!t) return []
  return offers.value.filter(o => t.offerIds.includes(o.id) && o.status === 'active')
})

function trackOfferClick(trendId: string) {
  const t = trends.value.find(x => x.id === trendId)
  if (t) t.offerClicks = (t.offerClicks || 0) + 1
  analytics.value.totalTrendClicks = (analytics.value.totalTrendClicks || 0) + 1
  persist()
  toast('Redirecting to offer...')
}

/* ---------- trend modal ---------- */
function openCreateTrendModal() {
  trendFormId.value = ''
  trendFormHeadline.value = ''
  trendFormCategory.value = ''
  trendFormExpiry.value = 72
  trendFormHooks.value = ['']
  trendFormOfferIds.value = []
  trendFormStatus.value = 'active'
  showTrendModal.value = true
}

function openEditTrendModal(trendId: string) {
  const t = trends.value.find(x => x.id === trendId)
  if (!t) return
  trendFormId.value = t.id
  trendFormHeadline.value = t.headline
  trendFormCategory.value = t.category
  trendFormExpiry.value = Math.max(1, Math.round((t.expiresAt - Date.now()) / 3.6e6))
  trendFormHooks.value = [...t.hooks]
  trendFormOfferIds.value = [...t.offerIds]
  trendFormStatus.value = t.status
  showTrendModal.value = true
}

function addHookInput() {
  trendFormHooks.value.push('')
}

function removeHookInput(index: number) {
  if (trendFormHooks.value.length > 1) {
    trendFormHooks.value.splice(index, 1)
  }
}

function toggleOfferSelection(offerId: string) {
  const idx = trendFormOfferIds.value.indexOf(offerId)
  if (idx >= 0) trendFormOfferIds.value.splice(idx, 1)
  else trendFormOfferIds.value.push(offerId)
}

const activeOffersList = computed(() => offers.value.filter(o => o.status === 'active'))

function saveTrend() {
  const hl = trendFormHeadline.value.trim()
  const cat = trendFormCategory.value
  const hooks = trendFormHooks.value.map(h => h.trim()).filter(h => h)
  if (!hl) { toast('Enter a headline', 'error'); return }
  if (!cat) { toast('Select a category', 'error'); return }
  if (!hooks.length) { toast('Add at least one hook', 'error'); return }

  const now = Date.now()
  if (trendFormId.value) {
    const idx = trends.value.findIndex(t => t.id === trendFormId.value)
    if (idx !== -1) {
      trends.value[idx] = {
        ...trends.value[idx],
        headline: hl,
        category: cat,
        hooks,
        offerIds: [...trendFormOfferIds.value],
        status: trendFormStatus.value,
        expiresAt: now + trendFormExpiry.value * 3.6e6,
      }
    }
  } else {
    trends.value.push({
      id: Date.now().toString(),
      headline: hl,
      category: cat,
      hooks,
      offerIds: [...trendFormOfferIds.value],
      status: trendFormStatus.value,
      createdAt: now,
      expiresAt: now + trendFormExpiry.value * 3.6e6,
      views: 0,
      hookCopies: 0,
      offerClicks: 0,
    })
  }
  persist()
  showTrendModal.value = false
  toast(trendFormId.value ? 'Trend updated' : 'Trend created')
}

function deleteTrend(trendId: string) {
  if (!confirm('Delete this trend?')) return
  trends.value = trends.value.filter(t => t.id !== trendId)
  persist()
  toast('Trend deleted')
}

/* ---------- offer modal ---------- */
function openCreateOfferModal() {
  offerFormId.value = ''
  offerFormName.value = ''
  offerFormCategory.value = ''
  offerFormPayout.value = ''
  offerFormUrl.value = ''
  offerFormStatus.value = 'active'
  showOfferModal.value = true
}

function openEditOfferModal(offerId: string) {
  const o = offers.value.find(x => x.id === offerId)
  if (!o) return
  offerFormId.value = o.id
  offerFormName.value = o.name
  offerFormCategory.value = o.category
  offerFormPayout.value = o.payout
  offerFormUrl.value = o.url || ''
  offerFormStatus.value = o.status
  showOfferModal.value = true
}

function saveOffer() {
  const name = offerFormName.value.trim()
  const cat = offerFormCategory.value
  const pay = offerFormPayout.value.trim()
  if (!name) { toast('Enter a name', 'error'); return }
  if (!cat) { toast('Select a category', 'error'); return }
  if (!pay) { toast('Enter a payout', 'error'); return }

  if (offerFormId.value) {
    const idx = offers.value.findIndex(o => o.id === offerFormId.value)
    if (idx !== -1) {
      offers.value[idx] = {
        ...offers.value[idx],
        name,
        category: cat,
        payout: pay,
        url: offerFormUrl.value.trim(),
        status: offerFormStatus.value,
      }
    }
  } else {
    offers.value.push({
      id: Date.now().toString(),
      name,
      category: cat,
      payout: pay,
      url: offerFormUrl.value.trim(),
      status: offerFormStatus.value,
    })
  }
  persist()
  showOfferModal.value = false
  toast(offerFormId.value ? 'Offer updated' : 'Offer created')
}

function deleteOffer(offerId: string) {
  if (!confirm('Delete this offer?')) return
  offers.value = offers.value.filter(o => o.id !== offerId)
  trends.value.forEach(t => {
    t.offerIds = t.offerIds.filter(id => id !== offerId)
  })
  persist()
  toast('Offer deleted')
}

/* ---------- init ---------- */
onMounted(() => {
  initData()
})
</script>

<template>
  <div class="ta-root">
    <!-- ===== Tab Navigation ===== -->
    <div class="ta-tabs">
      <button
        v-for="tab in ([
          { key: 'affiliate-trends', label: 'Trending Angles' },
          { key: 'admin-trends', label: 'Manage Trends' },
          { key: 'admin-offers', label: 'Manage Offers' },
          { key: 'admin-analytics', label: 'Analytics' },
        ] as const)"
        :key="tab.key"
        class="ta-tab"
        :class="{ active: currentView === tab.key }"
        @click="currentView = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.key === 'affiliate-trends'" class="ta-tab-badge">{{ statActiveTrends }}</span>
      </button>
    </div>

    <!-- ================================================================== -->
    <!-- AFFILIATE TRENDS VIEW                                              -->
    <!-- ================================================================== -->
    <div v-if="currentView === 'affiliate-trends'">
      <div class="ta-page-header">
        <div>
          <h2 class="ta-page-title">Trending Angles Right Now</h2>
          <p class="ta-page-subtitle">Click a trend to see matched offers &middot; Hooks ready to copy</p>
        </div>
        <div class="ta-live-badge"><span class="ta-live-dot"></span>Live</div>
      </div>

      <!-- stats -->
      <div class="ta-stats-bar">
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Active Trends</div>
          <div class="ta-stat-value">{{ statActiveTrends }}</div>
        </CardContent></Card>
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Matched Offers</div>
          <div class="ta-stat-value">{{ statMatchedOffers }}</div>
        </CardContent></Card>
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Ready Hooks</div>
          <div class="ta-stat-value">{{ statReadyHooks }}</div>
        </CardContent></Card>
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Avg. Time Left</div>
          <div class="ta-stat-value">{{ statAvgTime }}</div>
        </CardContent></Card>
      </div>

      <!-- filters -->
      <div class="ta-filters-bar">
        <input
          v-model="affiliateSearch"
          type="text"
          class="ta-search-input"
          placeholder="Search trends..."
        />
        <select v-model="affiliateCategoryFilter" class="ta-filter-select">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ cap(c) }}</option>
        </select>
      </div>

      <!-- empty state -->
      <div v-if="!activeTrends.length" class="ta-empty-state">
        <div class="ta-empty-icon">&#9889;</div>
        <h3 class="ta-empty-title">No trending angles right now</h3>
        <p class="ta-empty-text">Check back soon</p>
      </div>

      <!-- trends grid -->
      <div v-else class="ta-trends-grid">
        <Card v-for="t in activeTrends" :key="t.id" class="ta-trend-card">
          <CardContent class="p-0">
            <div class="ta-trend-header">
              <div class="ta-trend-headline">{{ t.headline }}</div>
              <div class="ta-trend-meta">
                <span class="ta-category-tag" :class="t.category">{{ cap(t.category) }}</span>
                <span class="ta-offer-count">{{ offersForTrend(t).length }} offer{{ offersForTrend(t).length !== 1 ? 's' : '' }}</span>
              </div>
            </div>
            <div class="ta-hooks-section">
              <div class="ta-hooks-head">
                <span class="ta-hooks-title">Ready-to-use hooks</span>
                <Button size="sm" variant="secondary" @click="copyAllHooks(t.id)">Copy all</Button>
              </div>
              <div class="ta-hooks-list">
                <div
                  v-for="(hook, hi) in t.hooks"
                  :key="hi"
                  class="ta-hook-item"
                  @click="copyHook(hook, t.id)"
                >
                  <span class="ta-hook-arrow">&rarr;</span>
                  <span>{{ hook }}</span>
                </div>
              </div>
            </div>
            <div class="ta-trend-footer">
              <Button size="sm" @click="openViewOffers(t.id)">
                View {{ offersForTrend(t).length }} Offer{{ offersForTrend(t).length !== 1 ? 's' : '' }}
              </Button>
              <div class="ta-time-remaining">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {{ hoursLeft(t.expiresAt) }}h left
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- ADMIN: MANAGE TRENDS                                               -->
    <!-- ================================================================== -->
    <div v-if="currentView === 'admin-trends'">
      <div class="ta-page-header">
        <div>
          <h2 class="ta-page-title">Manage Trends</h2>
          <p class="ta-page-subtitle">Create, edit, and manage trending angles</p>
        </div>
        <Button @click="openCreateTrendModal">+ Add Trend</Button>
      </div>

      <!-- status tabs -->
      <div class="ta-status-tabs">
        <button
          v-for="sf in ['all', 'active', 'paused', 'expired']"
          :key="sf"
          class="ta-status-tab"
          :class="{ active: adminTrendStatusFilter === sf }"
          @click="adminTrendStatusFilter = sf"
        >{{ cap(sf) }}</button>
      </div>

      <div class="ta-filters-bar">
        <input v-model="adminTrendSearch" type="text" class="ta-search-input" placeholder="Search trends..." />
        <select v-model="adminCategoryFilter" class="ta-filter-select">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ cap(c) }}</option>
        </select>
      </div>

      <div v-if="!filteredAdminTrends.length" class="ta-empty-state">
        <h3 class="ta-empty-title">No trends found</h3>
      </div>

      <Card v-else>
        <CardContent class="p-0">
          <div class="ta-table-wrap">
            <table class="ta-table">
              <thead>
                <tr>
                  <th>Headline</th><th>Category</th><th>Hooks</th><th>Offers</th><th>Status</th><th>Expires</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in filteredAdminTrends" :key="t.id">
                  <td class="font-medium">{{ t.headline }}</td>
                  <td><span class="ta-category-tag" :class="t.category">{{ cap(t.category) }}</span></td>
                  <td>{{ t.hooks.length }}</td>
                  <td>{{ offers.filter(o => t.offerIds.includes(o.id)).length }}</td>
                  <td>
                    <span class="ta-status-badge" :class="effectiveStatus(t)">
                      <span class="ta-status-dot"></span>{{ cap(effectiveStatus(t)) }}
                    </span>
                  </td>
                  <td>{{ t.expiresAt < Date.now() ? 'Expired' : hoursLeft(t.expiresAt) + 'h left' }}</td>
                  <td>
                    <div class="flex gap-2">
                      <Button size="sm" variant="secondary" @click="openEditTrendModal(t.id)">Edit</Button>
                      <Button size="sm" variant="destructive" @click="deleteTrend(t.id)">Delete</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================== -->
    <!-- ADMIN: MANAGE OFFERS                                               -->
    <!-- ================================================================== -->
    <div v-if="currentView === 'admin-offers'">
      <div class="ta-page-header">
        <div>
          <h2 class="ta-page-title">Manage Offers</h2>
          <p class="ta-page-subtitle">Add offers that can be linked to trends</p>
        </div>
        <Button @click="openCreateOfferModal">+ Add Offer</Button>
      </div>

      <div class="ta-filters-bar">
        <input v-model="adminOfferSearch" type="text" class="ta-search-input" placeholder="Search offers..." />
        <select v-model="adminOfferCategoryFilter" class="ta-filter-select">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ cap(c) }}</option>
        </select>
      </div>

      <div v-if="!filteredAdminOffers.length" class="ta-empty-state">
        <h3 class="ta-empty-title">No offers found</h3>
      </div>

      <Card v-else>
        <CardContent class="p-0">
          <div class="ta-table-wrap">
            <table class="ta-table">
              <thead>
                <tr>
                  <th>Offer Name</th><th>Category</th><th>Payout</th><th>Linked Trends</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="o in filteredAdminOffers" :key="o.id">
                  <td class="font-medium">{{ o.name }}</td>
                  <td><span class="ta-category-tag" :class="o.category">{{ cap(o.category) }}</span></td>
                  <td class="text-green-400 font-semibold">{{ o.payout }}</td>
                  <td>{{ linkedTrendsCount(o.id) }} trend{{ linkedTrendsCount(o.id) !== 1 ? 's' : '' }}</td>
                  <td>
                    <span class="ta-status-badge" :class="o.status">
                      <span class="ta-status-dot"></span>{{ cap(o.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <Button size="sm" variant="secondary" @click="openEditOfferModal(o.id)">Edit</Button>
                      <Button size="sm" variant="destructive" @click="deleteOffer(o.id)">Delete</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================== -->
    <!-- ANALYTICS VIEW                                                     -->
    <!-- ================================================================== -->
    <div v-if="currentView === 'admin-analytics'">
      <div class="ta-page-header">
        <div>
          <h2 class="ta-page-title">Analytics</h2>
          <p class="ta-page-subtitle">Track trend performance and engagement</p>
        </div>
      </div>

      <div class="ta-stats-bar">
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Total Trend Clicks</div>
          <div class="ta-stat-value">{{ analytics.totalTrendClicks }}</div>
          <div class="ta-stat-change up">+12% this week</div>
        </CardContent></Card>
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Hook Copies</div>
          <div class="ta-stat-value">{{ analytics.totalHookCopies }}</div>
          <div class="ta-stat-change up">+8% this week</div>
        </CardContent></Card>
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Offer Views</div>
          <div class="ta-stat-value">{{ analytics.totalOfferViews }}</div>
          <div class="ta-stat-change up">+15% this week</div>
        </CardContent></Card>
        <Card><CardContent class="p-5">
          <div class="ta-stat-label">Conversion Rate</div>
          <div class="ta-stat-value">3.2%</div>
          <div class="ta-stat-change down">-2% this week</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent class="p-0">
          <div class="ta-table-wrap">
            <table class="ta-table">
              <thead>
                <tr><th>Trend</th><th>Views</th><th>Hook Copies</th><th>Offer Clicks</th><th>CTR</th></tr>
              </thead>
              <tbody>
                <tr v-for="t in sortedTrendsByViews" :key="t.id">
                  <td class="font-medium">{{ t.headline }}</td>
                  <td>{{ t.views || 0 }}</td>
                  <td>{{ t.hookCopies || 0 }}</td>
                  <td>{{ t.offerClicks || 0 }}</td>
                  <td>{{ t.views > 0 ? ((t.offerClicks / t.views) * 100).toFixed(1) : '0.0' }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================== -->
    <!-- TREND MODAL                                                        -->
    <!-- ================================================================== -->
    <div v-if="showTrendModal" class="ta-modal-overlay" @click.self="showTrendModal = false">
      <div class="ta-modal">
        <div class="ta-modal-header">
          <h2 class="ta-modal-title">{{ trendFormId ? 'Edit Trend' : 'Add New Trend' }}</h2>
          <button class="ta-modal-close" @click="showTrendModal = false">&times;</button>
        </div>
        <div class="ta-modal-body">
          <div class="ta-form-group">
            <label class="ta-form-label">Headline *</label>
            <input v-model="trendFormHeadline" type="text" class="ta-form-input" />
          </div>
          <div class="ta-form-row">
            <div class="ta-form-group">
              <label class="ta-form-label">Category *</label>
              <select v-model="trendFormCategory" class="ta-form-input">
                <option value="">Select</option>
                <option v-for="c in categories" :key="c" :value="c">{{ cap(c) }}</option>
              </select>
            </div>
            <div class="ta-form-group">
              <label class="ta-form-label">Expires In (hours) *</label>
              <input v-model.number="trendFormExpiry" type="number" class="ta-form-input" min="1" max="168" />
            </div>
          </div>
          <div class="ta-form-group">
            <label class="ta-form-label">Hooks *</label>
            <div class="ta-hooks-input-list">
              <div v-for="(_hook, i) in trendFormHooks" :key="i" class="ta-hook-input-row">
                <input
                  v-model="trendFormHooks[i]"
                  type="text"
                  class="ta-form-input"
                  :placeholder="i === 0 ? 'Add a hook...' : 'Add another hook...'"
                />
                <button type="button" class="ta-remove-hook-btn" @click="removeHookInput(i)">&times;</button>
              </div>
            </div>
            <button type="button" class="ta-add-hook-btn" @click="addHookInput">+ Add another hook</button>
          </div>
          <div class="ta-form-group">
            <label class="ta-form-label">Link Offers</label>
            <div class="ta-offers-selector">
              <div class="ta-offers-selector-header">
                <span>Select offers</span>
                <span>{{ trendFormOfferIds.length }} selected</span>
              </div>
              <div class="ta-offers-list">
                <label
                  v-for="o in activeOffersList"
                  :key="o.id"
                  class="ta-offer-checkbox-item"
                >
                  <input
                    type="checkbox"
                    :checked="trendFormOfferIds.includes(o.id)"
                    @change="toggleOfferSelection(o.id)"
                  />
                  <div>
                    <div class="font-medium text-sm">{{ o.name }}</div>
                    <div class="text-green-400 text-xs">{{ o.payout }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="ta-form-group">
            <label class="ta-form-label">Status</label>
            <select v-model="trendFormStatus" class="ta-form-input">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
        <div class="ta-modal-footer">
          <Button variant="secondary" @click="showTrendModal = false">Cancel</Button>
          <Button @click="saveTrend">Save Trend</Button>
        </div>
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- OFFER MODAL                                                        -->
    <!-- ================================================================== -->
    <div v-if="showOfferModal" class="ta-modal-overlay" @click.self="showOfferModal = false">
      <div class="ta-modal">
        <div class="ta-modal-header">
          <h2 class="ta-modal-title">{{ offerFormId ? 'Edit Offer' : 'Add New Offer' }}</h2>
          <button class="ta-modal-close" @click="showOfferModal = false">&times;</button>
        </div>
        <div class="ta-modal-body">
          <div class="ta-form-group">
            <label class="ta-form-label">Offer Name *</label>
            <input v-model="offerFormName" type="text" class="ta-form-input" />
          </div>
          <div class="ta-form-row">
            <div class="ta-form-group">
              <label class="ta-form-label">Category *</label>
              <select v-model="offerFormCategory" class="ta-form-input">
                <option value="">Select</option>
                <option v-for="c in categories" :key="c" :value="c">{{ cap(c) }}</option>
              </select>
            </div>
            <div class="ta-form-group">
              <label class="ta-form-label">Payout *</label>
              <input v-model="offerFormPayout" type="text" class="ta-form-input" />
            </div>
          </div>
          <div class="ta-form-group">
            <label class="ta-form-label">Offer URL</label>
            <input v-model="offerFormUrl" type="url" class="ta-form-input" />
          </div>
          <div class="ta-form-group">
            <label class="ta-form-label">Status</label>
            <select v-model="offerFormStatus" class="ta-form-input">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
        <div class="ta-modal-footer">
          <Button variant="secondary" @click="showOfferModal = false">Cancel</Button>
          <Button @click="saveOffer">Save Offer</Button>
        </div>
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- VIEW OFFERS MODAL                                                  -->
    <!-- ================================================================== -->
    <div v-if="showViewOffersModal" class="ta-modal-overlay" @click.self="showViewOffersModal = false">
      <div class="ta-modal">
        <div class="ta-modal-header">
          <h2 class="ta-modal-title">{{ viewOffersTitle }}</h2>
          <button class="ta-modal-close" @click="showViewOffersModal = false">&times;</button>
        </div>
        <div class="ta-modal-body">
          <div v-if="!viewOffersLinked.length" class="text-center text-muted-foreground py-5">
            No active offers linked.
          </div>
          <div v-else class="ta-linked-offers-list">
            <div v-for="o in viewOffersLinked" :key="o.id" class="ta-linked-offer-card">
              <div>
                <div class="font-medium">{{ o.name }}</div>
                <div class="text-green-400 text-sm">{{ o.payout }}</div>
              </div>
              <Button size="sm" @click="trackOfferClick(viewOffersTrendId)">Apply Now</Button>
            </div>
          </div>
        </div>
        <div class="ta-modal-footer">
          <Button variant="secondary" @click="showViewOffersModal = false">Close</Button>
        </div>
      </div>
    </div>

    <!-- ===== Toast ===== -->
    <Transition name="ta-toast">
      <div v-if="toastVisible" class="ta-toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ---- layout ---- */
.ta-root {
  width: 100%;
}

/* ---- tabs nav (replaces sidebar) ---- */
.ta-tabs {
  display: flex;
  gap: 4px;
  background: hsl(var(--card));
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 24px;
  width: fit-content;
  border: 1px solid hsl(var(--border));
}
.ta-tab {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: none;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.ta-tab:hover { color: hsl(var(--foreground)); }
.ta-tab.active { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
.ta-tab-badge {
  background: hsl(var(--primary-foreground));
  color: hsl(var(--primary));
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

/* ---- page header ---- */
.ta-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.ta-page-title { font-size: 24px; font-weight: 700; }
.ta-page-subtitle { font-size: 14px; color: hsl(var(--muted-foreground)); margin-top: 4px; }

.ta-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}
.ta-live-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: ta-pulse 2s infinite;
}
@keyframes ta-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ---- stats ---- */
.ta-stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.ta-stat-label {
  font-size: 12px;
  color: hsl(var(--muted-foreground));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.ta-stat-value { font-size: 28px; font-weight: 700; }
.ta-stat-change { font-size: 12px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
.ta-stat-change.up { color: #22c55e; }
.ta-stat-change.down { color: #ef4444; }

/* ---- filters ---- */
.ta-filters-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.ta-search-input {
  flex: 1;
  min-width: 250px;
  padding: 10px 14px;
  background: hsl(var(--input));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  color: hsl(var(--foreground));
  font-size: 14px;
  font-family: inherit;
}
.ta-search-input:focus { outline: none; border-color: hsl(var(--primary)); }
.ta-search-input::placeholder { color: hsl(var(--muted-foreground)); }
.ta-filter-select {
  padding: 10px 14px;
  background: hsl(var(--input));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  color: hsl(var(--foreground));
  font-size: 14px;
  font-family: inherit;
}

/* ---- status filter tabs ---- */
.ta-status-tabs {
  display: flex;
  gap: 4px;
  background: hsl(var(--card));
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: fit-content;
  border: 1px solid hsl(var(--border));
}
.ta-status-tab {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: none;
  font-family: inherit;
}
.ta-status-tab.active { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }

/* ---- category tags ---- */
.ta-category-tag {
  display: inline-flex;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 5px 10px;
  border-radius: 6px;
}
.ta-category-tag.finance { color: #f59e0b; background: rgba(245, 158, 11, 0.12); }
.ta-category-tag.ecommerce { color: #3b82f6; background: rgba(59, 130, 246, 0.12); }
.ta-category-tag.health { color: #10b981; background: rgba(16, 185, 129, 0.12); }
.ta-category-tag.insurance { color: #ec4899; background: rgba(236, 72, 153, 0.12); }
.ta-category-tag.tech { color: #8b5cf6; background: rgba(139, 92, 246, 0.12); }
.ta-category-tag.legal { color: #64748b; background: rgba(100, 116, 139, 0.12); }

/* ---- status badge ---- */
.ta-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}
.ta-status-badge.active { color: #22c55e; background: rgba(34, 197, 94, 0.15); }
.ta-status-badge.paused { color: #f59e0b; background: rgba(245, 158, 11, 0.15); }
.ta-status-badge.expired { color: hsl(var(--muted-foreground)); background: hsl(var(--muted)); }
.ta-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* ---- trends grid ---- */
.ta-trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}
.ta-trend-card {
  transition: all 0.2s ease;
}
.ta-trend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.ta-trend-header { padding: 20px; }
.ta-trend-headline { font-size: 17px; font-weight: 600; line-height: 1.4; margin-bottom: 14px; }
.ta-trend-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.ta-offer-count { color: hsl(var(--primary)); font-weight: 600; font-size: 13px; }

/* ---- hooks section ---- */
.ta-hooks-section {
  border-top: 1px solid hsl(var(--border));
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.08);
}
.ta-hooks-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.ta-hooks-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: hsl(var(--muted-foreground));
  font-weight: 600;
}
.ta-hooks-list { display: flex; flex-direction: column; gap: 8px; }
.ta-hook-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  line-height: 1.5;
  padding: 10px 12px;
  background: hsl(var(--card));
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.ta-hook-item:hover { background: hsl(var(--accent)); color: hsl(var(--foreground)); }
.ta-hook-arrow { color: hsl(var(--primary)); flex-shrink: 0; }

/* ---- trend card footer ---- */
.ta-trend-footer {
  padding: 16px 20px;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ta-time-remaining {
  font-size: 13px;
  color: hsl(var(--muted-foreground));
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ---- table ---- */
.ta-table-wrap { overflow-x: auto; }
.ta-table { width: 100%; border-collapse: collapse; }
.ta-table th {
  text-align: left;
  padding: 14px 20px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: hsl(var(--muted-foreground));
  background: hsl(var(--muted));
  border-bottom: 1px solid hsl(var(--border));
  font-weight: 600;
}
.ta-table td {
  padding: 16px 20px;
  border-bottom: 1px solid hsl(var(--border));
  font-size: 14px;
}
.ta-table tr:last-child td { border-bottom: none; }
.ta-table tr:hover td { background: hsl(var(--accent)); }

/* ---- empty state ---- */
.ta-empty-state { text-align: center; padding: 60px 20px; }
.ta-empty-icon { font-size: 32px; margin-bottom: 16px; }
.ta-empty-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.ta-empty-text { font-size: 14px; color: hsl(var(--muted-foreground)); }

/* ---- modal ---- */
.ta-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}
.ta-modal {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ta-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid hsl(var(--border));
}
.ta-modal-title { font-size: 18px; font-weight: 600; }
.ta-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  border-radius: 8px;
  font-size: 20px;
}
.ta-modal-close:hover { background: hsl(var(--accent)); }
.ta-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.ta-modal-footer {
  padding: 16px 24px;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ---- form ---- */
.ta-form-group { margin-bottom: 20px; }
.ta-form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin-bottom: 8px;
}
.ta-form-input {
  width: 100%;
  padding: 10px 14px;
  background: hsl(var(--input));
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  color: hsl(var(--foreground));
  font-size: 14px;
  font-family: inherit;
}
.ta-form-input:focus { outline: none; border-color: hsl(var(--primary)); }
.ta-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* ---- hooks input ---- */
.ta-hooks-input-list { display: flex; flex-direction: column; gap: 8px; }
.ta-hook-input-row { display: flex; gap: 8px; }
.ta-hook-input-row .ta-form-input { flex: 1; }
.ta-remove-hook-btn {
  width: 40px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.15);
  border: none;
  border-radius: 10px;
  color: #ef4444;
  cursor: pointer;
  font-size: 18px;
}
.ta-remove-hook-btn:hover { background: #ef4444; color: white; }
.ta-add-hook-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: hsl(var(--muted));
  border: 1px dashed hsl(var(--border));
  border-radius: 10px;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  width: 100%;
  margin-top: 8px;
}
.ta-add-hook-btn:hover { color: hsl(var(--foreground)); }

/* ---- offers selector ---- */
.ta-offers-selector {
  border: 1px solid hsl(var(--border));
  border-radius: 10px;
  overflow: hidden;
}
.ta-offers-selector-header {
  padding: 12px 14px;
  background: hsl(var(--muted));
  border-bottom: 1px solid hsl(var(--border));
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: hsl(var(--muted-foreground));
}
.ta-offers-list { max-height: 200px; overflow-y: auto; }
.ta-offer-checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  cursor: pointer;
}
.ta-offer-checkbox-item:hover { background: hsl(var(--accent)); }
.ta-offer-checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: hsl(var(--primary));
}

/* ---- linked offers ---- */
.ta-linked-offers-list { display: flex; flex-direction: column; gap: 12px; }
.ta-linked-offer-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: hsl(var(--muted));
  border-radius: 10px;
}

/* ---- toast ---- */
.ta-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  color: hsl(var(--foreground));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 2000;
}
.ta-toast.success { border-color: #22c55e; }
.ta-toast.error { border-color: #ef4444; }

.ta-toast-enter-active { transition: all 0.3s ease; }
.ta-toast-leave-active { transition: all 0.3s ease; }
.ta-toast-enter-from,
.ta-toast-leave-to { opacity: 0; transform: translateY(20px); }

/* ---- responsive ---- */
@media (max-width: 768px) {
  .ta-trends-grid { grid-template-columns: 1fr; }
  .ta-stats-bar { grid-template-columns: 1fr 1fr; }
  .ta-tabs { flex-wrap: wrap; }
  .ta-form-row { grid-template-columns: 1fr; }
}
</style>
