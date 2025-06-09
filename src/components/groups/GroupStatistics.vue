<template>
  <div class="group-statistics">
    <h2>Estadísticas del Grupo</h2>

    <div class="group-statistics-summary">
      <div class="group-statistics-card">
        <h3>Total Gastado</h3>
        <div class="group-statistics-value">{{ formatCurrency(totalSpent) }}</div>
      </div>
      <div class="group-statistics-card">
        <h3>Gasto Medio por Persona</h3>
        <div class="group-statistics-value">{{ formatCurrency(averagePerPerson) }}</div>
      </div>
      <div class="group-statistics-card">
        <h3>Número de Gastos</h3>
        <div class="group-statistics-value">{{ expenses.length }}</div>
      </div>
    </div>

    <div class="group-statistics-charts">
      <div class="group-statistics-chart">
        <h4>Gasto por Categoría</h4>
        <ul>
          <li v-for="cat in categoryData" :key="cat.category">
            <span class="category-label">{{ getCategoryName(cat.category) }}</span>
            <span class="category-value">{{ formatCurrency(cat.value) }}</span>
          </li>
        </ul>
      </div>
      <div class="group-statistics-chart">
        <h4>Evolución Mensual</h4>
        <ul>
          <li v-for="month in monthlyData" :key="month.month">
            <span class="month-label">{{ month.month }}</span>
            <span class="month-value">{{ formatCurrency(month.value) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="group-statistics-ranking">
      <h3>Ranking de Miembros</h3>
      <table class="group-statistics-table">
        <thead>
          <tr>
            <th>Miembro</th>
            <th>Total Pagado</th>
            <th>Total Gastado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in memberStats" :key="member.id">
            <td>
              {{ member.name }}
              <span class="member-email">{{ member.email }}</span>
            </td>
            <td>{{ formatCurrency(member.paid) }}</td>
            <td>{{ formatCurrency(member.spent) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="group-statistics-recent">
      <h3>Gastos Recientes</h3>
      <ul>
        <li v-for="expense in recentExpenses" :key="expense.id">
          {{ expense.description }} - {{ formatCurrency(expense.amount) }} ({{ getCategoryName(expense.category) }}) [{{ formatDate(expense.date) }}]
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import GroupPieChart from './GroupPieChart.vue'

export default {
    components: { GroupPieChart },
  name: 'GroupStatistics',
  props: {
    expenses: { type: Array, default: () => [] },
    members: { type: Array, default: () => [] }
  },
  computed: {
    totalSpent() {
      return this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    },
    averagePerPerson() {
      if (!this.members.length) return 0;
      return this.totalSpent / this.members.length;
    },
    categoryData() {
      const data = {};
      this.expenses.forEach(e => {
        data[e.category] = (data[e.category] || 0) + Number(e.amount);
      });
      return Object.entries(data).map(([category, value]) => ({ category, value }));
    },
    monthlyData() {
      const data = {};
      this.expenses.forEach(e => {
        const month = e.date ? e.date.slice(0, 7) : 'Sin fecha';
        data[month] = (data[month] || 0) + Number(e.amount);
      });
      return Object.entries(data).map(([month, value]) => ({ month, value }));
    },
    memberStats() {
      return this.members.map(m => {
        const paid = this.expenses.filter(e => e.paidBy === m.id).reduce((sum, e) => sum + Number(e.amount), 0);
        const spent = this.expenses
          .filter(e => Array.isArray(e.participants) && e.participants.includes(m.id))
          .reduce((sum, e) => sum + Number(e.amount) / e.participants.length, 0);
        return { id: m.id, name: m.name, email: m.email, paid, spent };
      }).sort((a, b) => b.paid - a.paid);
    },
    recentExpenses() {
      return [...this.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    getCategoryName(key) {
      const map = {
        food: 'Comida',
        transport: 'Transporte',
        accommodation: 'Alojamiento',
        entertainment: 'Entretenimiento',
        utilities: 'Servicios',
        other: 'Otro'
      };
      return map[key] || 'Otro';
    }
  }
};
</script>

<style scoped>
.group-statistics {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 24px;
  margin-bottom: 30px;
}
.group-statistics h2 {
  color: var(--primary-color);
  margin-bottom: 25px;
}
.group-statistics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 36px;
}
.group-statistics-card {
  background: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 20px;
  text-align: center;
}
.group-statistics-card h3 {
  color: var(--text-color);
  margin-bottom: 10px;
}
.group-statistics-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}
.group-statistics-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 36px;
}
.group-statistics-chart {
  background: var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 18px;
}
.group-statistics-chart h4 {
  margin-bottom: 10px;
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
.group-statistics-ranking {
  margin-bottom: 36px;
}
.group-statistics-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.group-statistics-table th, .group-statistics-table td {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
}
.group-statistics-table th {
  background: var(--secondary-color);
  color: var(--primary-dark);
}
.member-email {
  color: var(--text-light);
  font-size: 0.96em;
  margin-left: 8px;
  font-weight: 400;
  opacity: 0.75;
}
.group-statistics-recent ul {
  list-style: none;
  padding: 0;
}
.group-statistics-recent li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
}
@media (max-width: 900px) {
  .group-statistics-charts {
    grid-template-columns: 1fr;
  }
}
</style>
