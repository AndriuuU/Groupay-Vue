<template>
    <div class="register-form">
      <h2>Crear Cuenta en Groupay</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" v-model="form.name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="form.password" required>
        </div>
        <div class="form-group">
          <label for="password_confirmation">Confirmar Contraseña</label>
          <input type="password" id="password_confirmation" v-model="form.password_confirmation" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Registrando...' : 'Crear Cuenta' }}
          </button>
        </div>
      </form>
      <p class="register-footer">
        ¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link>
      </p>
    </div>
  </template>
  
  <script>
  import authService from '@/services/authService';
  
  export default {
    name: 'RegisterForm',
    data() {
      return {
        form: {
          name: '',
          email: '',
          password: '',
          password_confirmation: ''
        },
        isLoading: false,
        error: null
      };
    },
    methods: {
      async register() {
        if (this.form.password !== this.form.password_confirmation) {
          this.error = 'Las contraseñas no coinciden';
          return;
        }
        
        this.isLoading = true;
        this.error = null;
        
        try {
          const response = await authService.register(this.form);
          localStorage.setItem('token', response.data.token);
          this.$emit('register-success', response.data.user);
          this.$router.push('/dashboard');
        } catch (error) {
          this.error = error.response?.data?.message || 'Error al registrar usuario';
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  