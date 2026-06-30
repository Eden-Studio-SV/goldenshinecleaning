import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { useAuth, isAdminEmail } from "@/lib/auth";
import { isFirebaseConfigured } from "@/firebase";
import { Spinner } from "@/components/ui/Spinner";
import { Brand } from "@/components/layout/Brand";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

export default function Login() {
  const { loginWithGoogle, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const destino = from || (isAdmin ? "/admin" : "/portal");

  // Ya hay sesión: a su destino.
  if (user) return <Navigate to={destino} replace />;

  const onGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const u = await loginWithGoogle();
      navigate(from || (isAdminEmail(u.email) ? "/admin" : "/portal"), { replace: true });
    } catch (e) {
      const err = e as { code?: string };
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        setError(null);
      } else if (err?.code === "auth/popup-blocked") {
        setError("El navegador bloqueó la ventana emergente. Permite pop-ups e intenta de nuevo.");
      } else if (err?.code === "auth/network-request-failed") {
        setError("Error de red. Verifica tu conexión.");
      } else {
        setError("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Brand onDark />
        </div>

        <div className="card mt-6 p-7">
          <h1 className="text-center text-xl font-bold text-navy-800">Ingresa a tu cuenta</h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Inicia sesión con Google para solicitar limpiezas y darles seguimiento.
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Firebase no está conectado todavía.</span>
            </div>
          )}

          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <>
                <Spinner className="h-5 w-5 text-brand-500" /> Conectando…
              </>
            ) : (
              <>
                <GoogleIcon /> Continuar con Google
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 text-center">
          <Link to="/" className="text-sm text-white/60 hover:text-white">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
