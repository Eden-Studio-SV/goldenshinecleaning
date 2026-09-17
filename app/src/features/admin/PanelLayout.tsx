import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

export default function PanelLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onLogout = async () => {
    await logout();
    navigate("/ingresar", { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-50/40">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Brand to="/admin" ariaLabel={t("admin.badge")} />
            <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 sm:inline">
              {t("admin.badge")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-sm text-gray-500 sm:inline">{user.email}</span>
            )}
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> {t("admin.logout")}
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
