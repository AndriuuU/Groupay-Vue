<template>
    <div class="register-page">
      <div class="auth-container">
        <register-form @register-success="onRegisterSuccess" />
      </div>
    </div>
  </template>
  
  <script>
  import RegisterForm from '@/components/auth/RegisterForm.vue';
  
  export default {
    name: 'Register',
    components: {
      RegisterForm
    },
    methods: {
      onRegisterSuccess(user) {
        this.$router.push('/dashboard');
      }
    }
  }
  </script>
  
  <style>
  @import '../assets/css/views/register.css';

  </style>