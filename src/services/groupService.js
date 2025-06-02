import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
//import sendEmail from "../utils/sendEmail";

export default {
  async createGroup(groupData) {
    try {
      if (!groupData || !groupData.name || groupData.name.trim() === "") {
        throw new Error("El nombre del grupo es obligatorio");
      }
      const user = auth.currentUser;
      const member = {
        id: user.uid,
        name: user.displayName || user.email,
        email: user.email,
      };
      const docRef = await addDoc(collection(db, "groups"), {
        ...groupData,
        createdBy: user.uid,
        createdAt: new Date(),
        members: [member],
      });
      return { id: docRef.id, ...groupData, members: [member] };
    } catch (error) {

    }
  },

  async getGroups() {
    try {
      const querySnapshot = await getDocs(collection(db, "groups"));
      return querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((group) =>
          group.members?.some((m) => m.id === auth.currentUser?.uid)
        );
    } catch (error) {
      throw new Error("Error al obtener grupos: " + error.message);
    }
  },

  async getGroup(id) {
    try {
      const docRef = doc(db, "groups", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("El grupo no existe");
      }

      const groupData = docSnap.data();

      // Comprueba acceso por id de miembro
      if (!groupData.members?.some((m) => m.id === auth.currentUser?.uid)) {
        throw new Error("No tienes acceso a este grupo");
      }

      return {
        id: docSnap.id,
        ...groupData,
        createdAt: groupData.createdAt?.toDate(),
      };
    } catch (error) {
      throw new Error("Error al obtener grupo: " + error.message);
    }
  },

  async addMember(groupId, email) {
    // Debes buscar el usuario por email en la colección users y añadir el objeto completo
    try {
      // Buscar usuario
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) throw new Error("Usuario no encontrado");
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const member = {
        id: userDoc.id,
        name: userData.name || userData.email,
        email: userData.email,
      };
      // Añadir al grupo
      await updateDoc(doc(db, "groups", groupId), {
        members: arrayUnion(member),
      });
      // Enviar notificación por email
      await sendEmail({
        to: member.email,
        subject: "¡Te han añadido a un grupo en Groupay!",
        text: `Hola ${member.name}, has sido añadido al grupo "${group.name}".`,
      });
      return member;
    } catch (error) {
      throw new Error("Error al añadir miembro: " + error.message);
    }
  },

  async getGroupExpenses(groupId) {
    try {
      const expensesRef = collection(db, "expenses");
      const q = query(expensesRef, where("groupId", "==", groupId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error("Error al obtener gastos del grupo: " + error.message);
    }
  },
  async addMember(groupId, email) {
    try {
      // Buscar usuario por email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) throw new Error("Usuario no encontrado");
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const member = {
        id: userDoc.id,
        name: userData.name || userData.email,
        email: userData.email,
      };
      // Añadir al grupo
      await updateDoc(doc(db, "groups", groupId), {
        members: arrayUnion(member),
      });

      // Enviar notificación por email
      await sendEmail({
        to: member.email,
        subject: "¡Te han añadido a un grupo en Groupay!",
        text: `Hola ${member.name}, has sido añadido al grupo "${group.name}".`,
      });
      return member;
    } catch (error) {
      throw new Error("Error al añadir miembro: " + error.message);
    }
  },
  async deleteGroup(groupId) {
    try {
      await deleteDoc(doc(db, "groups", groupId));
    } catch (error) {
      throw new Error("Error al eliminar grupo: " + error.message);
    }
  },

  async deleteGroupWithExpenses(groupId) {
    // Borrar gastos
    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("groupId", "==", groupId));
    const snapshot = await getDocs(q);
    const batchDeletes = snapshot.docs.map((expDoc) =>
      deleteDoc(doc(db, "expenses", expDoc.id))
    );
    await Promise.all(batchDeletes);

    // Borrar grupo
    await deleteDoc(doc(db, "groups", groupId));
  },
  async updateGroup(groupId, groupData) {
    try {
      await updateDoc(doc(db, "groups", groupId), {
        name: groupData.name,
        description: groupData.description,
        category: groupData.category,
      });
      return { data: { ...groupData } };
    } catch (error) {
      throw new Error("Error al actualizar grupo: " + error.message);
    }
  },

  async fetchGroupData() {
    const groupId = this.$route.params.id;
    this.isLoading = true;
    try {
      this.group = await groupService.getGroup(groupId);
      this.expenses = (await expenseService.getGroupExpenses(groupId)) || [];
      // Mapea los campos para la UI
      this.expenses = this.expenses.map((expense) => ({
        ...expense,
        paid_by: this.group.members.find((m) => m.id === expense.paidBy) || {
          name: "Desconocido",
        },
        participants: (expense.participants || []).map(
          (pid) =>
            this.group.members.find((m) => m.id === pid) || {
              name: "Desconocido",
            }
        ),
      }));
      await this.fetchBalances();
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.error = "Error al cargar el grupo";
    }
  },
  async fetchBalances() {
    this.isLoadingBalances = true;
    try {
      const members = (this.group.members || []).map((m) => ({
        uid: m.id,
        name: m.name,
        email: m.email,
      }));
      const expenses = (this.expenses || []).map((e) => ({
        amount: Number(e.amount),
        paidBy: e.paid_by.id || e.paidBy,
        participants: Array.isArray(e.participants)
          ? e.participants.map((p) => p.id || p)
          : [],
      }));
      const calculator = new BalanceCalculator(members, expenses);
      this.balances = calculator.calculateBalances();
      this.settlements = calculator.calculateSettlements();
    } catch (error) {
      this.balances = [];
      this.settlements = [];
      console.error("Error al calcular balances", error);
    } finally {
      this.isLoadingBalances = false;
    }
  },
};
