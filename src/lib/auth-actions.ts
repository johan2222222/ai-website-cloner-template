import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { ref, set, get } from "firebase/database";

// Create user profile in DB
async function createUserProfile(uid: string, data: object) {
  await set(ref(db, `users/${uid}`), {
    ...data,
    createdAt: Date.now(),
    plan: "free",
  });
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await createUserProfile(cred.user.uid, { name, email });
  return cred;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  // Create profile if first time
  const snap = await get(ref(db, `users/${cred.user.uid}`));
  if (!snap.exists()) {
    await createUserProfile(cred.user.uid, {
      name: cred.user.displayName,
      email: cred.user.email,
    });
  }
  return cred;
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}
