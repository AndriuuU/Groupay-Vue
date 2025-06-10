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

export default {
  // Crear un grupo
  async createGroup(groupData) {
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
  },

  // Obtener los grupos del usuario actual
  async getGroups() {
    const querySnapshot = await getDocs(collection(db, "groups"));
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((group) =>
        group.members?.some((m) => m.id === auth.currentUser?.uid)
      );
  },

  // Obtener un grupo por ID
  async getGroup(id) {
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
  },

  // Añadir miembro a un grupo
  async addMember(groupId, email) {
    // Buscar usuario por email en la colección users y añadir el objeto completo
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
    return member;
  },

  // Eliminar miembro de un grupo
  async removeGroupMember(groupId, memberId) {
    // Obtén el documento del grupo
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error("El grupo no existe");

    const groupData = groupSnap.data();
    // Filtra el miembro a eliminar
    const updatedMembers = (groupData.members || []).filter(
      (m) => m.id !== memberId
    );
    // Actualiza el grupo en Firestore
    await updateDoc(groupRef, { members: updatedMembers });
    return true;
  },

  // Obtener los gastos de un grupo
  async getGroupExpenses(groupId) {
    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("groupId", "==", groupId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Borrar grupo
  async deleteGroup(groupId) {
    await deleteDoc(doc(db, "groups", groupId));
  },

  // Borrar grupo y sus gastos
  async deleteGroupWithExpenses(groupId) {
    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("groupId", "==", groupId));
    const snapshot = await getDocs(q);
    const batchDeletes = snapshot.docs.map((expDoc) =>
      deleteDoc(doc(db, "expenses", expDoc.id))
    );
    await Promise.all(batchDeletes);
    await deleteDoc(doc(db, "groups", groupId));
  },

  // Actualizar grupo
  async updateGroup(groupId, groupData) {
    await updateDoc(doc(db, "groups", groupId), {
      name: groupData.name,
      description: groupData.description,
      category: groupData.category,
    });
    return { data: { ...groupData } };
  },
};
