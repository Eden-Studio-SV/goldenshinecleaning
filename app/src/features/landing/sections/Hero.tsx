import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO } from "../content";

export function Hero() {
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
            <ShieldCheck className="h-4 w-4" /> Servicio asegurado y garantizado
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {HERO.titulo}
          </h1>

          <p className="mt-5 max-w-xl text-lg text-white/70">{HERO.subtitulo}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/solicitar">
              <Button variant="gold" size="lg">
                {HERO.ctaPrimario} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#servicios">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                {HERO.ctaSecundario}
              </Button>
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {HERO.stats.map((s) => (
              <div key={s.etiqueta}>
                <dt className="text-2xl font-extrabold text-gold">{s.valor}</dt>
                <dd className="mt-1 text-xs text-white/60">{s.etiqueta}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual decorativo (placeholder — sustituir por foto real cuando exista) */}
        <div className="relative hidden lg:block">
          <div className="mx-auto aspect-[4/5] w-full max-w-sm rounded-3xl bg-gradient-to-br from-brand-500/40 via-navy-800 to-gold/20 p-1 shadow-2xl">
            <div className="grid h-full w-full place-items-center rounded-[1.4rem] bg-navy-800/40">
              <Sparkles className="h-28 w-28 text-gold/80" />
            </div>
          </div>

          <div className="absolute -left-6 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-4 text-navy-800 shadow-xl">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm font-bold">4.9 / 5</span>
          </div>

          <div className="absolute -right-4 top-8 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-xl">
            <ShieldCheck className="h-4 w-4" /> +2,400 limpiezas
          </div>
        </div>
      </div>
    </section>
  );
}
