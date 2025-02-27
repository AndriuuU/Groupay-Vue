<template>
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-links">
          <a href="#" class="footer-link">Acerca de</a>
          <a href="#" class="footer-link">Términos</a>
          <a href="#" class="footer-link">Privacidad</a>
          <a href="#" class="footer-link">Contacto</a>
        </div>
        <p class="copyright">© {{ currentYear }} Groupay. Todos los derechos reservados.</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'AppFooter',
    computed: {
      currentYear() {
        return new Date().getFullYear();
      }
    }
  };
  </script>
  
  <style scoped>
  @import '../../assets/css/app/AppFooter.css';
  </style>
  