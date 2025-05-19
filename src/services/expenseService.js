import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

export default {
  async createExpense(groupId, expenseData) {
    const expense = {
      ...expenseData,
      groupId,
      createdAt: new Date(),
      paidBy: auth.currentUser.uid
    };
    const docRef = await addDoc(collection(db, "expenses"), expense);
    return { id: docRef.id, ...expense };
  },

  async getGroupExpenses(groupId) {
    const q = query(collection(db, "expenses"), where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async deleteExpense(id) {
    await deleteDoc(doc(db, "expenses", id));
  }
};
