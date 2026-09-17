import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, UserRound, X, Globe } from "lucide-react";
import { Brand } from "./Brand";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/features/landing/content";
import { useTranslation, type Locale, LOCALES } from "@/i18n";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t("nav.language")}
          className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                lang={l === "en" ? "en" : "es"}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition ${
                  l === locale
                    ? "bg-brand-50 font-semibold text-brand-600"
                    : "text-gray-700 hover:bg-brand-50"
                }`}
              >
                {LOCALE_LABELS[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
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
                {t(l.labelKey)}
              </a>
            ))}
          <Link
            to="/portal"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-brand-500"
          >
            <UserRound className="h-4 w-4" /> {t("nav.myAccount")}
          </Link>
          <LanguageSwitcher />
          <Link to="/solicitar">
            <Button variant="primary">{t("nav.requestCleaning")}</Button>
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-800 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-gray-100 bg-white md:hidden">
          <nav className="container-app flex flex-col gap-1 py-3">
            {isLanding &&
              NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-gray-700 hover:bg-brand-50"
                >
                  {t(l.labelKey)}
                </a>
              ))}
            <Link
              to="/portal"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-3 text-base font-medium text-gray-700 hover:bg-brand-50"
            >
              <UserRound className="h-5 w-5" /> {t("nav.myAccount")}
            </Link>
            <div className="flex items-center justify-between px-2 py-2">
              <LanguageSwitcher />
            </div>
            <Link to="/solicitar" onClick={() => setOpen(false)} className="mt-1">
              <Button variant="primary" size="lg" className="w-full">
                {t("nav.requestCleaning")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}