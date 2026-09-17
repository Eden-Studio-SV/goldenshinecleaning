import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO } from "../content";
import { useTranslation } from "@/i18n";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
      />

      <div className="container-app relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
            <ShieldCheck className="h-4 w-4" /> {t("hero.badge")}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {t(HERO.tituloKey)}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-white/70">{t(HERO.subtituloKey)}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/solicitar">
              <Button variant="gold" size="lg">
                {t(HERO.ctaPrimarioKey)} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#servicios">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                {t(HERO.ctaSecundarioKey)}
              </Button>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold" /> {t(HERO.areaKey)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gold" /> {t(HERO.scheduleKey)}
            </span>
          </div>
        </div>

        {/* Visual decorativo (placeholder — sustituir por foto real cuando exista) */}
        <div className="relative hidden lg:block">
          <div className="mx-auto aspect-[4/5] w-full max-w-sm rounded-3xl bg-gradient-to-br from-brand-500/40 via-navy-800 to-gold/20 p-1 shadow-2xl">
            <div className="grid h-full w-full place-items-center rounded-[1.4rem] bg-navy-800/40">
              <Sparkles className="h-28 w-28 text-gold/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}