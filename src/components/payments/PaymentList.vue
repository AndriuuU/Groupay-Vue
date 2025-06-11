<template>
  <div>
    <h3>Pagos entre miembros</h3>
    <div v-if="payments.length === 0" class="empty-state">
      <i class="fas fa-money-check-alt empty-icon"></i>
      <p>No hay pagos registrados entre los miembros.</p>
    </div>
    <div v-else>
      <PaymentCard
        v-for="payment in payments"
        :key="payment.id"
        :payment="payment"
        :members="members"
      >
        <template #actions>
          <!-- Aquí puedes poner botones de confirmar/rechazar, detalles, etc -->
          <button v-if="payment.status === 'pending'" class="btn btn-primary" @click="confirm(payment.id)">
            Confirmar
          </button>
          <button v-if="payment.status === 'pending'" class="btn btn-danger" @click="reject(payment.id)">
            Rechazar
          </button>
        </template>
      </PaymentCard>
    </div>
  </div>
</template>

<script>
import PaymentCard from './PaymentCard.vue'
export default {
  components: { PaymentCard },
  props: {
    payments: { type: Array, default: () => [] },
    members: { type: Array, default: () => [] }
  },
  methods: {
    confirm(id) { this.$emit('confirm', id) },
    reject(id) { this.$emit('reject', id) }
  }
}
</script>
