import { Navigate, Outlet } from "react-router-dom";
import { LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "./useAuth";
import { FullScreenLoader } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

/** Protege el panel: requiere sesión Y que la cuenta sea administradora. */
export default function RutaPrivada() {
  const { user, isAdmin, loading, logout } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;

  // Sesión iniciada pero sin permiso (p. ej. removida de la lista de admins).
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-5 text-center">
        <div className="card max-w-sm p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-navy-800">Cuenta no autorizada</h1>
          <p className="mt-2 text-sm text-gray-500">
            {user.email} no tiene acceso al panel. Contacta al administrador.
          </p>
          <Button variant="outline" className="mt-6 w-full" onClick={logout}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
