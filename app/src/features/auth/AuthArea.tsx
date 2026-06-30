import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import PublicLayout from "@/components/layout/PublicLayout";
import { Spinner } from "@/components/ui/Spinner";
import Login from "./Login";
import { RequireAuth, RequireAdmin } from "./guards";

// Todo lo que necesita Firebase vive bajo este chunk perezoso, para no cargar
// firebase/auth ni firestore en el bundle inicial de la landing.
const FormularioSolicitud = lazy(() => import("@/features/agendamiento/FormularioSolicitud"));
const Confirmacion = lazy(() => import("@/features/agendamiento/Confirmacion"));
const PortalApp = lazy(() => import("@/features/portal/PortalApp"));
const AdminApp = lazy(() => import("@/features/admin/AdminApp"));

function Cargando({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner className="h-7 w-7 text-brand-500" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/** Área autenticada: un solo AuthProvider para portal, panel y formulario. */
export default function AuthArea() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="ingresar" element={<Login />} />

        <Route element={<PublicLayout />}>
          <Route
            path="solicitar"
            element={
              <RequireAuth>
                <Cargando>
                  <FormularioSolicitud />
                </Cargando>
              </RequireAuth>
            }
          />
          <Route
            path="solicitud-enviada"
            element={
              <RequireAuth>
                <Cargando>
                  <Confirmacion />
                </Cargando>
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="portal/*"
          element={
            <RequireAuth>
              <Cargando>
                <PortalApp />
              </Cargando>
            </RequireAuth>
          }
        />

        <Route
          path="admin/*"
          element={
            <RequireAdmin>
              <Cargando>
                <AdminApp />
              </Cargando>
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
