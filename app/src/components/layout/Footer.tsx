import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle, AlertCircle } from "lucide-react";
import { Brand } from "./Brand";
import { CONTACTO } from "@/features/landing/content";
import { useTranslation } from "@/i18n";

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  const hasPhone = Boolean(CONTACTO.telefono && CONTACTO.telefonoHref);
  const hasWhatsapp = Boolean(CONTACTO.whatsapp && CONTACTO.whatsappHref);
  const hasEmail = Boolean(CONTACTO.email);
  const hasAnyContact = hasPhone || hasWhatsapp || hasEmail;

  return (
    <footer className="bg-navy-900 text-white/80">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Brand onDark />
          <p className="mt-4 max-w-xs text-sm text-white/60">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("footer.contact")}
          </h4>
          {hasAnyContact ? (
            <ul className="mt-4 space-y-3 text-sm">
              {hasPhone && (
                <li>
                  <a
                    href={CONTACTO.telefonoHref!}
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-gold" /> {CONTACTO.telefono}
                  </a>
                </li>
              )}
              {hasWhatsapp && (
                <li>
                  <a
                    href={CONTACTO.whatsappHref!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-gold" /> {t("footer.whatsapp")}
                  </a>
                </li>
              )}
              {hasEmail && (
                <li>
                  <a
                    href={`mailto:${CONTACTO.email!}`}
                    className="inline-flex items-center gap-2 hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-gold" /> {CONTACTO.email}
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/5 p-3 text-xs text-white/60">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{t("footer.contactMissing")}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("footer.info")}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> {CONTACTO.ciudad}
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> {CONTACTO.horario}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("footer.links")}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/solicitar" className="hover:text-white">
                {t("footer.requestCleaning")}
              </Link>
            </li>
            <li>
              <a href="/#servicios" className="hover:text-white">
                {t("footer.services")}
              </a>
            </li>
            <li>
              {/* Acceso personal: /ingresar respeta el guard; el admin se decide tras login. */}
              <Link to="/ingresar" className="text-white/50 hover:text-white">
                {t("footer.staffAccess")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app py-6 text-center text-xs text-white/50">
          © {year} Golden Shine Cleaning Service. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}