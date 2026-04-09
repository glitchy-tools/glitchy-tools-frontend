import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

// Listen for auth token from parent app (when embedded as iframe)
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
