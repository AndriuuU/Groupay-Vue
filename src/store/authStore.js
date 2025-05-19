import { defineStore } from 'pinia';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      });
    },
    async logout() {
      await auth.signOut();
      this.user = null;
    }
  }
});
