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

        <div className="mx-auto mt-12 max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-200 h-[400px] md:h-[500px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d188820.8037198165!2d-71.1925345791617!3d42.31426469611317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3652d0d3d311b%3A0x787cbf240162e8a0!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover saturate-[0.85] contrast-125 opacity-90 transition-all duration-500 hover:saturate-100 hover:opacity-100"
            title="Areas we serve - Boston, MA map"
          ></iframe>
        </div>

        <p className="mt-8 text-center text-sm font-medium text-slate-400">{CONTACTO.ciudad}</p>
      </div>
    </section>
  );
}