import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { FullScreenLoader } from "@/components/ui/Spinner";

/** Protege las rutas del panel: redirige a /admin/login si no hay sesión. */
export default function RutaPrivada() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />;

  return <Outlet />;
}
