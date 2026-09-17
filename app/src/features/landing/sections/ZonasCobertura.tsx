import { MapPin, ArrowRight } from "lucide-react";
import { ZONAS, CONTACTO } from "../content";
import { useTranslation } from "@/i18n";
import { useReveal } from "@/hooks/useReveal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function ZonasCobertura() {
  const { t } = useTranslation();
  const { ref, revealClasses } = useReveal();

  return (
    <section id="cobertura" className="bg-white py-24 lg:py-32 overflow-hidden">
      <div ref={ref} className={`container-app ${revealClasses}`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          
          {/* Content Column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-4">
              {t("cobertura.eyebrow")}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {t("cobertura.title")}
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              {t("cobertura.sub")}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              {ZONAS.map((z) => (
                <span
                  key={z.id}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-brand-50 border border-brand-100/50 px-6 py-3.5 text-base font-bold text-brand-700 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <MapPin className="h-5 w-5 text-brand-500" /> {t(z.labelKey)}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
               <Link to="/solicitar" className="w-full sm:w-auto">
                 <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl h-14 px-8 text-base font-bold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5">
                   Request Cleaning <ArrowRight className="h-5 w-5 ml-2" />
                 </Button>
               </Link>
            </div>
          </div>

          {/* Map Column */}
          <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative">
            {/* Decorative background shape */}
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-100/50 to-transparent rounded-[3rem] -z-10 blur-xl transform rotate-3" />
            
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-200 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d188820.8037198165!2d-71.1925345791617!3d42.31426469611317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e3652d0d3d311b%3A0x787cbf240162e8a0!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full object-cover saturate-50 contrast-125 opacity-90 transition-all duration-700 group-hover:saturate-100 group-hover:opacity-100 group-hover:scale-105"
                title="Areas we serve - Boston, MA map"
              ></iframe>
              
              {/* Overlay gradient to blend map edges slightly */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem] pointer-events-none" />
            </div>
            <div className="absolute -bottom-5 right-8 bg-white px-6 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
               <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
               <p className="text-sm font-bold text-slate-700">{CONTACTO.ciudad}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}