import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBD79zecSu8VwTE4e3nYmtPRLdX53S9iSk",
  authDomain: "conarte-landing.firebaseapp.com",
  projectId: "conarte-landing",
  storageBucket: "conarte-landing.firebasestorage.app",
  messagingSenderId: "880845571300",
  appId: "1:880845571300:web:1215b204057bafe42cd8f1",
  measurementId: "G-KHZPRHGLYR"
};

// Initialize Firebase solo si no está ya inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics solo en el cliente y si está soportado
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export { app };
