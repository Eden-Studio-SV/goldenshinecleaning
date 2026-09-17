import { MapPin } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { ZONAS, CONTACTO } from "../content";
import { useTranslation } from "@/i18n";
import { useReveal } from "@/hooks/useReveal";

export function ZonasCobertura() {
  const { t } = useTranslation();
  const { ref, revealClasses } = useReveal();

  return (
    <section id="cobertura" className="bg-slate-50 py-24 lg:py-32">
      <div ref={ref} className={`container-app ${revealClasses}`}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionHead
            eyebrow={t("cobertura.eyebrow")}
            titulo={t("cobertura.title")}
            sub={t("cobertura.sub")}
          />
        </div>

        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          {ZONAS.map((z) => (
            <span
              key={z.id}
              className="inline-flex items-center gap-2.5 rounded-full border border-brand-100 bg-brand-50 px-6 py-3 text-sm font-bold text-brand-700 shadow-sm"
            >
              <MapPin className="h-5 w-5 text-brand-500" /> {t(z.labelKey)}
            </span>
          ))}
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-400">{CONTACTO.ciudad}</p>
      </div>
    </section>
  );
}