import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { FullScreenLoader } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

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
  if (loading) return <FullScreenLoader />;
  if (!user) {
    return <Navigate to="/ingresar" state={{ from: { pathname: "/admin" } }} replace />;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-5 text-center">
        <div className="card max-w-sm p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-navy-800">Cuenta sin acceso al panel</h1>
          <p className="mt-2 text-sm text-gray-500">
            {user.email} no es administrador. Si eres cliente, entra a tu portal.
          </p>
          <div className="mt-6 grid gap-2">
            <a href="/portal" className="btn btn-primary btn-md w-full justify-center">
              Ir a mi portal
            </a>
            <Button variant="outline" className="w-full" onClick={logout}>
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
