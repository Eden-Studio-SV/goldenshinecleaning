import { Navigate, Route, Routes } from "react-router-dom";
import PanelLayout from "./PanelLayout";
import ListaSolicitudes from "./ListaSolicitudes";
import DetalleSolicitud from "./DetalleSolicitud";

/**
 * Panel administrativo (montado en /admin/*). El acceso de administrador lo
 * controla <RequireAdmin> en AuthArea; aquí solo viven las vistas.
 */
export default function AdminApp() {
  return (
    <Routes>
      <Route element={<PanelLayout />}>
        <Route index element={<ListaSolicitudes />} />
        <Route path="solicitud/:id" element={<DetalleSolicitud />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
