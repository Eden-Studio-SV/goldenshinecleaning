import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nombre = user?.displayName?.split(" ")[0] || "cliente";

  const onLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-50/40">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <Link to="/portal" className="flex items-center gap-3">
            <Brand />
            <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 sm:inline">
              Mi portal
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">Hola, {nombre}</span>
            <Link to="/solicitar" className="hidden sm:block">
              <Button variant="gold" size="sm">
                <Plus className="h-4 w-4" /> Solicitar
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container-app py-8">
        <Outlet />
      </main>
    </div>
  );
}
