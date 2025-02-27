<template>
    <div class="home-page">
      <div class="hero-section">
        <h1>Groupay</h1>
        <p class="tagline">La forma más sencilla de compartir gastos con amigos</p>
        <div class="cta-buttons">
          <router-link to="/register" class="btn btn-primary">Crear Cuenta</router-link>
          <router-link to="/login" class="btn btn-secondary">Iniciar Sesión</router-link>
        </div>
      </div>
      
      <div class="features-section">
        <div class="feature-card">
          <i class="fas fa-users feature-icon"></i>
          <h3>Crea Grupos</h3>
          <p>Organiza tus gastos por grupos: viajes, hogar, eventos y más</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-receipt feature-icon"></i>
          <h3>Registra Gastos</h3>
          <p>Añade gastos fácilmente y asígnalos a los participantes</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-balance-scale feature-icon"></i>
          <h3>Calcula Balances</h3>
          <p>Visualiza quién debe a quién y cuánto de forma automática</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home'
  }
  </script>
  <style>
  @import '../assets/css/views/home.css';
  </style>
  