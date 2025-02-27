<template>
    <div class="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <router-link to="/" class="btn btn-primary">Volver al inicio</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  };
  </script>
  
  <style>
  @import '../assets/css/views/not-found.css';

  </style>