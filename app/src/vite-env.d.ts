/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  // Correos de administradores autorizados (separados por coma).
  readonly VITE_ADMIN_EMAILS?: string;
  // Solo desarrollo: cuando es "true" conecta los emuladores locales de
   // Firebase locales. Nunca activar en producción.
   readonly VITE_USE_EMULATORS?: string;
   readonly VITE_FIRESTORE_EMULATOR_PORT?: string;
   readonly VITE_AUTH_EMULATOR_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
