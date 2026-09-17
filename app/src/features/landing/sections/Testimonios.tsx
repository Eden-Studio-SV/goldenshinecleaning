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
      className: "md:col-span-2 md:row-span-2 bg-brand-500 text-white",
      iconClassName: "bg-white/20 text-white",
      textClassName: "text-brand-50",
    },
    {
      icon: Building2,
      tituloKey: "audiencias.negocios.title",
      descKey: "audiencias.negocios.desc",
      className: "bg-white border border-slate-100",
      iconClassName: "bg-indigo-50 text-indigo-600",
      textClassName: "text-slate-600",
    },
    {
      icon: Briefcase,
      tituloKey: "audiencias.administradores.title",
      descKey: "audiencias.administradores.desc",
      className: "bg-white border border-slate-100",
      iconClassName: "bg-emerald-50 text-emerald-600",
      textClassName: "text-slate-600",
    },
    {
      icon: Users,
      tituloKey: "audiencias.hosts.title",
      descKey: "audiencias.hosts.desc",
      className: "md:col-span-2 bg-slate-900 text-white",
      iconClassName: "bg-white/10 text-brand-300",
      textClassName: "text-slate-400",
    },
  ];

  return (
    <section id="audiencias" className="bg-slate-50 py-24 lg:py-32">
      <div ref={ref} className={`container-app ${revealClasses}`}>
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <SectionHead
            eyebrow={t("audiencias.eyebrow")}
            titulo={t("audiencias.title")}
            sub={t("audiencias.sub")}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 md:grid-rows-2 max-w-6xl mx-auto">
          {audiencias.map((a, index) => {
            const Icon = a.icon;
            const isLarge = index === 0;

            return (
              <div 
                key={a.tituloKey} 
                className={`rounded-[2rem] p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-center ${a.className}`}
              >
                <span className={`grid place-items-center rounded-2xl mb-8 ${isLarge ? 'h-20 w-20' : 'h-16 w-16'} ${a.iconClassName}`}>
                  <Icon className={isLarge ? 'h-10 w-10' : 'h-8 w-8'} />
                </span>
                <h3 className={`${isLarge ? 'text-3xl md:text-4xl' : 'text-xl'} font-extrabold mb-4 leading-tight`}>
                  {t(a.tituloKey)}
                </h3>
                <p className={`${isLarge ? 'text-lg md:text-xl max-w-md' : 'text-sm'} leading-relaxed ${a.textClassName}`}>
                  {t(a.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}