import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { FullScreenLoader } from "@/components/ui/Spinner";
import LandingPage from "@/features/landing/LandingPage";

// La landing va en el bundle inicial (sin Firebase). Todo lo autenticado
// —formulario, portal de clientes y panel— se carga bajo AuthArea de forma
// diferida, junto con firebase/auth y firestore.
const AuthArea = lazy(() => import("@/features/auth/AuthArea"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        <Route
          path="/*"
          element={
            <Suspense fallback={<FullScreenLoader />}>
              <AuthArea />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
