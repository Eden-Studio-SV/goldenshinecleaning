import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Brand } from "./Brand";
import { CONTACTO } from "@/features/landing/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white/80">
      <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Brand onDark />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Limpieza profesional para casa y oficina en la que puedes confiar.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={CONTACTO.telefonoHref} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4 text-gold" /> {CONTACTO.telefono}
              </a>
            </li>
            <li>
              <a
                href={CONTACTO.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACTO.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-gold" /> {CONTACTO.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Información</h4>
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
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Enlaces</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/solicitar" className="hover:text-white">
                Solicitar limpieza
              </Link>
            </li>
            <li>
              <a href="/#servicios" className="hover:text-white">
                Servicios
              </a>
            </li>
            <li>
              <Link to="/admin/login" className="text-white/50 hover:text-white">
                Acceso personal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app py-6 text-center text-xs text-white/50">
          © {year} Golden Shine Cleaning Service. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
