<template>
    <div class="expense-form">
        <h3>Registrar Pago</h3>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="from">De</label>
                <select v-model="form.from" required>
                    <option v-for="member in members" :key="member.id" :value="member.id">
                        {{ member.name }} ({{ member.email }})
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="to">Para</label>
                <select v-model="form.to" required>
                    <option v-if="filteredMembers.length === 0" disabled value="">
                        No hay otros miembros en el grupo
                    </option>
                    <option v-else v-for="member in filteredMembers" :key="member.id" :value="member.id">
                        {{ member.name }} ({{ member.email }})
                    </option>
                </select>

            </div>

            <div class="form-group">
                <label for="amount">Cantidad (€)</label>
                <input type="number" id="amount" v-model="form.amount" min="0.01" step="0.01" required />
            </div>
            <div class="form-group">
                <label for="date">Fecha</label>
                <input type="date" id="date" v-model="form.date" required />
            </div>
            <div class="form-group">
                <label for="comment">Comentario</label>
                <input type="text" id="comment" v-model="form.comment" />
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    {{ isLoading ? 'Registrando...' : 'Registrar Pago' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import paymentService from '@/services/paymentService';

export default {
    name: 'PaymentForm',
    props: {
        groupId: { type: String, required: true },
        members: { type: Array, default: () => [] },
        currentUserId: { type: String, required: true }
    },
    computed: {
        filteredMembers() {
            return this.members.filter(m => m.id !== this.currentUserId);
        }
    },
    data() {
        return {
            form: {
                from: this.currentUserId, // Correcto para inicializar
                to: '',
                amount: '',
                date: new Date().toISOString().substr(0, 10),
                comment: ''
            },
            isLoading: false,
            error: null
        };
    },
    created() {
        // Selecciona por defecto el primer miembro distinto al usuario actual
        const firstOther = this.members.find(m => m.id !== this.currentUserId);
        if (firstOther) this.form.to = firstOther.id;
    },
    methods: {
        async submitForm() {
            if (!this.form.to || !this.form.amount) {
                this.error = 'Todos los campos obligatorios';
                return;
            }
            this.isLoading = true;
            this.error = null;
            try {
                await paymentService.createPayment({
                    groupId: this.groupId,
                    from: this.form.from,
                    to: this.form.to,
                    amount: parseFloat(this.form.amount),
                    date: this.form.date,
                    status: 'pending',
                    comment: this.form.comment
                });
                this.form = {
                    to: this.filteredMembers[0]?.id || '',
                    amount: '',
                    date: new Date().toISOString().substr(0, 10),
                    comment: ''
                };
                this.$emit('payment-created');
                this.$emit('cancel');
            } catch (e) {
                this.error = 'Error al registrar el pago';
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
@import '../../assets/css/expenses/expense-form.css';
</style>
