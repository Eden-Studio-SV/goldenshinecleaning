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
import { upsertCliente } from "@/lib/clientes";

// Lista blanca de administradores. Debe mantenerse en sync con `firestore.rules`
// (la regla es la frontera de seguridad real; esto es para la UX).
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "info@edenstudio.dev")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

/** Rol de la sesión actual. `null` = sin sesión. */
export type Rol = "admin" | "cliente" | null;

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  rol: Rol;
  loading: boolean;
  loginWithGoogle: () => Promise<User>;
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

  const loginWithGoogle = async (): Promise<User> => {
    if (!auth) {
      throw new Error("Firebase no está configurado. Define las variables VITE_FIREBASE_* en .env.");
    }
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);

    // Los clientes mantienen su sesión y obtienen un perfil. Los admins se
    // distinguen por la lista blanca; no necesitan perfil de cliente.
    if (!isAdminEmail(cred.user.email)) {
      try {
        await upsertCliente({
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
        });
      } catch {
        // El perfil es best-effort; no bloquea el inicio de sesión.
      }
    }
    return cred.user;
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  const value = useMemo<AuthContextValue>(() => {
    const isAdmin = isAdminEmail(user?.email);
    const rol: Rol = !user ? null : isAdmin ? "admin" : "cliente";
    return { user, isAdmin, rol, loading, loginWithGoogle, logout };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
