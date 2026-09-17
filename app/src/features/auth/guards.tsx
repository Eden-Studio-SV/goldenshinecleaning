import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { FullScreenLoader } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

/** Requiere sesión iniciada (cliente o admin). Si no, manda a /ingresar. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/ingresar" state={{ from: location }} replace />;
  return <>{children}</>;
}

/** Requiere sesión Y que la cuenta esté en la lista de administradores. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  if (loading) return <FullScreenLoader />;
  if (!user) {
    return <Navigate to="/ingresar" state={{ from: location }} replace />;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-5 text-center">
        <div className="card max-w-sm p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-navy-800">{t("guard.noAccess.title")}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t("guard.noAccess.desc", { email: user.email ?? "" })}
          </p>
          <div className="mt-6 grid gap-2">
            <a href="/portal" className="btn btn-primary btn-md w-full justify-center">
              {t("guard.noAccess.portal")}
            </a>
            <Button variant="outline" className="w-full" onClick={logout}>
              <LogOut className="h-4 w-4" /> {t("guard.noAccess.logout")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
