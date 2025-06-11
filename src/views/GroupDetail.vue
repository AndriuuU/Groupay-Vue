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
          <div class="balance" :class="{ 'positive': userBalance >= 0, 'negative': userBalance < 0 }">
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
        <button class="tab-btn" :class="{ 'active': activeTab === 'expenses' }" @click="activeTab = 'expenses'">
          Gastos
        </button>
        <button class="tab-btn" :class="{ 'active': activeTab === 'balances' }" @click="activeTab = 'balances'">
          Balances
        </button>
        <button class="tab-btn" :class="{ 'active': activeTab === 'payments' }" @click="activeTab = 'payments'">
          Pagos
        </button>
        <button class="tab-btn" :class="{ 'active': activeTab === 'members' }" @click="activeTab = 'members'">
          Miembros
        </button>
      </div>
      <!-- Añadir una nueva pestaña -->


      <!-- Contenido de la pestaña -->
      <div v-if="activeTab === 'payments'" class="tab-content">


        <div class="expense-list">
          <div class="expense-list-header">
            <h3>Pagos entre miembros</h3>

            <button class="btn btn-primary" @click="showAddPaymentModal = true">
              <i class="fas fa-money-bill-wave"></i> Registrar Pago
            </button>
          </div>

          <div class="group-section">
  <div v-if="isLoadingPayments" class="loading-container">
    <div class="spinner"></div>
    <p>Cargando pagos...</p>
  </div>
<div v-else-if="payments.length === 0" class="empty-state">
            <i class="fas fa-money-bill-wave empty-icon"></i>
            <h3>No hay pagos registrados</h3>
            <p>Cuando un miembro pague a otro, aparecerá aquí.</p>
          </div>
  <div v-else>
    <PaymentCard
      v-for="payment in payments"
      :key="payment.id"
      :payment="payment"
      :members="group.members"
      @confirm="confirmPayment"
      @reject="rejectPayment"
    />
  </div>

</div>

         

          </div>
      </div>



      <div v-if="activeTab === 'expenses'" class="tab-content">
        <expense-list :expenses="expenses" :members="group.members" :groupId="group.id" :isLoading="isLoadingExpenses"
          @edit-expense="editExpense" @delete-expense="deleteExpense" />
      </div>

      <div v-if="activeTab === 'balances'" class="tab-content">

        <balance-list :balances="balances" :settlements="settlements" :currentUserId="currentUserId"
          :isLoading="isLoadingBalances" />


        <GroupStatistics :expenses="expenses" :members="group.members" />
      </div>


      <div v-if="activeTab === 'members'" class="tab-content">
        <div class="members-list">
          <h3>Miembros del Grupo</h3>
          <div v-for="member in group.members" :key="member.id" class="member-item">
            <div class="member-info">
              <img v-if="member.avatar" :src="member.avatar" alt="Avatar de miembro" class="member-avatar">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-email">{{ member.email }}</span>
              <span v-if="member.id === group.createdBy" class="member-badge">Creador</span>
            </div>
            <div class="member-actions">
              <button v-if="canRemoveMember(member.id)" class="btn-icon btn-danger" @click="removeMember(member.id)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <modal v-if="showAddExpenseModal" @close="showAddExpenseModal = false">
        <template #header>
          <h3>Añadir Nuevo Gasto</h3>
        </template>
        <template #body>
          <expense-form :groupId="group.id" :members="group.members" @expense-created="addExpense"
            @cancel="showAddExpenseModal = false" />
        </template>
      </modal>



      <modal v-if="showEditExpenseModal" @close="showEditExpenseModal = false">
        <template #header>
          <h3>Editar Gasto</h3>
        </template>
        <template #body>
          <expense-form :expense="currentExpense" :groupId="group.id" :members="group.members"
            @expense-updated="updateExpense" @cancel="showEditExpenseModal = false" />
        </template>
      </modal>



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
              <button class="btn btn-primary" @click="addMember" :disabled="isAddingMember">
                {{ isAddingMember ? 'Añadiendo...' : 'Añadir Miembro' }}
              </button>
              <button class="btn btn-secondary" @click="showAddMemberModal = false">
                Cancelar
              </button>
            </div>
          </div>
        </template>
      </modal>

      <modal v-if="showGroupSettings" @close="showGroupSettings = false">
        <template #header>
          <h3>Configuración del Grupo</h3>
        </template>
        <template #body>
          <group-form :group="group" @submit="updateGroup" @cancel="showGroupSettings = false" />
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
import groupService from '@/services/groupService';
import expenseService from '@/services/expenseService';
import { BalanceCalculator } from '../utils/BalanceCalculator';
import PaymentForm from '@/components/payments/PaymentForm.vue';
import paymentService from '@/services/paymentService';
import { useAuthStore } from '@/store/authStore';
import GroupStatistics from '@/components/groups/GroupStatistics.vue';
import PaymentCard from '@/components/payments/PaymentCard.vue'

export default {
  name: 'GroupDetail',
  components: {
    PaymentCard,
    ExpenseList,
    ExpenseForm,
    BalanceList,
    GroupForm,
    Modal,
    PaymentForm,
    GroupStatistics
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
      showAddPaymentModal: false,
      showAddExpenseModal: false,
      showEditExpenseModal: false,
      showAddMemberModal: false,
      showGroupSettings: false,
      currentExpense: null,
      newMemberEmail: '',
      payments: [],
      isLoadingPayments: false,
      
    };
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'payments') {
        this.fetchPayments();
      }
    }
  },
  computed: {
    pagosFiltrados() {
      // Solo pagos con cantidad mayor que 0
      return this.payments.filter(p => p.amount > 0);
    },
    currentUserId() {
      const authStore = useAuthStore();
      return authStore.usuarioLogueado ? authStore.usuarioLogueado.id : null;
    },
    totalExpenses() {
      return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    },
    userBalance() {
      if (!this.balances || this.balances.length === 0) return 0;
      const userBalance = this.balances.find(balance => balance.userId === this.currentUserId);
      return userBalance ? userBalance.amount : 0;
    }
  },
  created() {
    this.fetchGroupData();
    

  },
  methods: {
    async fetchPayments() {
      this.isLoadingPayments = true;
                this.payments = await paymentService.getGroupPayments(this.group.id)

      try {
        // Añade este log para depurar
        console.log('Buscando pagos para groupId:', this.group.id);
        this.payments = await paymentService.getGroupPayments(this.group.id);
        console.log('Pagos encontrados:', this.payments);
      } catch (e) {
        this.payments = [];
      } finally {
        this.isLoadingPayments = false;
      }
    },
    getMemberName(userId) {
      const member = this.group.members.find(m => m.id === userId);
      return member ? member.name : 'Desconocido';
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    statusClass(status) {
      return {
        'positive': status === 'confirmed',
        'neutral': status === 'pending',
        'negative': status === 'rejected'
      };
    },
    canConfirm(payment) {
      // Solo el destinatario puede confirmar/rechazar si el pago está pendiente
      return payment.status === 'pending' && payment.to === this.currentUserId;
    },
    async confirmPayment(payment) {
      await paymentService.confirmPayment(payment.id);
      // Aquí deberías crear el gasto settlement (ver instrucciones anteriores)
      await expenseService.createExpense(payment.groupId, {
        description: 'Pago entre miembros',
        amount: payment.amount,
        date: payment.date,
        category: 'settlement',
        paidBy: payment.from,
        participants: [payment.from, payment.to]
      });
      this.fetchPayments();
      this.fetchExpenses(); // Para refrescar balances y gastos
    },
    async rejectPayment(payment) {
      await paymentService.rejectPayment(payment.id);
      this.fetchPayments();
    },
    async fetchGroupData() {
      const groupId = this.$route.params.id;
      this.isLoading = true;
      try {
        this.group = await groupService.getGroup(groupId);

        const expensesRaw = await expenseService.getGroupExpenses(groupId);
        this.expenses = expensesRaw.map(expense => ({
          ...expense,
          paid_by: this.group.members.find(m => m.id === expense.paidBy) || { name: 'Desconocido' },
          participants: (expense.participants || []).map(pid =>
            this.group.members.find(m => m.id === pid) || { name: 'Desconocido' }
          )
        }));

        await this.fetchBalances();

        if (this.activeTab === 'payments') {
          this.fetchPayments();
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.error = 'Error al cargar el grupo';
      }
    },

    async fetchExpenses() {
      this.isLoadingExpenses = true;
      this.error = null;

      try {
        const response = await expenseService.getGroupExpenses(this.group.id);
        this.expenses = response.data;
      } catch (error) {
        console.error('Error al cargar los gastos:', error);
        this.error = 'No se pudieron cargar los gastos.';
      } finally {
        this.isLoadingExpenses = false;
      }
    },
    async addExpense(expenseData) {
      try {
        await expenseService.createExpense(this.group.id, expenseData);
        await this.fetchGroupData(); // Recarga datos y recalcula balances
        this.showAddExpenseModal = false;
      } catch (error) {
        this.error = 'Error al añadir gasto.';
      }
    },

    editExpense(expense) {
      this.currentExpense = expense;
      this.showEditExpenseModal = true;
    },
    async updateExpense(expenseData) {
      try {
        if (!this.currentExpense || !this.currentExpense.id) {
          console.error('ID del gasto no definido.');
          return;
        }
        const response = await expenseService.updateExpense(this.currentExpense.id, expenseData);
        const index = this.expenses.findIndex(e => e.id === this.currentExpense.id);
        if (index !== -1) {
          this.expenses[index] = response.data;
        }
        this.showEditExpenseModal = false;
        this.currentExpense = null;
        this.fetchBalances();
      } catch (error) {
        console.error('Error al actualizar gasto', error);
      }
    },
    async deleteExpense(expenseId) {
      try {
        await expenseService.deleteExpense(expenseId);
        this.expenses = this.expenses.filter(e => e.id !== expenseId);
        this.fetchBalances();
      } catch (error) {
        console.error('Error al eliminar gasto', error);
      }
    },

    async fetchBalances() {
      this.isLoadingBalances = true;
      try {
        const members = this.group.members.map(m => ({
          uid: m.id || m.uid,
          name: m.name,
          email: m.email
        }));
        const expenses = this.expenses.map(e => ({
          amount: e.amount,
          paidBy: e.paid_by.id || e.paidBy,
          participants: e.participants.map(p => p.id || p.uid)
        }));
        const calculator = new BalanceCalculator(members, expenses);
        this.balances = calculator.calculateBalances().map(b => ({
          userId: b.uid,
          userName: b.name,
          amount: b.balance
        }));
        this.settlements = calculator.calculateSettlements().map(s => ({
          from: s.fromName,
          to: s.toName,
          amount: s.amount
        }));
      } catch (error) {
        console.error('Error al calcular balances', error);
      } finally {
        this.isLoadingBalances = false;
      }
    },

    calculateSettlements(balances) {
      const users = balances.map(balance => ({ id: balance.userId, name: balance.userName, amount: balance.amount }));
      const debtors = users.filter(user => user.amount < 0);
      const creditors = users.filter(user => user.amount > 0);

      const settlements = [];

      debtors.forEach(debtor => {
        while (debtor.amount < 0) {
          const creditor = creditors.find(c => c.amount > 0);
          if (!creditor) break;

          const amountToPay = Math.min(Math.abs(debtor.amount), creditor.amount);
          settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: amountToPay
          });

          creditor.amount -= amountToPay;
          debtor.amount += amountToPay;

          if (creditor.amount === 0) {
            creditors.splice(creditors.indexOf(creditor), 1);
          }
        }
      });

      return settlements;
    },

    async addMember() {
      if (!this.newMemberEmail) return;
      this.isAddingMember = true;
      try {
        const member = await groupService.addMember(this.group.id, this.newMemberEmail);
        this.group.members.push(member);
        this.newMemberEmail = '';
        this.showAddMemberModal = false;
      } catch (error) {
        if (error.message.includes('Usuario no encontrado')) {
          this.error = 'El usuario no existe. Debe registrarse primero en Groupay.';
        } else {
          this.error = error.message || 'Error al añadir miembro';
        }
      }
    },

    canRemoveMember(memberId) {
      return memberId !== this.group.createdBy && memberId !== this.currentUserId;
    },
    async removeMember(memberId) {
      if (!confirm('¿Estás seguro de que quieres eliminar a este miembro del grupo?')) return;

      try {
        await groupService.removeGroupMember(this.group.id, memberId);
        this.group.members = this.group.members.filter(member => member.id !== memberId);
      } catch (error) {
        console.error('Error al eliminar miembro', error);
      }
    },
    async updateGroup(groupData) {
      try {
        const response = await groupService.updateGroup(this.group.id, groupData);
        this.group = { ...this.group, ...response.data };
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

<style scoped>
@import '../assets/css/views/group-detail.css';
@import '../assets/css/expenses/expense-list.css';
</style>
