<template>
  <div class="statistics-page">
    <h1>Estadísticas de Gastos</h1>

    <div class="statistics-summary">
      <div class="statistics-card">
        <h3>Total Gastado</h3>
        <div class="statistics-value">{{ formatCurrency(totalSpent) }}</div>
      </div>
      <div class="statistics-card">
        <h3>Mis Gastos</h3>
        <div class="statistics-value">{{ formatCurrency(userSpent) }}</div>
      </div>
      <div class="statistics-card">
        <h3>Número de Gastos</h3>
        <div class="statistics-value">{{ expenses.length }}</div>
      </div>
    </div>

    <div class="statistics-charts">
      <!-- Aquí podrías integrar Chart.js o ApexCharts -->
      <div class="statistics-chart">
        <h4>Gasto por Categoría</h4>
        <ul>
          <li v-for="cat in categoryData" :key="cat.category">
            <span class="category-label">{{ cat.category }}</span>
            <span class="category-value">{{ formatCurrency(cat.value) }}</span>
          </li>
        </ul>
      </div>
      <div class="statistics-chart">
        <h4>Evolución Mensual</h4>
        <ul>
          <li v-for="month in monthlyData" :key="month.month">
            <span class="month-label">{{ month.month }}</span>
            <span class="month-value">{{ formatCurrency(month.value) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="statistics-ranking">
      <h2>Ranking de Miembros</h2>
      <table class="statistics-table">
        <thead>
          <tr>
            <th>Miembro</th>
            <th>Total Pagado</th>
            <th>Total Gastado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in memberStats" :key="member.id">
            <td>{{ member.name }}</td>
            <td>{{ formatCurrency(member.paid) }}</td>
            <td>{{ formatCurrency(member.spent) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="statistics-recent">
      <h2>Gastos Recientes</h2>
      <ul>
        <li v-for="expense in recentExpenses" :key="expense.id">
          {{ expense.description }} - {{ formatCurrency(expense.amount) }} ({{ expense.category }}) [{{ formatDate(expense.date) }}]
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import groupService from '@/services/groupService'
import expenseService from '@/services/expenseService'
import { auth } from '@/services/firebase'

export default {
  name: 'Statistics',
  data() {
    return {
      expenses: [],
      members: [],
      userId: '',
      isLoading: false,
      error: null
    }
  },
  async created() {
    this.isLoading = true
    try {
      this.userId = auth.currentUser?.uid
      const groups = await groupService.getGroups()
      let allExpenses = []
      let allMembers = []
      for (const group of groups) {
        if (group.members) allMembers.push(...group.members)
        const groupExpenses = await expenseService.getGroupExpenses(group.id)
        allExpenses.push(...groupExpenses)
      }
      this.expenses = allExpenses
      // Elimina duplicados de miembros por id
      this.members = Object.values(
        allMembers.reduce((acc, m) => {
          acc[m.id] = m
          return acc
        }, {})
      )
    } catch (e) {
      this.error = 'No se pudieron cargar las estadísticas.'
    } finally {
      this.isLoading = false
    }
  },
  computed: {
    totalSpent() {
      return this.expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    },
    userSpent() {
      return this.expenses
        .filter(e => e.paidBy === this.userId)
        .reduce((sum, e) => sum + Number(e.amount), 0)
    },
    categoryData() {
      const data = {}
      this.expenses.forEach(e => {
        data[e.category] = (data[e.category] || 0) + Number(e.amount)
      })
      return Object.entries(data).map(([category, value]) => ({ category, value }))
    },
    monthlyData() {
      const data = {}
      this.expenses.forEach(e => {
        const month = e.date ? e.date.slice(0, 7) : 'Sin fecha'
        data[month] = (data[month] || 0) + Number(e.amount)
      })
      return Object.entries(data).map(([month, value]) => ({ month, value }))
    },
    memberStats() {
      return this.members.map(m => {
        const paid = this.expenses.filter(e => e.paidBy === m.id).reduce((sum, e) => sum + Number(e.amount), 0)
        const spent = this.expenses
          .filter(e => Array.isArray(e.participants) && e.participants.includes(m.id))
          .reduce((sum, e) => sum + Number(e.amount) / e.participants.length, 0)
        return { id: m.id, name: m.name, paid, spent }
      }).sort((a, b) => b.paid - a.paid)
    },
    recentExpenses() {
      return [...this.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  }
}
</script>

<style scoped>
.statistics-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.statistics-page h1 {
  color: var(--primary-color);
  margin-bottom: 25px;
}
.statistics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.statistics-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 24px;
  text-align: center;
}
.statistics-card h3 {
  color: var(--text-color);
  margin-bottom: 10px;
}
.statistics-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}
.statistics-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}
.statistics-chart {
  background: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 20px;
}
.statistics-chart h4 {
  margin-bottom: 12px;
  color: var(--primary-dark);
}
.category-label, .month-label {
  font-weight: 500;
  color: var(--primary-dark);
}
.category-value, .month-value {
  float: right;
  font-weight: 600;
}
.statistics-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}
.statistics-table th, .statistics-table td {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}
.statistics-table th {
  background: var(--secondary-color);
  color: var(--primary-dark);
}
.statistics-ranking h2, .statistics-recent h2 {
  margin: 24px 0 12px 0;
  color: var(--primary-color);
}
.statistics-recent ul {
  list-style: none;
  padding: 0;
}
.statistics-recent li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
}
@media (max-width: 900px) {
  .statistics-charts {
    grid-template-columns: 1fr;
  }
}
</style>
