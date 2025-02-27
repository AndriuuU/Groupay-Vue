<template>
    <div class="login-page">
      <div class="auth-container">
        <login-form @login-success="onLoginSuccess" />
      </div>
    </div>
  </template>
  
  <script>
  import LoginForm from '../components/auth/LoginForm.vue';
  
  export default {
    name: 'Login',
    components: {
      LoginForm
    },
    methods: {
      onLoginSuccess(user) {
        this.$router.push('/dashboard');
      }
    }
  }
  </script>
  