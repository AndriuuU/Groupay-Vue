<template>
    <div class="login-form">
      <h2>Iniciar Sesión en Groupay</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="form.password" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>
      <!--<div class="form-actions">
        <button class="btn btn-google" @click="loginWithGoogle" :disabled="isLoading">
          <i class="fab fa-google"></i> Iniciar con Google
        </button>
      </div>
      -->
      <p class="login-footer">
        ¿No tienes cuenta? <router-link to="/register">Regístrate</router-link>
      </p>
    </div>
  </template>
  
  <script>
  import authService from '@/services/authService';
  
  export default {
    name: 'LoginForm',
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        isLoading: false,
        error: null
      };
    },
    methods: {
      async login() {
        this.isLoading = true;
        this.error = null;
        try {
          await authService.login(this.form);
          this.$emit('login-success');
          this.$router.push('/dashboard');
        } catch (error) {
          switch (error.code) {
            case 'auth/invalid-email':
              this.error = 'Email inválido';
              break;
            case 'auth/user-not-found':
              this.error = 'No existe una cuenta con ese email';
              break;
            case 'auth/wrong-password':
              this.error = 'Contraseña incorrecta';
              break;
            default:
              this.error = 'Error al iniciar sesión';
          }
        } finally {
          this.isLoading = false;
        }
      }
    }

  };
  </script>
  
  