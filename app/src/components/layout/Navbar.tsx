import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, UserRound, X } from "lucide-react";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/features/landing/content";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Brand />

        <nav className="hidden items-center gap-7 md:flex">
          {isLanding &&
            NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="text-sm font-medium text-gray-600 transition hover:text-brand-500"
              >
                {l.label}
              </a>
            ))}
          <Link
            to="/portal"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-brand-500"
          >
            <UserRound className="h-4 w-4" /> Mi cuenta
          </Link>
          <Link to="/solicitar">
            <Button variant="gold">Solicitar limpieza</Button>
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy-800 hover:bg-brand-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="container-app flex flex-col gap-1 py-3">
            {isLanding &&
              NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-gray-700 hover:bg-brand-50"
                >
                  {l.label}
                </a>
              ))}
            <Link
              to="/portal"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-3 text-base font-medium text-gray-700 hover:bg-brand-50"
            >
              <UserRound className="h-5 w-5" /> Mi cuenta
            </Link>
            <Link to="/solicitar" onClick={() => setOpen(false)} className="mt-1">
              <Button variant="gold" size="lg" className="w-full">
                Solicitar limpieza
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
