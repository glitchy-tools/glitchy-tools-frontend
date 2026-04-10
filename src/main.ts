import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

// Read auth token from URL param (passed by parent iframe) and store it
const params = new URLSearchParams(window.location.search)
const urlToken = params.get('token')
if (urlToken) {
  localStorage.setItem('glitchy_token', urlToken)
  // Clean token from URL so it's not visible in history
  params.delete('token')
  const cleanUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname
  window.history.replaceState({}, '', cleanUrl)
}

// Also listen for postMessage (fallback for future use)
const allowedOrigins = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https:\/\/([\w-]+\.)?glitchy\.(com|ai|cash|link|team)$/,
]

window.addEventListener('message', (event) => {
  if (!allowedOrigins.some(re => re.test(event.origin))) return
  if (event.data?.type === 'glitchy:auth' && event.data.token) {
    localStorage.setItem('glitchy_token', event.data.token)
  }
})

createApp(App).use(router).mount('#app')
