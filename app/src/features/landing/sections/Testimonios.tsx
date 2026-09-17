import { Users, Building2, Briefcase, Home } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { useTranslation } from "@/i18n";
import { useReveal } from "@/hooks/useReveal";

export function Testimonios() {
  const { t } = useTranslation();
  const { ref, revealClasses } = useReveal();

  const audiencias = [
    {
      icon: Home,
      tituloKey: "audiencias.familias.title",
      descKey: "audiencias.familias.desc",
    },
    {
      icon: Building2,
      tituloKey: "audiencias.negocios.title",
      descKey: "audiencias.negocios.desc",
    },
    {
      icon: Briefcase,
      tituloKey: "audiencias.administradores.title",
      descKey: "audiencias.administradores.desc",
    },
    {
      icon: Users,
      tituloKey: "audiencias.hosts.title",
      descKey: "audiencias.hosts.desc",
    },
  ];

  return (
    <section id="audiencias" className="bg-white py-24 lg:py-32 border-t border-slate-100">
      <div ref={ref} className={`container-app ${revealClasses}`}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHead
            eyebrow={t("audiencias.eyebrow")}
            titulo={t("audiencias.title")}
            sub={t("audiencias.sub")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {audiencias.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.tituloKey} className="bg-white rounded-[1.5rem] p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-600 mb-6">
                  <Icon className="h-8 w-8" />
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(a.tituloKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(a.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}