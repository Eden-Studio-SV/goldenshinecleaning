import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SEO } from "@/components/SEO";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
