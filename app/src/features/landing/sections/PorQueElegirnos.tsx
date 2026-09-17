import { SectionHead } from "./SectionHead";
import { POR_QUE } from "../content";
import { useTranslation } from "@/i18n";

export function PorQueElegirnos() {
  const { t } = useTranslation();

  return (
    <section id="por-que" className="bg-slate-50 py-24 lg:py-32">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHead
            eyebrow={t("porQue.eyebrow")}
            titulo={t("porQue.title")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {POR_QUE.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.tituloKey} className="bg-white rounded-[1.5rem] p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 mb-6">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t(p.tituloKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(p.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}