<template>
    <div class="balance-list">
      <h3>Balances del Grupo</h3>
      
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Calculando balances...</p>
      </div>
      
      <div v-else-if="balances.length === 0" class="empty-state">
        <i class="fas fa-balance-scale empty-icon"></i>
        <h3>No hay balances que mostrar</h3>
        <p>Añade gastos para ver los balances entre los miembros</p>
      </div>
      
      <div v-else>
        <div class="balance-summary">
          <div class="balance-card" :class="userBalanceClass">
            <h4>Tu Balance</h4>
            <div class="balance-amount">
              <span v-if="userBalance > 0">Te deben: {{ formatCurrency(userBalance) }}</span>
              <span v-else-if="userBalance < 0">Debes: {{ formatCurrency(Math.abs(userBalance)) }}</span>
              <span v-else>Estás al día</span>
            </div>
          </div>
        </div>
        
        <div class="balance-items">
          <div v-for="balance in balances" :key="balance.userId" class="balance-item">
            <div class="balance-user">
              <span class="user-name">{{ balance.userName }}</span>
            </div>
            <div class="balance-details" :class="getBalanceClass(balance.amount)">
              <span v-if="balance.amount > 0">Te debe: {{ formatCurrency(balance.amount) }}</span>
              <span v-else-if="balance.amount < 0">Debes: {{ formatCurrency(Math.abs(balance.amount)) }}</span>
              <span v-else>Al día</span>
            </div>
          </div>
        </div>
        
        <div class="settlement-suggestions">
          <h4>Sugerencias de Pago</h4>
          <div v-if="settlements.length === 0" class="empty-settlements">
            <p>No hay pagos pendientes entre los miembros</p>
          </div>
          <div v-else class="settlement-items">
            <div v-for="(settlement, index) in settlements" :key="index" class="settlement-item">
              <span class="settlement-text">
                <strong>{{ settlement.from }}</strong> debe pagar 
                <strong>{{ formatCurrency(settlement.amount) }}</strong> a 
                <strong>{{ settlement.to }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BalanceList',
    props: {
      balances: {
        type: Array,
        default: () => []
      },
      settlements: {
        type: Array,
        default: () => []
      },
      currentUserId: {
        type: [Number, String],
        required: true
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      userBalance() {
        const userBalance = this.balances.find(balance => balance.userId === this.currentUserId);
        return userBalance ? userBalance.amount : 0;
      },
      userBalanceClass() {
        return {
          'positive': this.userBalance > 0,
          'negative': this.userBalance < 0,
          'neutral': this.userBalance === 0
        };
      }
    },
    methods: {
      formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR'
        }).format(amount);
      },
      getBalanceClass(amount) {
        return {
          'positive': amount > 0,
          'negative': amount < 0,
          'neutral': amount === 0
        };
      }
    }
  };
  </script>
  
  <style scoped>
  @import '../../assets/css/balances/balance-list.css';
  </style>
