import { Link } from "react-router-dom";
import { ArrowRight, Check, Star } from "lucide-react";
import { SERVICIOS, SERVICIO_RECURRENTE } from "../content";
import { SectionHead } from "./SectionHead";
import { useTranslation } from "@/i18n";

export function Servicios() {
  const { t } = useTranslation();

  return (
    <section id="servicios" className="bg-white py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow={t("servicios.eyebrow")}
          titulo={t("servicios.title")}
          sub={t("servicios.sub")}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...SERVICIOS, SERVICIO_RECURRENTE].map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={`${s.id}-${s.frecuencia ?? "unica"}`}
                className={`card relative flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-lg ${
                  s.destacado ? "ring-2 ring-gold/40" : ""
                }`}
              >
                {s.destacado && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                  </span>
                )}
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-500">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl">{t(s.tituloKey)}</h3>
                <p className="mt-2 text-gray-600">{t(s.descKey)}</p>

                <ul className="mt-5 space-y-2 text-sm text-gray-600">
                  {s.incluyeKeys.map((k) => (
                    <li key={k} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {t(k)}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-2">
                  <Link
                    to={`/solicitar?servicio=${s.id}${s.frecuencia ? `&frecuencia=${s.frecuencia}` : ""}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 transition-all hover:gap-2"
                  >
                    {t("servicios.requestThis")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
