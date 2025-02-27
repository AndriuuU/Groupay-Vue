<template>
    <button class="theme-toggle" @click="toggleTheme" :title="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
      <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
    </button>
  </template>
  
  <script>
  export default {
    name: 'ThemeToggle',
    data() {
      return {
        isDarkMode: false
      };
    },
    created() {
      // Verificar si hay una preferencia guardada
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
  .theme-toggle {
    background: none;
    border: none;
    color: var(--white);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-speed);
  }
  
  .theme-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  </style>
  