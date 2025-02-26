<template>
    <div class="expense-item">
      <div class="expense-icon" :class="categoryClass">
        <i :class="categoryIcon"></i>
      </div>
      <div class="expense-content">
        <div class="expense-header">
          <h4 class="expense-description">{{ expense.description }}</h4>
          <span class="expense-amount">{{ formatCurrency(expense.amount) }}</span>
        </div>
        <div class="expense-details">
          <span class="expense-date">{{ formatDate(expense.date) }}</span>
          <span class="expense-paid-by">Pagado por: {{ getPaidByName() }}</span>
        </div>
        <div class="expense-participants">
          <span>Participantes: {{ getParticipantsNames() }}</span>
        </div>
      </div>
      <div class="expense-actions">
        <button class="btn-icon" @click.stop="$emit('edit')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon" @click.stop="confirmDelete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ExpenseItem',
    props: {
      expense: {
        type: Object,
        required: true
      },
      members: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      categoryClass() {
        return `category-${this.expense.category || 'other'}`;
      },
      categoryIcon() {
        const icons = {
          food: 'fas fa-utensils',
          transport: 'fas fa-car',
          accommodation: 'fas fa-home',
          entertainment: 'fas fa-film',
          utilities: 'fas fa-bolt',
          other: 'fas fa-shopping-bag'
        };
        return icons[this.expense.category] || icons.other;
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
      },
      getPaidByName() {
        const payer = this.members.find(member => member.id === this.expense.paidBy);
        return payer ? payer.name : 'Desconocido';
      },
      getParticipantsNames() {
        if (!this.expense.participants || this.expense.participants.length === 0) {
          return 'Ninguno';
        }
        
        const participantNames = this.expense.participants.map(participantId => {
          const member = this.members.find(m => m.id === participantId);
          return member ? member.name : 'Desconocido';
        });
        
        return participantNames.join(', ');
      },
      confirmDelete() {
        if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
          this.$emit('delete', this.expense.id);
        }
      }
    }
  };
  </script>
  