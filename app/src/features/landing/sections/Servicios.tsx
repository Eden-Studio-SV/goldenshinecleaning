import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { SERVICIOS, SERVICIO_RECURRENTE } from "../content";
import { SectionHead } from "./SectionHead";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/Button";

export function Servicios() {
  const { t } = useTranslation();

  return (
    <section id="servicios" className="bg-slate-50 py-24 lg:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="container-app relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHead
            eyebrow={t("servicios.eyebrow")}
            titulo={t("servicios.title")}
            sub={t("servicios.sub")}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {[...SERVICIOS, SERVICIO_RECURRENTE].map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={`${s.id}-${s.frecuencia ?? "unica"}`}
                className={`relative flex flex-col p-8 sm:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white rounded-[2rem] border ${
                  s.destacado ? "border-brand-500 shadow-xl" : "border-slate-100 shadow-sm"
                }`}
              >
                {s.destacado && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      <Sparkles className="h-3.5 w-3.5" /> Recommended
                    </span>
                  </div>
                )}
                
                <div className="mb-6 flex items-center gap-4">
                  <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${
                    s.destacado ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" : "bg-brand-50 text-brand-600"
                  }`}>
                    <Icon className="h-8 w-8" />
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{t(s.tituloKey)}</h3>
                  </div>
                </div>
                
                <p className="text-slate-500 mb-8 leading-relaxed min-h-[3rem]">{t(s.descKey)}</p>

                <ul className="mb-8 space-y-3.5 text-sm md:text-base text-slate-600 flex-1">
                  {s.incluyeKeys.map((k) => (
                    <li key={k} className="flex gap-3 items-start">
                      <div className={`mt-1 shrink-0 rounded-full p-0.5 ${s.destacado ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-400"}`}>
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="leading-tight">{t(k)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <Link
                    to={`/solicitar?servicio=${s.id}${s.frecuencia ? `&frecuencia=${s.frecuencia}` : ""}`}
                    className="block w-full"
                  >
                    <Button 
                      className={`w-full py-6 text-lg rounded-xl font-bold transition-all ${
                        s.destacado 
                          ? "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20" 
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-none"
                      }`}
                    >
                      {t("servicios.requestThis")} <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
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
