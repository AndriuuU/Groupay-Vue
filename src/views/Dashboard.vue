<template>
  <div class="dashboard">
    <dashboard-skeleton v-if="isLoading" />
    <template v-else>
    <h1>Mi Dashboard</h1>
    
    <div class="dashboard-summary">
      <div class="summary-card">
        <h3>Mis Grupos</h3>
        <div class="summary-value">{{ groups.length }}</div>
        <router-link to="/groups" class="summary-link">Ver todos</router-link>
      </div>
      <div class="summary-card">
        <h3>Balance Total</h3>
        <div class="summary-value" :class="{'positive': totalBalance >= 0, 'negative': totalBalance < 0}">
          {{ formatCurrency(totalBalance) }}
        </div>
      </div>
      <div class="summary-card">
        <h3>Gastos Recientes</h3>
        <div class="summary-value">{{ recentExpenses.length }}</div>
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
        <div v-if="groups.length === 0" class="empty-state">
          <p>No tienes grupos todavía</p>
          <router-link to="/groups/new" class="btn btn-primary">Crear Grupo</router-link>
        </div>
        <div v-else class="groups-preview">
          <div v-for="group in recentGroups" :key="group.id" class="group-preview" @click="goToGroup(group.id)">
            <h3>{{ group.name }}</h3>
            <p>{{ group.description }}</p>
          </div>
          <router-link to="/groups" class="view-all-link">Ver todos los grupos</router-link>
        </div>
      </div>
    </div>
  </template>
  </div>
</template>

<script>
import groupService from '../services/groupService';
import IconReceipt from '../assets/images/icons/receipt-text.svg';
import IconEnvelope from '../assets/images/icons/envelope-solid.svg';
import IconMoney from '../assets/images/icons/money-bill-wave-solid.svg';
import IconUser from '../assets/images/icons/user-solid.svg';
import DashboardSkeleton from '../components/common/DashboardSkeleton.vue';

export default {
  name: 'Dashboard',
  components: {
    DashboardSkeleton
  },
  data() {
    return {
      groups: [],
      activities: [],
      recentExpenses: [],
      isLoading: false
    };
  },
  computed: {
    totalBalance() {
      return this.groups.reduce((total, group) => total + group.balance, 0);
    },
    recentGroups() {
      return this.groups.slice(0, 3);
    }
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      this.isLoading = true;
      try {
        const groupsResponse = await groupService.getGroups();
        this.groups = groupsResponse.data;
        this.isLoading = false;
      } catch (error) {
        console.error('Error al cargar datos del dashboard', error);
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
        expense: IconReceipt,
        group: IconUser,
        payment: IconMoney,
        invitation: IconEnvelope
      };
      return icons[type] || 'fas fa-info-circle';
    },
    goToGroup(groupId) {
      this.$router.push(`/groups/${groupId}`);
    }
  }
}
</script>

<style scoped>
@import '../assets/css/views/dashboard.css';
</style>
