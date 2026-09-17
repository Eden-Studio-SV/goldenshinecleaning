import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, type Location } from "react-router-dom";
import { Info } from "lucide-react";
import { useAuth, isAdminEmail } from "@/lib/auth";
import { isFirebaseConfigured } from "@/firebase";
import { Spinner } from "@/components/ui/Spinner";
import { Brand } from "@/components/layout/Brand";
import { useTranslation } from "@/i18n";

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
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fromLoc = (location.state as { from?: Partial<Location> } | null)?.from;
  // Conserva path + search + hash para volver a la URL exacta tras login
  // (ej. /solicitar?servicio=airbnb#mapa).
  const from = fromLoc
    ? `${fromLoc.pathname ?? "/"}${fromLoc.search ?? ""}${fromLoc.hash ?? ""}`
    : "";
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
        setError(t("login.error.popupBlocked"));
      } else if (err?.code === "auth/network-request-failed") {
        setError(t("login.error.network"));
      } else {
        setError(t("login.error.generic"));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 px-5 py-12">
      <div className="w-full max-w-[420px] animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Brand />
        </div>

        <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border border-slate-100/50">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent rounded-[2.5rem] pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-center text-2xl font-extrabold text-slate-900">{t("login.title")}</h1>
            <p className="mt-3 text-center text-base text-slate-500">{t("login.subtitle")}</p>

            {!isFirebaseConfigured && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <span className="font-medium leading-relaxed">{t("login.firebaseNotConfigured")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onGoogle}
              disabled={busy}
              className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-base font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {busy ? (
                <>
                  <Spinner className="h-6 w-6 text-brand-500" /> {t("login.connecting")}
                </>
              ) : (
                <>
                  <GoogleIcon /> {t("login.continueGoogle")}
                </>
              )}
            </button>

            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-100 shadow-sm" role="alert">
                <p className="text-sm font-medium text-red-700 text-center">{error}</p>
              </div>
            )}

            <p className="mt-8 text-center text-sm font-medium text-slate-400 leading-relaxed">
              {t("login.noteQuote")}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
            &larr; {t("login.backToSite")}
          </Link>
        </div>
      </div>
    </div>
  );
}