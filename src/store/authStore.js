// src/store/authStore.js
import { defineStore } from 'pinia'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    fetchUser() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
      })
    },
    logout() {
      this.user = null
    }
  }
})
