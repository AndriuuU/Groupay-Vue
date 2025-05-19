<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">Groupay</router-link>

      <div class="nav-links" v-if="isAuthenticated">
        <router-link to="/dashboard" class="nav-link">Panel</router-link>
        <router-link to="/groups" class="nav-link">Mis Grupos</router-link>
      </div>

      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>

        <div class="user-menu" v-if="isAuthenticated">
          <button class="user-button" @click="toggleUserMenu">
            <span>{{ userName }}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="user-menu-dropdown" v-if="showUserMenu">
            <router-link to="/profile" class="dropdown-item">Mi Perfil</router-link>
            <a href="#" @click.prevent="logout" class="dropdown-item danger">
              <i v-if="isLoading" class="fas fa-spinner fa-spin"></i> Cerrar Sesión
            </a>
          </div>
        </div>

        <div class="auth-links" v-else>
          <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
          <router-link to="/register" class="nav-link">Registrarse</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../store/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isDarkMode = ref(false)
const showUserMenu = ref(false)
const isLoading = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  }
})

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  const theme = isDarkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

async function logout() {
  isLoading.value = true
  try {
    await authStore.logout()
    showUserMenu.value = false
  } catch (e) {
    console.error('Error al cerrar sesión', e)
  } finally {
    isLoading.value = false
  }
}

const isAuthenticated = computed(() => !!user.value)
const userName = computed(() =>
  user.value?.displayName || user.value?.email || 'Usuario'
)
</script>

<style scoped>
@import '../../assets/css/app/AppHeader.css';
</style>
