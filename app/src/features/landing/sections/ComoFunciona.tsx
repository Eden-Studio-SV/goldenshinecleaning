import { SectionHead } from "./SectionHead";
import { PASOS } from "../content";
import { useTranslation } from "@/i18n";
import { useReveal } from "@/hooks/useReveal";

export function ComoFunciona() {
  const { t } = useTranslation();
  const { ref, revealClasses } = useReveal();

  return (
    <section id="como-funciona" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div ref={ref} className={`container-app relative ${revealClasses}`}>
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <SectionHead
            eyebrow={t("comoFunciona.eyebrow")}
            titulo={t("comoFunciona.title")}
            sub={t("comoFunciona.sub")}
          />
        </div>

        <ol className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
          {PASOS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <li key={p.numero} className="relative text-center group">
                {idx < PASOS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-brand-200 to-transparent z-0" />
                )}
                <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600 mb-8 transition-transform group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white shadow-sm z-10">
                  <Icon className="h-8 w-8" />
                  <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-white border-2 border-brand-500 text-sm font-bold text-brand-600">
                    {p.numero}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(p.tituloKey)}</h3>
                <p className="mx-auto max-w-[16rem] text-slate-600 leading-relaxed">{t(p.descKey)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}