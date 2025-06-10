import { createApp, watch } from 'vue' 
import { createPinia } from 'pinia'
import './assets/css/global.css'
import App from './App.vue'
import router from './router'
import FontAwesomeIcon from './assets/js/fontawesome'
import { useAuthStore } from './store/authStore'

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import { initNotificationListeners } from './services/notificationService'


const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
}

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(ToastPlugin, {
  position: 'top-right',
  duration: 4000,
  dismissible: true,
  pauseOnHover: true,
});
const authStore = useAuthStore()
authStore.init()

watch(
  () => authStore.user,
  (user) => {
    if (user) {
      initNotificationListeners(user.uid)
    }
  },
  { immediate: true }
)

app.mount('#app')

