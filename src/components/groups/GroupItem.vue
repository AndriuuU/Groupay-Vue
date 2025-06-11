<template>
  <div class="group-item" @click="$emit('click')">
    <div class="group-icon" :class="categoryClass">
      <i :class="categoryIcon"></i>
    </div>
    <div class="group-content">
      <h3 class="group-name">{{ group.name }}</h3>
      <p class="group-description">{{ group.description }}</p>
      <div class="group-meta">
        <span v-if="group.members && group.members.length > 0" class="group-members">
          <i class="fas fa-users"></i> 
          Miembros: 
          <span v-if="group.members.length <= 5">
            {{ group.members.map(member => member.name).join(', ') }}
          </span>
          <span v-else>
            {{ group.members.length }} miembros
          </span>
        </span>
        
        <span v-else class="group-members">
          <i class="fas fa-users"></i> Sin miembros
        </span>
        <span v-if="group.created_at" class="group-date">
          <i class="far fa-calendar-alt"></i> {{ formatDate(group.created_at) }}
        </span>
        <span class="group-mode">
  <i class="fas fa-cogs"></i>
  {{ group.mode === 'ahorro' ? 'Ahorro conjunto' : 'Gastos compartidos' }}
</span>
      </div>
    </div>
   <!-- <div class="group-balance" :class="balanceClass">
      <span> {{group.gastos}}</span>
      
    </div>-->
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
        positive: this.group.balance > 0,
        negative: this.group.balance < 0,
        neutral: this.group.balance === 0
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

<style scoped>
@import '../../assets/css/groups/group-item.css';
</style>
