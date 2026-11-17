import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  updateProfile as fbUpdateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';

const FIREBASE_CONFIG_KEY = 'habit_tracker_firebase_config_v1';

export function getSavedFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading saved firebase config:', e);
  }

  // Fallback to Vite env variables if set
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }

  return null;
}

export function saveFirebaseConfig(config) {
  try {
    if (!config) {
      localStorage.removeItem(FIREBASE_CONFIG_KEY);
    } else {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    }
  } catch (e) {
    console.error('Error saving firebase config:', e);
  }
}

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

export function initFirebaseService() {
  const config = getSavedFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { isReady: false, auth: null, db: null };
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
    return { isReady: true, auth: firebaseAuth, db: firebaseDb };
  } catch (err) {
    console.error('Failed to initialize Firebase app:', err);
    return { isReady: false, auth: null, db: null, error: err.message };
  }
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  fbUpdateProfile,
  onAuthStateChanged,
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
};
