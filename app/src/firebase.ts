import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * `true` cuando las variables mínimas de Firebase están presentes.
 * Permite que la app arranque en "modo demo" (UI navegable, sin backend)
 * mientras no se hayan provisto las credenciales.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Firebase] Faltan las variables VITE_FIREBASE_*. " +
      "Copia .env.example a .env y rellénalas. " +
      "La app funciona en modo demo (sin envío real de solicitudes ni login).",
  );
}

export { app, db, auth };
