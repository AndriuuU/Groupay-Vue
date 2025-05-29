<template>
  <div class="expense-list">
    <div class="expense-list-header">
      <h3>Mis Gastos Recientes</h3>
    </div>
    <expense-list
      :expenses="userExpenses"
      :members="userMembers"
      :isLoading="isLoading"
    />
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
  </div>
</template>

<script>
import ExpenseList from '@/components/expenses/ExpenseList.vue'
import expenseService from '@/services/expenseService'
import groupService from '@/services/groupService'
import { auth } from '@/services/firebase'

export default {
  name: 'ExpensesList',
  components: { ExpenseList },
  data() {
    return {
      userExpenses: [],
      userMembers: [],
      isLoading: false,
      error: null
    }
  },
  async created() {
    this.isLoading = true
    try {
      const userId = auth.currentUser?.uid
      if (!userId) throw new Error('No hay usuario autenticado')
      // Obtener todos los grupos del usuario
      const groups = await groupService.getGroups()
      let allExpenses = []
      let allMembers = []
      for (const group of groups) {
        if (group.members) {
          allMembers.push(...group.members)
        }
        const groupExpenses = await expenseService.getGroupExpenses(group.id)
        for (const exp of groupExpenses) {
          // Solo añadir si el usuario es pagador o participante
          if (
            exp.paidBy === userId ||
            (Array.isArray(exp.participants) && exp.participants.includes(userId))
          ) {
            // Mapear paid_by y participants a objetos
            const paidByObj = group.members.find(m => m.id === exp.paidBy) || { name: 'Sin nombre', email: '', id: exp.paidBy }
            const participantsObj = Array.isArray(exp.participants)
              ? exp.participants.map(pid => group.members.find(m => m.id === pid)).filter(Boolean)
              : []
            allExpenses.push({
              ...exp,
              paid_by: paidByObj,
              participants: participantsObj
            })
          }
        }
      }
      this.userExpenses = allExpenses
      this.userMembers = allMembers
    } catch (error) {
      this.error = 'No se pudieron cargar tus gastos.'
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
@import '../assets/css/expenses/expense-list.css';
@import '../assets/css/expenses/expense-item.css';
</style>
