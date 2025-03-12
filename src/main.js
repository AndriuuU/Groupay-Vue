// src/main.js
import { createApp } from 'vue'
import './assets/css/global.css'
import App from './App.vue'
import router from './router'
import FontAwesomeIcon from './assets/js/fontawesome'; // Importar configuración de Font Awesome


// Inicializar tema
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
}

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon); // Registrar el componente globalmente

app.use(router)
app.mount('#app')
