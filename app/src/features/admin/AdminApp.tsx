import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./useAuth";
import RutaPrivada from "./RutaPrivada";
import Login from "./Login";
import PanelLayout from "./PanelLayout";
import ListaSolicitudes from "./ListaSolicitudes";
import DetalleSolicitud from "./DetalleSolicitud";

/** Sub-aplicación del panel (montada en /admin/*, cargada de forma diferida). */
export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RutaPrivada />}>
          <Route element={<PanelLayout />}>
            <Route index element={<ListaSolicitudes />} />
            <Route path="solicitud/:id" element={<DetalleSolicitud />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
