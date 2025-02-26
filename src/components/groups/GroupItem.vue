<template>
    <div class="group-item" @click="$emit('click')">
      <div class="group-icon" :class="categoryClass">
        <i :class="categoryIcon"></i>
      </div>
      <div class="group-content">
        <h3 class="group-name">{{ group.name }}</h3>
        <p class="group-description">{{ group.description }}</p>
        <div class="group-meta">
          <span class="group-members">
            <i class="fas fa-users"></i> {{ group.members.length }} miembros
          </span>
          <span class="group-date">
            <i class="far fa-calendar-alt"></i> {{ formatDate(group.createdAt) }}
          </span>
        </div>
      </div>
      <div class="group-balance" :class="balanceClass">
        <span v-if="group.balance > 0">Te deben: {{ formatCurrency(group.balance) }}</span>
        <span v-else-if="group.balance < 0">Debes: {{ formatCurrency(Math.abs(group.balance)) }}</span>
        <span v-else>Balance: 0€</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GroupItem',
    props: {
      group: {
        type: Object,
        required: true
      }
    },
    computed: {
      categoryClass() {
        return `category-${this.group.category || 'other'}`;
      },
      categoryIcon() {
        const icons = {
          trip: 'fas fa-plane',
          home: 'fas fa-home',
          event: 'fas fa-calendar-day',
          project: 'fas fa-project-diagram',
          other: 'fas fa-layer-group'
        };
        return icons[this.group.category] || icons.other;
      },
      balanceClass() {
        return {
          'positive': this.group.balance > 0,
          'negative': this.group.balance < 0,
          'neutral': this.group.balance === 0
        };
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      },
      formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR'
        }).format(amount);
      }
    }
  };
  </script>
  