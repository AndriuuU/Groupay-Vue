<template>
    <div class="group-detail-page">
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando grupo...</p>
      </div>
      
      <div v-else-if="!group" class="error-container">
        <p>El grupo no existe o no tienes acceso</p>
        <router-link to="/groups" class="btn btn-primary">Volver a mis grupos</router-link>
      </div>
      
      <div v-else class="group-container">
        <div class="group-header">
          <h1>{{ group.name }}</h1>
          <p class="group-description">{{ group.description }}</p>
          <div class="group-actions">
            <button class="btn btn-primary" @click="showAddExpenseModal = true">
              <i class="fas fa-plus"></i> Añadir Gasto
            </button>
            <button class="btn btn-secondary" @click="showAddMemberModal = true">
              <i class="fas fa-user-plus"></i> Añadir Miembro
            </button>
            <button class="btn btn-outline" @click="showGroupSettings = true">
              <i class="fas fa-cog"></i> Configuración
            </button>
          </div>
        </div>
        
        <div class="group-summary">
          <div class="summary-card">
            <h3>Balance Total</h3>
            <div class="balance" :class="{'positive': userBalance >= 0, 'negative': userBalance < 0}">
              <span v-if="userBalance > 0">Te deben: {{ formatCurrency(userBalance) }}</span>
              <span v-else-if="userBalance < 0">Debes: {{ formatCurrency(Math.abs(userBalance)) }}</span>
              <span v-else>Estás al día</span>
            </div>
          </div>
          <div class="summary-card">
            <h3>Gastos Totales</h3>
            <div class="total-expenses">{{ formatCurrency(totalExpenses) }}</div>
          </div>
          <div class="summary-card">
            <h3>Miembros</h3>
            <div class="members-count">{{ group.members.length }}</div>
          </div>
        </div>
        
        <div class="tabs">
          <button 
            class="tab-btn" 
            :class="{'active': activeTab === 'expenses'}" 
            @click="activeTab = 'expenses'"
          >
            Gastos
          </button>
          <button 
            class="tab-btn" 
            :class="{'active': activeTab === 'balances'}" 
            @click="activeTab = 'balances'"
          >
            Balances
          </button>
          <button 
            class="tab-btn" 
            :class="{'active': activeTab === 'members'}" 
            @click="activeTab = 'members'"
          >
            Miembros
          </button>
        </div>
        
        <div v-if="activeTab === 'expenses'" class="tab-content">
          <expense-list 
            :expenses="expenses" 
            :members="group.members"
            :isLoading="isLoadingExpenses"
            @edit-expense="editExpense"
            @delete-expense="deleteExpense"
          />
        </div>
        
        <div v-if="activeTab === 'balances'" class="tab-content">
          <balance-list 
            :balances="balances" 
            :settlements="settlements"
            :currentUserId="currentUserId"
            :isLoading="isLoadingBalances"
          />
        </div>
        
        <div v-if="activeTab === 'members'" class="tab-content">
          <div class="members-list">
            <h3>Miembros del Grupo</h3>
            <div v-for="member in group.members" :key="member.id" class="member-item">
              <div class="member-info">
                <span class="member-name">{{ member.name }}</span>
                <span v-if="member.id === group.createdBy" class="member-badge">Creador</span>
              </div>
              <button 
                v-if="canRemoveMember(member.id)" 
                class="btn-icon" 
                @click="removeMember(member.id)"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Modal para añadir gasto -->
        <modal v-if="showAddExpenseModal" @close="showAddExpenseModal = false">
          <template #header>
            <h3>Añadir Nuevo Gasto</h3>
          </template>
          <template #body>
            <expense-form 
              :groupId="group.id" 
              :members="group.members"
              @submit="addExpense" 
              @cancel="showAddExpenseModal = false" 
            />
          </template>
        </modal>
        
        <!-- Modal para editar gasto -->
        <modal v-if="showEditExpenseModal" @close="showEditExpenseModal = false">
          <template #header>
            <h3>Editar Gasto</h3>
          </template>
          <template #body>
            <expense-form 
              :expense="currentExpense" 
              :groupId="group.id" 
              :members="group.members"
              @submit="updateExpense" 
              @cancel="showEditExpenseModal = false" 
            />
          </template>
        </modal>
        
        <!-- Modal para añadir miembro -->
        <modal v-if="showAddMemberModal" @close="showAddMemberModal = false">
          <template #header>
            <h3>Añadir Miembro al Grupo</h3>
          </template>
          <template #body>
            <div class="add-member-form">
            <div class="form-group">
              <label for="member-email">Email del nuevo miembro</label>
              <input type="email" id="member-email" v-model="newMemberEmail" required>
            </div>
            <div class="form-actions">
              <button 
                class="btn btn-primary" 
                @click="addMember" 
                :disabled="isAddingMember"
              >
                {{ isAddingMember ? 'Añadiendo...' : 'Añadir Miembro' }}
              </button>
              <button class="btn btn-secondary" @click="showAddMemberModal = false">
                Cancelar
              </button>
            </div>
          </div>
        </template>
      </modal>
      
      <!-- Modal para configuración del grupo -->
      <modal v-if="showGroupSettings" @close="showGroupSettings = false">
        <template #header>
          <h3>Configuración del Grupo</h3>
        </template>
        <template #body>
          <group-form 
            :group="group" 
            @submit="updateGroup" 
            @cancel="showGroupSettings = false" 
          />
          <div class="danger-zone">
            <h4>Zona de Peligro</h4>
            <button class="btn btn-danger" @click="confirmDeleteGroup">
              Eliminar Grupo
            </button>
          </div>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import ExpenseList from '@/components/expenses/ExpenseList.vue';
import ExpenseForm from '@/components/expenses/ExpenseForm.vue';
import BalanceList from '@/components/balances/BalanceList.vue';
import GroupForm from '@/components/groups/GroupForm.vue';
import Modal from '@/components/common/Modal.vue';

export default {
  name: 'GroupDetail',
  components: {
    ExpenseList,
    ExpenseForm,
    BalanceList,
    GroupForm,
    Modal
  },
  data() {
    return {
      group: null,
      expenses: [],
      balances: [],
      settlements: [],
      activeTab: 'expenses',
      isLoading: true,
      isLoadingExpenses: false,
      isLoadingBalances: false,
      isAddingMember: false,
      showAddExpenseModal: false,
      showEditExpenseModal: false,
      showAddMemberModal: false,
      showGroupSettings: false,
      currentExpense: null,
      newMemberEmail: '',
      currentUserId: 1 // Esto debería venir de tu estado de autenticación
    };
  },
  computed: {
    totalExpenses() {
      return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    },
    userBalance() {
      const userBalance = this.balances.find(balance => balance.userId === this.currentUserId);
      return userBalance ? userBalance.amount : 0;
    }
  },
  created() {
    this.fetchGroupData();
  },
  methods: {
    async fetchGroupData() {
      const groupId = this.$route.params.id;
      this.isLoading = true;
      
      try {
        // Obtener datos del grupo
        const groupResponse = await groupService.getGroup(groupId);
        this.group = groupResponse.data;
        
        // Obtener gastos del grupo
        const expensesResponse = await expenseService.getGroupExpenses(groupId);
        this.expenses = expensesResponse.data;
        
        // Obtener balances del grupo
        const balancesResponse = await groupService.getGroupBalances(groupId);
        this.balances = balancesResponse.data.balances;
        this.settlements = balancesResponse.data.settlements;
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error al cargar datos del grupo', error);
        this.isLoading = false;
      }
    },
    async addExpense(expenseData) {
      try {
        // const response = await expenseService.createExpense(this.group.id, expenseData);
        
        // Simulación
        const newExpense = {
          id: this.expenses.length + 1,
          ...expenseData,
          createdAt: new Date().toISOString()
        };
        
        this.expenses.push(newExpense);
        this.showAddExpenseModal = false;
        
        // Actualizar balances
        this.fetchBalances();
      } catch (error) {
        console.error('Error al añadir gasto', error);
      }
    },
    editExpense(expense) {
      this.currentExpense = expense;
      this.showEditExpenseModal = true;
    },
    async updateExpense(expenseData) {
      try {
        // const response = await expenseService.updateExpense(expenseData.id, expenseData);
        
        // Simulación
        const index = this.expenses.findIndex(e => e.id === expenseData.id);
        if (index !== -1) {
          this.expenses[index] = { ...this.expenses[index], ...expenseData };
        }
        
        this.showEditExpenseModal = false;
        this.currentExpense = null;
        
        // Actualizar balances
        this.fetchBalances();
      } catch (error) {
        console.error('Error al actualizar gasto', error);
      }
    },
    async deleteExpense(expenseId) {
      try {
        // await expenseService.deleteExpense(expenseId);
        
        // Simulación
        this.expenses = this.expenses.filter(e => e.id !== expenseId);
        
        // Actualizar balances
        this.fetchBalances();
      } catch (error) {
        console.error('Error al eliminar gasto', error);
      }
    },
    async fetchBalances() {
      this.isLoadingBalances = true;
      try {
        // const response = await groupService.getGroupBalances(this.group.id);
        // this.balances = response.data.balances;
        // this.settlements = response.data.settlements;
        
        // Simulación: recalcular balances basados en los gastos
        // Esto es una simplificación, en la realidad necesitarías un algoritmo más complejo
        setTimeout(() => {
          this.isLoadingBalances = false;
        }, 500);
      } catch (error) {
        console.error('Error al cargar balances', error);
        this.isLoadingBalances = false;
      }
    },
    async addMember() {
      if (!this.newMemberEmail) return;
      
      this.isAddingMember = true;
      try {
        const response = await groupService.addGroupMember(this.group.id, { email: this.newMemberEmail });

        
        this.group.members.push(newMember);
        this.newMemberEmail = '';
        this.showAddMemberModal = false;
      } catch (error) {
        console.error('Error al añadir miembro', error);
      } finally {
        this.isAddingMember = false;
      }
    },
    canRemoveMember(memberId) {
      // No permitir eliminar al creador del grupo o a uno mismo
      return memberId !== this.group.createdBy && memberId !== this.currentUserId;
    },
    async removeMember(memberId) {
      if (!confirm('¿Estás seguro de que quieres eliminar a este miembro del grupo?')) return;
      
      try {
        await groupService.removeGroupMember(this.group.id, memberId);
        
      } catch (error) {
        console.error('Error al eliminar miembro', error);
      }
    },
    async updateGroup(groupData) {
      try {
        const response = await groupService.updateGroup(this.group.id, groupData);
       
        this.showGroupSettings = false;
      } catch (error) {
        console.error('Error al actualizar grupo', error);
      }
    },
    confirmDeleteGroup() {
      if (confirm('¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.')) {
        this.deleteGroup();
      }
    },
    async deleteGroup() {
      try {
        await groupService.deleteGroup(this.group.id);
        
        // Simulación
        this.$router.push('/groups');
      } catch (error) {
        console.error('Error al eliminar grupo', error);
      }
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

<style>
@import '../assets/css/views/group-detail.css';
</style>