import {
  Home,
  Building2,
  Sparkles,
  Clock,
  ShieldCheck,
  Leaf,
  BadgeCheck,
  ClipboardList,
  CalendarCheck,
  Wand2,
  Truck,
  BedDouble,
  HardHat,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import type { Frecuencia, TipoServicio } from "@/types";

/**
 * Contenido editable de la landing. Cambiar textos aquí no requiere tocar
 * componentes. Los textos visibles se sirven vía i18n (`@/i18n`); este archivo
 * expone la estructura (iconos, ids, orden) y datos de contacto configurables.
 *
 * ⚠️ DATOS DE CONTACTO: se leen de variables de entorno (VITE_CONTACT_PHONE,
 * VITE_CONTACT_EMAIL) si están definidas. Si no, NO se muestran enlaces
 * públicos de teléfono/WhatsApp/email inventados; el CTA principal es el
 * formulario. Reportar si faltan contactos reales.
 */

interface ContactoConfig {
  /** Teléfono público (E.164 o legible). `null` si no está confirmado. */
  telefono: string | null;
  telefonoHref: string | null;
  /** Número WhatsApp (formato internacional sin +). `null` si no está confirmado. */
  whatsapp: string | null;
  whatsappHref: string | null;
  /** Correo público. `null` si no está confirmado. */
  email: string | null;
  horario: string;
  ciudad: string;
  redes: {
    facebook: string | null;
    instagram: string | null;
  };
}

/**
 * Acceso genérico a variables de entorno de contacto sin extender
 * `ImportMetaEnv` (gestionado por otro agente). Solo lectura de strings.
 */
const ENV = import.meta.env as unknown as Record<string, string | undefined>;

function envStr(v: string | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

const ENV_PHONE = envStr(ENV.VITE_CONTACT_PHONE);
const ENV_EMAIL = envStr(ENV.VITE_CONTACT_EMAIL);
const ENV_WHATSAPP = envStr(ENV.VITE_CONTACT_WHATSAPP);

export const CONTACTO: ContactoConfig = {
  telefono: ENV_PHONE,
  telefonoHref: ENV_PHONE ? `tel:${ENV_PHONE.replace(/[^\d+]/g, "")}` : null,
  whatsapp: ENV_WHATSAPP,
  whatsappHref: ENV_WHATSAPP ? `https://wa.me/${ENV_WHATSAPP}` : null,
  email: ENV_EMAIL,
  horario: "Mon–Sat · 8:00 AM – 7:00 PM",
  ciudad: "Boston, Massachusetts",
  redes: {
    facebook: envStr(ENV.VITE_CONTACT_FACEBOOK),
    instagram: envStr(ENV.VITE_CONTACT_INSTAGRAM),
  },
};

/**
 * Centro y zoom por defecto del mapa (Leaflet) en el formulario.
 * Boston, Massachusetts (downtown).
 */
export const MAPA_DEFAULT = {
  centro: { lat: 42.3601, lng: -71.0589 },
  zoom: 13,
};

export const NAV_LINKS: { id: string; labelKey: string }[] = [
  { id: "servicios", labelKey: "nav.services" },
  { id: "como-funciona", labelKey: "nav.howItWorks" },
  { id: "por-que", labelKey: "nav.whyUs" },
  { id: "cobertura", labelKey: "nav.coverage" },
];

export const HERO = {
  tituloKey: "hero.title",
  subtituloKey: "hero.subtitle",
  ctaPrimarioKey: "hero.ctaPrimary",
  ctaSecundarioKey: "hero.ctaSecondary",
  areaKey: "hero.areaBoston",
  scheduleKey: "hero.schedule",
};

export interface Servicio {
  id: TipoServicio;
  /** Frecuencia preseleccionada al solicitar este servicio, si aplica. */
  frecuencia?: Frecuencia;
  icon: LucideIcon;
  /** URL de la imagen representativa del servicio. */
  image: string;
  /** Clave i18n del título. */
  tituloKey: string;
  /** Clave i18n de la descripción. */
  descKey: string;
  /** Claves i18n de los bullets (incluye). */
  incluyeKeys: string[];
  /** Destacado en la cuadrícula de servicios. */
  destacado?: boolean;
}

/**
 * Catálogo de servicios de marketing. Cubre los seis del brief
 * (residencial, post-construcción, profunda, recurrente, mudanza, Airbnb) y
 * conserva comercial como secundario. Residencial y Airbnb se destacan.
 */
export const SERVICIOS: Servicio[] = [
  {
    id: "residencial",
    icon: Home,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1600",
    tituloKey: "servicios.residencial.title",
    descKey: "servicios.residencial.desc",
    incluyeKeys: [
      "servicios.residencial.0",
      "servicios.residencial.1",
      "servicios.residencial.2",
    ],
    destacado: true,
  },
  {
    id: "airbnb",
    icon: BedDouble,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1600",
    tituloKey: "servicios.airbnb.title",
    descKey: "servicios.airbnb.desc",
    incluyeKeys: ["servicios.airbnb.0", "servicios.airbnb.1", "servicios.airbnb.2"],
    destacado: true,
  },
  {
    id: "post_construccion",
    icon: HardHat,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=1600",
    tituloKey: "servicios.post_construccion.title",
    descKey: "servicios.post_construccion.desc",
    incluyeKeys: [
      "servicios.post_construccion.0",
      "servicios.post_construccion.1",
      "servicios.post_construccion.2",
    ],
  },
  {
    id: "profunda",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1600",
    tituloKey: "servicios.profunda.title",
    descKey: "servicios.profunda.desc",
    incluyeKeys: ["servicios.profunda.0", "servicios.profunda.1", "servicios.profunda.2"],
  },
  {
    id: "mudanza",
    icon: Truck,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
    tituloKey: "servicios.mudanza.title",
    descKey: "servicios.mudanza.desc",
    incluyeKeys: ["servicios.mudanza.0", "servicios.mudanza.1", "servicios.mudanza.2"],
  },
  {
    id: "comercial",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
    tituloKey: "servicios.comercial.title",
    descKey: "servicios.comercial.desc",
    incluyeKeys: ["servicios.comercial.0", "servicios.comercial.1", "servicios.comercial.2"],
  },
];

/**
 * Oferta recurrente de marketing. No pertenece a `SERVICIOS` porque el
 * formulario usa ese catálogo únicamente para los tipos de servicio válidos.
 */
export const SERVICIO_RECURRENTE: Servicio = {
  id: "residencial",
  frecuencia: "semanal",
  icon: Repeat,
  image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1600",
  tituloKey: "servicios.recurrente.title",
  descKey: "servicios.recurrente.desc",
  incluyeKeys: ["servicios.recurrente.0", "servicios.recurrente.1", "servicios.recurrente.2"],
};

export interface Punto {
  icon: LucideIcon;
  tituloKey: string;
  descKey: string;
}

export const POR_QUE: Punto[] = [
  { icon: Clock, tituloKey: "porQue.puntualidad.title", descKey: "porQue.puntualidad.desc" },
  { icon: BadgeCheck, tituloKey: "porQue.personal.title", descKey: "porQue.personal.desc" },
  { icon: Leaf, tituloKey: "porQue.productos.title", descKey: "porQue.productos.desc" },
  { icon: ShieldCheck, tituloKey: "porQue.proceso.title", descKey: "porQue.proceso.desc" },
];

export interface Paso {
  numero: number;
  icon: LucideIcon;
  tituloKey: string;
  descKey: string;
}

export const PASOS: Paso[] = [
  {
    numero: 1,
    icon: ClipboardList,
    tituloKey: "comoFunciona.1.title",
    descKey: "comoFunciona.1.desc",
  },
  {
    numero: 2,
    icon: CalendarCheck,
    tituloKey: "comoFunciona.2.title",
    descKey: "comoFunciona.2.desc",
  },
  {
    numero: 3,
    icon: Wand2,
    tituloKey: "comoFunciona.3.title",
    descKey: "comoFunciona.3.desc",
  },
];

/**
 * Zonas de cobertura (Boston, MA). Claves i18n para los labels.
 * No se inventan zonas no confirmadas.
 */
export const ZONAS: { id: string; labelKey: string }[] = [
  { id: "boston", labelKey: "cobertura.boston" },
];
