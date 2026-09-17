import { POR_QUE } from "../content";
import { useTranslation } from "@/i18n";
import { useReveal } from "@/hooks/useReveal";

export function PorQueElegirnos() {
  const { t } = useTranslation();
  const { ref, revealClasses } = useReveal();

  const iconColors = [
    "bg-blue-50 text-blue-600",
    "bg-purple-50 text-purple-600",
    "bg-emerald-50 text-emerald-600",
    "bg-orange-50 text-orange-600",
  ];

  return (
    <section id="por-que-elegirnos" className="bg-slate-50 py-24 lg:py-32">
      <div ref={ref} className={`container-app ${revealClasses}`}>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          
          {/* Left Column: Title & Intro */}
          <div className="text-center lg:text-left">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-4 block">
              {t("porQue.eyebrow")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {t("porQue.title")}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0">
              We stand out by providing reliable, high-quality cleaning services that you can trust. No hidden fees, no surprises.
            </p>
          </div>

          {/* Right Column: 2x2 Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {POR_QUE.map((p, index) => {
              const Icon = p.icon;
              const colorClass = iconColors[index % iconColors.length];
              
              return (
                <div 
                  key={p.tituloKey} 
                  className="bg-white rounded-[2rem] p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100"
                >
                  <span className={`grid h-16 w-16 place-items-center rounded-2xl mb-8 ${colorClass}`}>
                    <Icon className="h-8 w-8" />
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-4 leading-tight">{t(p.tituloKey)}</h3>
                  <p className="text-slate-600 leading-relaxed">{t(p.descKey)}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}