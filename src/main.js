import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' // Importa el router

// Crea la aplicación Vue con el router
const app = createApp(App)
app.use(router) // Usa el router
app.mount('#app')
