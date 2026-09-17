import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { SERVICIOS, SERVICIO_RECURRENTE } from "./content";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/Button";

export default function ServicesPage() {
  const { t } = useTranslation();
  const allServices = [...SERVICIOS, SERVICIO_RECURRENTE];

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Our Cleaning Services
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Choose the specific cleaning service that fits your needs. 
            Every service is executed with precision and backed by our satisfaction guarantee.
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:gap-24 max-w-7xl mx-auto">
          {allServices.map((s, index) => {
            const Icon = s.icon;
            const isEven = index % 2 === 0;

            return (
              <article
                key={`${s.id}-${s.frecuencia ?? "unica"}`}
                className={`relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16 group`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative">
                  <div className={`aspect-[4/3] sm:aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] ${s.destacado ? 'ring-4 ring-brand-500/20' : ''}`}>
                    <img 
                      src={s.image} 
                      alt={t(s.tituloKey)} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent mix-blend-multiply" />
                  </div>
                  
                  {s.destacado && (
                    <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'}`}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
                        <Sparkles className="h-4 w-4" /> Recommended
                      </span>
                    </div>
                  )}
                  
                  {/* Floating Icon Badge */}
                  <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} hidden md:grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-xl rotate-3 group-hover:rotate-6 transition-transform duration-500`}>
                     <div className={`p-4 rounded-2xl ${s.destacado ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-500'}`}>
                        <Icon className="h-8 w-8" />
                     </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col py-6 lg:py-0">
                  <div className="mb-6 flex items-center gap-4 md:hidden">
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
                      s.destacado ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" : "bg-brand-50 text-brand-600"
                    }`}>
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    {t(s.tituloKey)}
                  </h3>
                  
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                    {t(s.descKey)}
                  </p>

                  <ul className="mb-10 space-y-4 text-base md:text-lg text-slate-700">
                    {s.incluyeKeys.map((k) => (
                      <li key={k} className="flex gap-4 items-start">
                        <div className={`mt-1 shrink-0 rounded-full p-1 ${s.destacado ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-500"}`}>
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{t(k)}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <Link
                      to={`/solicitar?servicio=${s.id}${s.frecuencia ? `&frecuencia=${s.frecuencia}` : ""}`}
                      className="inline-block w-full sm:w-auto"
                    >
                      <Button 
                        size="lg"
                        className={`w-full sm:w-auto px-8 h-14 text-lg rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5 ${
                          s.destacado 
                            ? "bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/30" 
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                        }`}
                      >
                        {t("servicios.requestThis")} <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
