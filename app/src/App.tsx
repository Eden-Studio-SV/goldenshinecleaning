import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { FullScreenLoader, Spinner } from "@/components/ui/Spinner";
import LandingPage from "@/features/landing/LandingPage";

// Cargas diferidas (lazy): mantienen Firebase, react-hook-form y zod fuera del
// bundle inicial de la landing. El panel además va en su propio chunk.
const FormularioSolicitud = lazy(() => import("@/features/agendamiento/FormularioSolicitud"));
const Confirmacion = lazy(() => import("@/features/agendamiento/Confirmacion"));
const AdminApp = lazy(() => import("@/features/admin/AdminApp"));

function RouteFallback({ children }: { children: ReactNode }) {
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

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/solicitar" element={<RouteFallback><FormularioSolicitud /></RouteFallback>} />
          <Route
            path="/solicitud-enviada"
            element={<RouteFallback><Confirmacion /></RouteFallback>}
          />
        </Route>

        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<FullScreenLoader />}>
              <AdminApp />
            </Suspense>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
