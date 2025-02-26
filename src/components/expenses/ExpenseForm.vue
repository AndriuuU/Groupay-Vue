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
              {{ member.name }}
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
            <label :for="'member-' + member.id">{{ member.name }}</label>
          </div>
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
          ...this.expense,
          date: new Date(this.expense.date).toISOString().substr(0, 10)
        };
      } else if (this.members.length > 0) {
        // Establecer el usuario actual como pagador por defecto
        this.form.paidBy = this.members[0].id;
        // Seleccionar a todos los miembros como participantes por defecto
        this.form.participants = this.members.map(member => member.id);
      }
    },
    methods: {
      async submitForm() {
        if (this.form.participants.length === 0) {
          this.error = 'Debes seleccionar al menos un participante';
          return;
        }
        
        this.isLoading = true;
        this.error = null;
        
        try {
          const expenseData = {
            ...this.form,
            amount: parseFloat(this.form.amount)
          };
          
          if (this.isEditing) {
            // const response = await expenseService.updateExpense(this.expense.id, expenseData);
            // this.$emit('expense-updated', response.data);
            this.$emit('expense-updated', { ...this.expense, ...expenseData });
          } else {
            // const response = await expenseService.createExpense(this.groupId, expenseData);
            // this.$emit('expense-created', response.data);
            const newExpense = {
              id: Date.now(),
              ...expenseData,
              createdAt: new Date().toISOString()
            };
            this.$emit('expense-created', newExpense);
          }
        } catch (error) {
          this.error = error.response?.data?.message || 'Error al guardar el gasto';
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  