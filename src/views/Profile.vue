<template>
    <div class="profile-page">
      <div class="profile-container">
        <h1>Mi Perfil</h1>
        
        <div v-if="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <form v-else @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input type="text" id="name" v-model="user.name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="user.email" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input type="tel" id="phone" v-model="user.phone">
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="isUpdating">
              {{ isUpdating ? 'Actualizando...' : 'Actualizar Perfil' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  
  export default {
    name: 'Profile',
    data() {
      return {
        user: {
          name: '',
          email: '',
          phone: ''
        },
        isLoading: true,
        isUpdating: false,
        error: null
      };
    },
    created() {
      this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const response = await api.get('/user');
          this.user = response.data;
          this.isLoading = false;
        } catch (error) {
          this.error = 'Error al cargar el perfil de usuario';
          this.isLoading = false;
        }
      },
      async updateProfile() {
        this.isUpdating = true;
        try {
          await api.put('/user', this.user);
          this.$router.push('/dashboard');
        } catch (error) {
          this.error = 'Error al actualizar el perfil';
        } finally {
          this.isUpdating = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-page {
    padding: 20px;
  }
  
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: var(--white);
    border-radius: var(--border-radius);
    padding: 30px;
    box-shadow: var(--box-shadow);
  }
  
  .profile-container h1 {
    color: var(--primary-color);
    margin-bottom: 30px;
  }
  
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 5px;
    color: var(--text-color);
  }
  
  .form-group input {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
  }
  
  .form-actions {
    margin-top: 20px;
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    color: var(--white);
    padding: 10px 20px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color var(--transition-speed);
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
  }
  
  .btn-primary:disabled {
    background-color: var(--text-light);
    cursor: not-allowed;
  }
  </style>
  