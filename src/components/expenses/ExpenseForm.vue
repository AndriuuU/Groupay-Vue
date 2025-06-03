<template>
  <div class="expense-form">
    <h3>{{ isEditing ? 'Editar Gasto' : 'Añadir Nuevo Gasto' }}</h3>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="description">Descripción</label>
        <input type="text" id="description" v-model="form.description" required>
      </div>
      <div class="form-group">
        <label for="amount">Cantidad (€)</label>
        <input type="number" id="amount" v-model="form.amount" step="0.01" required>
      </div>
      <div class="form-group">
        <label for="date">Fecha</label>
        <input type="date" id="date" v-model="form.date" required>
      </div>
      <div class="form-group">
        <label for="paidBy">Pagado por</label>
        <select id="paidBy" v-model="form.paidBy" required>
        <option v-for="member in members" :key="member.id" :value="member.id">
          {{ member.name }} ({{ member.email }})
        </option>

        </select>
      </div>
      <div class="form-group">
        <label>Participantes</label>
        <div v-for="member in members" :key="member.id" class="checkbox-item">
          <input 
            type="checkbox" 
            :id="'member-' + member.id" 
            :value="member.id" 
            v-model="form.participants"
          >
          <label :for="'member-' + member.id">{{ member.name }} ({{ member.email }})</label>        </div>
      </div>
      <div class="form-group">
        <label for="category">Categoría</label>
        <select id="category" v-model="form.category">
          <option value="food">Comida</option>
          <option value="transport">Transporte</option>
          <option value="accommodation">Alojamiento</option>
          <option value="entertainment">Entretenimiento</option>
          <option value="utilities">Servicios</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Añadir Gasto') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import expenseService from '@/services/expenseService';

export default {
  name: 'ExpenseForm',
  props: {
    expense: {
      type: Object,
      default: null
    },
    groupId: {
      type: [Number, String],
      required: true
    },
    members: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        description: '',
        amount: '',
        date: new Date().toISOString().substr(0, 10),
        paidBy: '',
        participants: [],
        category: 'other'
      },
      isLoading: false,
      error: null
    };
  },
  computed: {
    isEditing() {
      return !!this.expense;
    }
  },
  created() {
  if (this.expense) {
    this.form = { 
      description: this.expense.description,
      amount: this.expense.amount,
      date: new Date(this.expense.date).toISOString().substr(0, 10),
      paidBy: this.expense.paid_by.id,
      participants: this.expense.participants.map(p => p.id),
      category: this.expense.category || 'other'
    };
  } else if (this.members.length > 0) {
    this.form.paidBy = this.members[0].id;
    this.form.participants = this.members.map(member => member.id);
  }
},
  methods: {
  async submitForm() {
    if (!this.form.description || !this.form.amount || !this.form.date || !this.form.paidBy || this.form.participants.length === 0) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      const expenseData = {
        description: this.form.description.trim(),
        amount: parseFloat(this.form.amount),
        date: this.form.date,
        category: this.form.category,
        paidBy: this.form.paidBy,
        participants: this.form.participants, 
      };
      if (this.isEditing) {
        await expenseService.updateExpense(this.expense.id, expenseData);
        this.$emit('expense-updated');
      } else {
        await expenseService.createExpense(this.groupId, expenseData);
        this.$emit('expense-created');
      }
      this.$emit('cancel');
    } catch (error) {
      this.error = 'Error al guardar el gasto.';
    } finally {
      this.isLoading = false;
    }
  }
}

};
</script>

<style scoped>
@import '../../assets/css/expenses/expense-form.css';
</style>
