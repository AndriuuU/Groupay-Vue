// src/stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuarioLogueado: null,
    token: null
  }),
  actions: {
    login(usuario) {
      this.usuarioLogueado = usuario
      localStorage.setItem('token', usuario.token)
      this.token = usuario.token
    },
    logout() {
      this.usuarioLogueado = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
