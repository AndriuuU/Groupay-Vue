<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">Groupay</router-link>
      
      <div class="nav-links" v-if="isAuthenticated">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
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
            <router-link to="/settings" class="dropdown-item">Configuración</router-link>
            <a href="#" @click.prevent="logout" class="dropdown-item danger">Cerrar Sesión</a>
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

<script>
import authService from '@/services/authService';

export default {
  name: 'AppHeader',
  data() {
    return {
      showUserMenu: false,
      userName: 'Usuario',
      isDarkMode: false
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserData();
    }
    
    // Verificar si hay una preferencia guardada para el tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Verificar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = prefersDark;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  },
  methods: {
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    async fetchUserData() {
      try {
        // En un entorno real, obtendrías los datos del usuario desde el API
        // const response = await authService.getCurrentUser();
        // this.userName = response.data.name;
        
        // Por ahora, usamos un valor por defecto
        this.userName = 'Usuario';
      } catch (error) {
        console.error('Error al obtener datos del usuario', error);
      }
    },
    async logout() {
      try {
        await authService.logout();
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión', error);
      }
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      const theme = this.isDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
};
</script>

<style scoped>
 @import '../../assets/css/app/AppHeader.css';
</style>
