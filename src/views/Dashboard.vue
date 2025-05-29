<template>
  <div class="dashboard">
    <dashboard-skeleton v-if="isLoading" />
    <template v-else>
      <h1>Mi Dashboard</h1>
      <div class="dashboard-summary">
        <div class="summary-card">
          <h3>Mis Grupos</h3>
          <div class="summary-value">{{ groups?.length || 0 }}</div>
          <router-link to="/groups" class="summary-link">Ver todos</router-link>
        </div>
       <div class="summary-card">
          <h3>Balance Total</h3>
          <div class="summary-value" :class="{'positive': totalUserExpenses >= 0, 'negative': totalUserExpenses < 0}">
            {{ formatCurrency(totalUserExpenses) }}
          </div>
          
        </div>

        <div class="summary-card">
          <h3>Gastos Recientes</h3>
          <div class="summary-value">{{ recentExpenses?.length || 0 }}</div>
          <router-link to="/expenses" class="summary-link">Ver todos</router-link>
        </div>
      </div>

      <div class="dashboard-sections">
        <div class="recent-activity">
          <h2>Actividad Reciente</h2>
          <div v-if="activities.length === 0" class="empty-state">
            <p>No hay actividad reciente</p>
          </div>
          <div v-else class="activity-list">
            <div v-for="(activity, index) in activities" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-date">{{ formatDate(activity.date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-groups">
          <h2>Grupos Recientes</h2>
          <modal v-if="showCreateGroupModal" @close="showCreateGroupModal = false">
            <template #header>
              <h3>Crear Nuevo Grupo</h3>
            </template>
            <template #body>
              <group-form @submit="createGroup" @cancel="showCreateGroupModal = false" />
            </template>
          </modal>
          <div v-else>
            <div v-if="recentGroups && recentGroups.length > 0" class="groups-preview">
              <div v-for="group in recentGroups" :key="group.id" class="group-preview" @click="goToGroup(group.id)">
                <h3>{{ group.name }}</h3>
                <p>{{ group.description }}</p>
              </div>
              <router-link to="/groups" class="view-all-link">Ver todos los grupos</router-link>
            </div>
            <div v-else>
              <p>No tienes grupos recientes.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import groupService from '../services/groupService';
import DashboardSkeleton from '../components/common/DashboardSkeleton.vue';
import GroupForm from '../components/groups/GroupForm.vue';
import Modal from '../components/common/Modal.vue';

export default {
  name: 'Dashboard',
  components: {
    DashboardSkeleton,
    GroupForm,
    Modal
  },
  data() {
    return {
      groups: [],
      activities: [],
      recentExpenses: [],
      isLoading: false,
      showCreateGroupModal: false
    };
  },
  computed: {
    totalBalance() {
      return this.groups.reduce((total, group) => total + (group.balance ? parseFloat(group.balance) : 0), 0);
    },
    recentGroups() {
      return this.groups?.slice(0, 3) || [];
    }
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
   async fetchDashboardData() {
    this.isLoading = true;
    try {

      const userId = this.$store?.user?.uid || (await import('@/services/firebase')).auth.currentUser?.uid;
      const groupsResponse = await groupService.getGroups();
      this.groups = Array.isArray(groupsResponse) ? groupsResponse : [];

      let totalUserExpenses = 0;
      for (const group of this.groups) {
        const expenses = await groupService.getGroupExpenses(group.id);
        // Suma solo los gastos pagados por el usuario logueado
        totalUserExpenses += expenses
          .filter(exp => exp.paidBy === userId)
          .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
      }
      this.totalUserExpenses = totalUserExpenses;


      let allExpenses = [];
      for (const group of this.groups) {
        const expenses = await groupService.getGroupExpenses(group.id);
        allExpenses.push(...expenses.map(exp => ({
          ...exp,
          groupName: group.name
        })));
      }
      allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

      this.recentExpenses = allExpenses.slice(0, 3);
      this.activities = this.recentExpenses.map(exp => {
        const group = this.groups.find(g => g.id === exp.groupId);
        let paidByName = exp.paidBy;
        if (group && group.members) {
          const member = group.members.find(m => m.id === exp.paidBy);
          paidByName = member ? (member.name || member.email) : exp.paidBy;
        }
        return {
          type: 'expense',
          text: `${paidByName} añadió un gasto de ${this.formatCurrency(exp.amount)} en "${group ? group.name : ''}": ${exp.description}`,
          date: exp.date
        };
      });


    } catch (error) {
      console.error('Error al cargar datos del dashboard', error);
      this.groups = [];
      this.recentExpenses = [];
      this.activities = [];
    } finally {
      this.isLoading = false;
    }
  },
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    getActivityIcon(type) {
      const icons = {
        expense: 'fas fa-receipt',
        group: 'fas fa-users',
        payment: 'fas fa-money-bill-wave',
        invitation: 'fas fa-envelope'
      };
      return icons[type] || 'fas fa-info-circle';
    },
    goToGroup(groupId) {
      this.$router.push(`/groups/${groupId}`);
    },
    createGroup(groupData) {
      this.showCreateGroupModal = false;
      this.fetchDashboardData();
    }
  }
};
</script>

<style scoped>
@import '../assets/css/views/dashboard.css';
</style>
