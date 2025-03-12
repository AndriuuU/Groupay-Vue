<template>
    <div class="expenses-list">
        <h2 class="expenses-header">Gastos Recientes</h2>
        <div v-if="expenses.length === 0" class="empty-state">
            <i class="fas fa-empty-set"></i>
            <p>No hay gastos registrados.</p>
        </div>
        <div v-else class="expenses-container">
            <ExpenseItem v-for="expense in recentExpenses" :key="expense.id" :expense="expense" />
        </div>
        <div class="loading-container" v-if="isLoading">
            <div class="spinner"></div>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="loading-container" v-if="isLoading">
            <div class="spinner"></div>
        </div>
    </div>
</template>

<script>
import ExpenseItem from './ExpenseItem.vue';
import expenseService from '../services/expenseService';

export default {
    name: 'ExpenseList',
    components: {
        ExpenseItem
    },
    computed: {
        recentExpenses() {
            return this.expenses.slice(-5);
        }
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
        groupId: {
            type: [Number, String],
            required: true
        },

        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            error: null,
            isLoading: false
        }
    },
    methods: {
        async fetchExpenses() {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await expenseService.getGroupExpenses(this.groupId);
                this.expenses = response.data;
            } catch (error) {
                console.error('Error al cargar los gastos:', error);
                this.error = 'No se pudieron cargar los gastos.';
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
@import '../assets/css/expenses/expenses-item.css';
</style>