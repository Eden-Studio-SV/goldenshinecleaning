import { PASOS } from "../content";
import { useTranslation } from "@/i18n";
import { useReveal } from "@/hooks/useReveal";

export function ComoFunciona() {
  const { t } = useTranslation();
  const { ref, revealClasses } = useReveal();

  return (
    <section id="como-funciona" className="py-24 lg:py-32 bg-white relative">
      <div ref={ref} className={`container-app relative ${revealClasses}`}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 max-w-7xl mx-auto">
          
          {/* Sticky Header Side */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-32 h-fit">
            <div className="text-center lg:text-left">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-4 block">
                {t("comoFunciona.eyebrow")}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {t("comoFunciona.title")}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0">
                {t("comoFunciona.sub")}
              </p>
            </div>
          </div>

          {/* Scrolling Steps Side */}
          <div className="w-full lg:w-7/12 flex flex-col gap-8">
            {PASOS.map((p) => {
              const Icon = p.icon;
              return (
                <div 
                  key={p.numero} 
                  className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:border-slate-200 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-brand-900 pointer-events-none select-none transition-transform group-hover:scale-110">
                    {p.numero}
                  </div>
                  
                  <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start">
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.5rem] bg-brand-500 text-white shadow-xl shadow-brand-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="h-10 w-10" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">{t(p.tituloKey)}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed max-w-md">{t(p.descKey)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}