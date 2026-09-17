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
      className: "md:col-span-2 md:row-span-2",
      iconClassName: "bg-brand-500/80 text-white backdrop-blur-sm",
      textClassName: "text-brand-50",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: Building2,
      tituloKey: "audiencias.negocios.title",
      descKey: "audiencias.negocios.desc",
      className: "",
      iconClassName: "bg-white/90 text-indigo-600 backdrop-blur-sm",
      textClassName: "text-slate-100",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    },
    {
      icon: Briefcase,
      tituloKey: "audiencias.administradores.title",
      descKey: "audiencias.administradores.desc",
      className: "",
      iconClassName: "bg-white/90 text-emerald-600 backdrop-blur-sm",
      textClassName: "text-slate-100",
      imageUrl: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: Users,
      tituloKey: "audiencias.hosts.title",
      descKey: "audiencias.hosts.desc",
      className: "md:col-span-2",
      iconClassName: "bg-white/90 text-brand-600 backdrop-blur-sm",
      textClassName: "text-slate-200",
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
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

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 md:grid-rows-2 max-w-6xl mx-auto min-h-[600px]">
          {audiencias.map((a, index) => {
            const Icon = a.icon;
            const isLarge = index === 0;

            return (
              <div 
                key={a.tituloKey} 
                className={`group relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-end p-8 lg:p-10 ${a.className}`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${a.imageUrl})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Content */}
                <div className="relative z-10 mt-auto">
                  <span className={`grid place-items-center rounded-2xl mb-6 ${isLarge ? 'h-16 w-16' : 'h-14 w-14'} ${a.iconClassName}`}>
                    <Icon className={isLarge ? 'h-8 w-8' : 'h-7 w-7'} />
                  </span>
                  <h3 className={`${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'} font-extrabold mb-3 text-white leading-tight`}>
                    {t(a.tituloKey)}
                  </h3>
                  <p className={`${isLarge ? 'text-lg md:text-xl max-w-md' : 'text-sm'} leading-relaxed ${a.textClassName}`}>
                    {t(a.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}