// src/services/expenseService.js
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export default {
  async getGroupExpenses(groupId) {
    const q = query(collection(db, "expenses"), where("groupId", "==", groupId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async createExpense(groupId, expenseData) {
    const docRef = await addDoc(collection(db, "expenses"), { ...expenseData, groupId });
    return { id: docRef.id, ...expenseData, groupId };
  },
  async updateExpense(id, expenseData) {
    const ref = doc(db, "expenses", id);
    await updateDoc(ref, expenseData);
  },
  async deleteExpense(id) {
    await deleteDoc(doc(db, "expenses", id));
  }
};
