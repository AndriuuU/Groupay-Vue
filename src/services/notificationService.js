import { db } from './firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'


export function initNotificationListeners(userId) {
  const $toast = useToast()

  // Notificación: Te han añadido a un grupo
  const groupsQuery = query(
    collection(db, 'groups'),
    where('members', 'array-contains', { id: userId })
  )
  onSnapshot(groupsQuery, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const group = change.doc.data()
        $toast.info(`¡Has sido añadido al grupo "${group.name}"!`)
      }
    })
  })

  // Notificación: Nuevo gasto en tus grupos
  const expensesQuery = query(
    collection(db, 'expenses'),
    where('participants', 'array-contains', userId)
  )
  onSnapshot(expensesQuery, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const expense = change.doc.data()
        $toast.info(`Nuevo gasto en el grupo: ${expense.description} (${expense.amount} €)`)
      }
    })
  })

  // Notificación: Nuevo pago en tus grupos
  const paymentsQuery = query(
    collection(db, 'payments'),
    where('to', '==', userId)
  )
  onSnapshot(paymentsQuery, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const payment = change.doc.data()
        $toast.success(`¡Has recibido un nuevo pago de ${payment.amount} €!`)
      }
    })
  })
}
