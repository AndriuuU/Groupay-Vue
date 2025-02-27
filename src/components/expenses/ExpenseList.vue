<template>
    <div class="expense-list">
      <div class="expense-list-header">
        <h3>Gastos</h3>
        <div class="expense-filters">
          <select v-model="filter.category" class="filter-select">
            <option value="">Todas las categorías</option>
            <option value="food">Comida</option>
            <option value="transport">Transporte</option>
            <option value="accommodation">Alojamiento</option>
            <option value="entertainment">Entretenimiento</option>
            <option value="utilities">Servicios</option>
            <option value="other">Otro</option>
          </select>
          <select v-model="filter.timeFrame" class="filter-select">
            <option value="all">Todo el tiempo</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando gastos...</p>
      </div>
      
      <div v-else-if="filteredExpenses.length === 0" class="empty-state">
        <i class="fas fa-receipt empty-icon"></i>
        <h3>No hay gastos</h3>
        <p>Añade un gasto para comenzar a llevar el control</p>
      </div>
      
      <div v-else class="expense-items">
        <expense-item 
          v-for="expense in filteredExpenses" 
          :key="expense.id" 
          :expense="expense"
          :members="members"
          @edit="$emit('edit-expense', expense)"
          @delete="$emit('delete-expense', expense.id)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import ExpenseItem from './ExpenseItem.vue';
  
  export default {
    name: 'ExpenseList',
    components: {
      ExpenseItem
    },
    props: {
    expenses: {
      type: Array,
      default: () => []
    },
    members: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filter: {
        category: '',
        timeFrame: 'all'
      }
    };
  },
  computed: {
    filteredExpenses() {
      let result = [...this.expenses];
      
      // Filtrar por categoría
      if (this.filter.category) {
        result = result.filter(expense => expense.category === this.filter.category);
      }
      
      // Filtrar por período de tiempo
      if (this.filter.timeFrame !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (this.filter.timeFrame) {
          case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        }
        
        result = result.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate;
        });
      }
      
      // Ordenar por fecha (más reciente primero)
      return result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }
};
</script>

  