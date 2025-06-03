// src/services/paymentService.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

const paymentsRef = collection(db, "payments");

export default {
  async createPayment(paymentData) {
    const docRef = await addDoc(paymentsRef, paymentData);
    return { id: docRef.id, ...paymentData };
  },
  async getGroupPayments(groupId) {
    const q = query(
      collection(db, "payments"),
      where("groupId", "==", groupId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async confirmPayment(paymentId) {
    const ref = doc(db, "payments", paymentId);
    await updateDoc(ref, { status: "confirmed" });
  },
  async rejectPayment(paymentId) {
    const ref = doc(db, "payments", paymentId);
    await updateDoc(ref, { status: "rejected" });
  },
};
