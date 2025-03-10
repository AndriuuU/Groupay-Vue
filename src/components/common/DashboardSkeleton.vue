<template>
    <div class="dashboard-skeleton">
      <div class="summary-skeleton">
        <div class="skeleton-card" v-for="i in 3" :key="i">
          <div class="skeleton-title"></div>
          <div class="skeleton-value"></div>
        </div>
      </div>
      <div class="sections-skeleton">
        <div class="skeleton-section" v-for="i in 2" :key="i">
          <div class="skeleton-header"></div>
          <div class="skeleton-item" v-for="j in 3" :key="j"></div>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  .dashboard-skeleton {
    padding: 20px;
  }
  
  .summary-skeleton {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .skeleton-card {
    background-color: var(--white);
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--box-shadow);
  }
  
  .skeleton-title, .skeleton-value {
    height: 20px;
    background-color: var(--skeleton-color);
    margin-bottom: 15px;
    border-radius: var(--border-radius);
  }

  
  @keyframes skeleton-loading {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  .dashboard-skeleton * {
    animation: skeleton-loading 1.5s infinite;
  }
  </style>
  