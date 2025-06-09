<template>
  <div class="home-page">
    <section class="hero-section" aria-labelledby="main-title">
      <h1 id="main-title">Gestiona tus gastos en grupo de forma fácil y accesible</h1>
      <p class="tagline">
        Groupay te ayuda a organizar, dividir y saldar gastos con tus amigos, familia o compañeros.
      </p>
      <nav class="cta-buttons" aria-label="Acciones principales">
        <router-link to="/register" class="btn btn-primary" aria-label="Crear cuenta nueva">
          <span>Empezar ahora</span>
        </router-link>
        <router-link to="/groups" class="btn btn-secondary" aria-label="Ver mis grupos">
          <span>Ver mis grupos</span>
        </router-link>
      </nav>
    </section>

    <section class="features-section" aria-labelledby="features-title">
      <h2 id="features-title">Características principales</h2>
      <div class="feature-card" tabindex="0">
        <i class="fas fa-users feature-icon" aria-hidden="true"></i>
        <h3>Grupos ilimitados</h3>
        <p>Crea y gestiona todos los grupos que necesites, sin límites.</p>
      </div>
      <div class="feature-card" tabindex="0">
        <i class="fas fa-balance-scale feature-icon" aria-hidden="true"></i>
        <h3>Balances automáticos</h3>
        <p>Calcula automáticamente quién debe a quién y cuánto.</p>
      </div>
      <div class="feature-card" tabindex="0">
        <i class="fas fa-mobile-alt feature-icon" aria-hidden="true"></i>
        <h3>Accesible en cualquier dispositivo</h3>
        <p>Disfruta de una experiencia fluida y accesible desde móvil, tablet o PC.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import '../assets/css/views/home.css';

/* Foco visible para accesibilidad */
a:focus, button:focus, .btn:focus, .feature-card:focus {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}
</style>

  
  <script>
  export default {
    name: 'Home'
  }
  </script>
  <style>
  @import '../assets/css/views/home.css';
  </style>
  