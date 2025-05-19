import { db, auth } from './firebase';

import { 
  collection, addDoc, getDocs, doc, getDoc, 
  updateDoc, deleteDoc, arrayUnion, query, where 
} from "firebase/firestore";

export default {
 
  async createGroup(groupData) {
    try {
      // Crea el documento y obtén su referencia
      const docRef = await addDoc(collection(db, "groups"), {
        ...groupData,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        members: [auth.currentUser.uid]
      });
      
      return { id: docRef.id, ...groupData };
    } catch (error) {
      throw new Error("Error al crear grupo: " + error.message);
    }
  },

  async getGroups() {
    try {
      const querySnapshot = await getDocs(collection(db, 'groups'));
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(group => 
          group.members?.includes(auth.currentUser?.uid)
        );
    } catch (error) {
      throw new Error('Error al obtener grupos: ' + error.message);
    }
  },

  async getGroup(id) {
    try {
      const docRef = doc(db, 'groups', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('El grupo no existe');
      }
      
      const groupData = docSnap.data();
      
      if (!groupData.members?.includes(auth.currentUser?.uid)) {
        throw new Error('No tienes acceso a este grupo');
      }
      
      return { 
        id: docSnap.id, 
        ...groupData,
        createdAt: groupData.createdAt?.toDate() 
      };
    } catch (error) {
      throw new Error('Error al obtener grupo: ' + error.message);
    }
  },

  async addMember(groupId, email) {
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        members: arrayUnion(auth.currentUser.uid)
      });
    } catch (error) {
      throw new Error('Error al añadir miembro: ' + error.message);
    }
  },
  async getGroupExpenses(groupId) {
    try {
      const expensesRef = collection(db, "expenses");
      // Crear query con where
      const q = query(expensesRef, where("groupId", "==", groupId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error('Error al obtener gastos del grupo: ' + error.message);
    }
  }
};
