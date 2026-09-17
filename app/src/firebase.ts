import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

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

/**
 * `true` solo en desarrollo y cuando se activa explícitamente con
 * `VITE_USE_EMULATORS=true`. Los puertos se pueden configurar solo para dev.
 * No bypassa auth ni reglas: los emuladores aplican las mismas reglas de
 * Firestore y exigen sesión real (emulada). En producción nunca se conecta.
 */
export const useEmulators =
  import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  if (useEmulators) {
    const firestorePort = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || "8081");
    const authPort = Number(import.meta.env.VITE_AUTH_EMULATOR_PORT || "9100");
    // Las conexiones a emulador son idempotentes en Firebase 11: si ya están
    // conectadas, no se reconectan. Puertos estándar del emulador.
    connectFirestoreEmulator(db, "127.0.0.1", firestorePort);
    connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`, { disableWarnings: true });
    // eslint-disable-next-line no-console
    console.info(
       `[Firebase] Emuladores conectados: Firestore 127.0.0.1:${firestorePort}, Auth 127.0.0.1:${authPort}. ` +
        "Las reglas de Firestore siguen aplicando.",
    );
  }
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Firebase] Faltan las variables VITE_FIREBASE_*. " +
      "Copia .env.example a .env y rellénalas. " +
      "La app funciona en modo demo (sin envío real de solicitudes ni login).",
  );
}

export { app, db, auth };
