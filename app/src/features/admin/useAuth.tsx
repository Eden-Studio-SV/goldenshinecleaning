import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase";

// Lista blanca de administradores. Debe mantenerse en sync con `firestore.rules`
// (la regla es la frontera de seguridad real; esto es para la UX del panel).
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "info@edenstudio.dev")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase no está configurado. Define las variables VITE_FIREBASE_* en .env.");
    }
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);

    // Solo cuentas autorizadas pueden quedar con sesión iniciada.
    if (!isAdminEmail(cred.user.email)) {
      await signOut(auth);
      const err = new Error("Tu cuenta no está autorizada para el panel.");
      err.name = "NotAuthorized";
      throw err;
    }
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAdmin: isAdminEmail(user?.email), loading, loginWithGoogle, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
