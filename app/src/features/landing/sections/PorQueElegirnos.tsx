import { SectionHead } from "./SectionHead";
import { POR_QUE } from "../content";
import { useTranslation } from "@/i18n";

export function PorQueElegirnos() {
  const { t } = useTranslation();

  return (
    <section id="por-que" className="bg-white py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow={t("porQue.eyebrow")}
          titulo={t("porQue.title")}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POR_QUE.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.tituloKey} className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold-dark">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg">{t(p.tituloKey)}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{t(p.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}