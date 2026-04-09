import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

// Listen for auth token from parent app (when embedded as iframe)
window.addEventListener('message', (event) => {
  if (event.data?.type === 'glitchy:auth' && event.data.token) {
    localStorage.setItem('glitchy_token', event.data.token)
  }
})

createApp(App).use(router).mount('#app')
