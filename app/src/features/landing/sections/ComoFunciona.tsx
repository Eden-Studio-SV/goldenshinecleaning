import { SectionHead } from "./SectionHead";
import { PASOS } from "../content";
import { useTranslation } from "@/i18n";

export function ComoFunciona() {
  const { t } = useTranslation();

  return (
    <section id="como-funciona" className="bg-brand-50 py-20 lg:py-24">
      <div className="container-app">
        <SectionHead eyebrow={t("comoFunciona.eyebrow")} titulo={t("comoFunciona.title")} />

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {PASOS.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.numero} className="relative text-center">
                <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy-900 text-white shadow-lg">
                  <Icon className="h-9 w-9" />
                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-gold text-sm font-bold text-navy-900">
                    {p.numero}
                  </span>
                </div>
                <h3 className="mt-5 text-xl">{t(p.tituloKey)}</h3>
                <p className="mx-auto mt-2 max-w-xs text-gray-600">{t(p.descKey)}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}