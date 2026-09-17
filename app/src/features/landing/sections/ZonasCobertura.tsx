import { MapPin } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { ZONAS, CONTACTO } from "../content";
import { useTranslation } from "@/i18n";

export function ZonasCobertura() {
  const { t } = useTranslation();

  return (
    <section id="cobertura" className="bg-white py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow={t("cobertura.eyebrow")}
          titulo={t("cobertura.title")}
          sub={t("cobertura.sub")}
        />

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {ZONAS.map((z) => (
            <span
              key={z.id}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-brand-50 px-4 py-2 text-sm font-medium text-navy-800"
            >
              <MapPin className="h-4 w-4 text-brand-500" /> {t(z.labelKey)}
            </span>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">{CONTACTO.ciudad}</p>
      </div>
    </section>
  );
}