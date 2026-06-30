import { Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "./PortalLayout";
import MisLimpiezas from "./MisLimpiezas";
import DetalleCliente from "./DetalleCliente";

/** Portal del cliente (montado en /portal/*). Requiere sesión (ver AuthArea). */
export default function PortalApp() {
  return (
    <Routes>
      <Route element={<PortalLayout />}>
        <Route index element={<MisLimpiezas />} />
        <Route path="solicitud/:id" element={<DetalleCliente />} />
      </Route>
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}
