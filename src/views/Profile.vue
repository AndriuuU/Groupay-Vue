<template>
  <div class="profile-page">
    <div class="profile-card">
      <h2>Mi Perfil</h2>
      <div v-if="user">
        <div class="profile-info">
          <p><strong>Nombre:</strong> {{ user.displayName || user.name || user.email }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <button class="btn btn-primary" @click="showEdit = true">Editar Perfil</button>
      </div>
      <div v-else>
        <p>No hay usuario autenticado.</p>
      </div>
    </div>

    <modal v-if="showEdit" @close="showEdit = false">
      <template #header>
        <h3>Editar Perfil</h3>
      </template>
      <template #body>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input id="name" v-model="editForm.name" required />
          </div>
          <button class="btn btn-primary" type="submit">Guardar</button>
        </form>
      </template>
    </modal>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore'
import Modal from '@/components/common/Modal.vue'
import { ref, computed } from 'vue'
import { updateProfile } from 'firebase/auth'
import { db } from '@/services/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export default {
  name: 'Profile',
  components: { Modal },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    const showEdit = ref(false)
    const editForm = ref({ name: user.value?.displayName || user.value?.name || '' })

    const saveProfile = async () => {
      if (!editForm.value.name) return
      // Actualiza el displayName en Firebase Auth
      await updateProfile(user.value, { displayName: editForm.value.name })
      // Actualiza el nombre en la colección users
      await updateDoc(doc(db, 'users', user.value.uid), { name: editForm.value.name })
      showEdit.value = false
      window.location.reload() // Refresca para mostrar el nuevo nombre
    }

    return { user, showEdit, editForm, saveProfile }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 500px;
  margin: 40px auto;
}
.profile-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 32px;
  text-align: center;
}
.profile-info p {
  margin: 10px 0;
  font-size: 1.1rem;
}
</style>
