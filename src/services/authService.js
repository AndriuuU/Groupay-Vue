import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default {
  async register({ name, email, password }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    // Guardar usuario en la colección users
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name,
      email
    });
    return userCredential.user;
  },

  async login({ email, password }) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async logout() {
    await signOut(auth);
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};
