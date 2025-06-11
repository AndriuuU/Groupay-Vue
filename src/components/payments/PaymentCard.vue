<template>
  <div 
    class="payment-card"
    :class="statusClass"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="payment-card-header">
      <span>
        <strong>{{ fromName }}</strong>
        <span class="arrow">→</span>
        <strong>{{ toName }}</strong>
      </span>
      <span class="payment-amount">{{ formatCurrency(payment.amount) }}</span>
    </div>
    <div class="payment-card-body">
      <span class="payment-date">
        <i class="far fa-calendar-alt"></i> {{ formatDate(payment.date) }}
      </span>
      <span v-if="payment.comment" class="payment-comment">
        <i class="far fa-comment"></i> {{ payment.comment }}
      </span>

    </div>
    <div v-if="hover" class="payment-card-hover">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentCard',
  props: {
    payment: { type: Object, required: true },
    members: { type: Array, default: () => [] }
  },
  data() {
    return { hover: false }
  },
  computed: {
    fromName() {
      const m = this.members.find(u => u.id === this.payment.from);
      return m ? m.name : 'Desconocido';
    },
    toName() {
      const m = this.members.find(u => u.id === this.payment.to);
      return m ? m.name : 'Desconocido';
    },
    statusClass() {
      switch (this.payment.status) {
        case 'confirmed': return 'payment-confirmed';
        case 'rejected': return 'payment-rejected';
        default: return 'payment-pending';
      }
    },
    statusText() {
      switch (this.payment.status) {
        case 'confirmed': return 'Confirmado';
        case 'rejected': return 'Rechazado';
        default: return 'Pendiente';
      }
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
}
</script>

<style scoped>
.payment-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 18px 20px;
  margin-bottom: 18px;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  cursor: pointer;
  position: relative;
}
.payment-card:hover {
  transform: translateY(-3px) scale(1.02);
}
.payment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.08rem;
  margin-bottom: 6px;
}
.arrow {
  margin: 0 8px;
  color: var(--primary-dark);
  font-weight: bold;
}
.payment-amount {
  font-weight: 700;
  color: var(--primary-color);
}
.payment-card-body {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  align-items: center;
  font-size: 0.97rem;
  color: var(--text-light);
}
.payment-date, .payment-comment, .payment-status {
  display: flex;
  align-items: center;
  gap: 4px;
}
.payment-status {
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 10px;
  margin-left: 8px;
  text-transform: capitalize;
}

.payment-card-hover {
  position: absolute;
  top: 0; right: 0; left: 0; bottom: 0;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
</style>
