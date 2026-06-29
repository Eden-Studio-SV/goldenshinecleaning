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
  type LucideIcon,
} from "lucide-react";
import type { TipoServicio } from "@/types";

/**
 * Contenido editable de la landing (§8.3). Cambiar textos aquí no requiere
 * tocar componentes.
 *
 * ⚠️ DATOS DE CONTACTO = PLACEHOLDERS. Reemplazar con la información real del
 * negocio antes de publicar (teléfono, WhatsApp, correo, horario y ciudad).
 */
export const CONTACTO = {
  telefono: "+1 (555) 123-4567", // TODO: teléfono real
  telefonoHref: "tel:+15551234567",
  whatsapp: "15551234567", // TODO: número WhatsApp real (formato internacional sin +)
  whatsappHref: "https://wa.me/15551234567",
  email: "contacto@goldenshine.com", // TODO: correo real
  horario: "Lun – Sáb · 8:00 am – 6:00 pm",
  ciudad: "Tu ciudad y alrededores", // TODO: zona real
  redes: {
    facebook: "#",
    instagram: "#",
  },
};

export const NAV_LINKS: { id: string; label: string }[] = [
  { id: "servicios", label: "Servicios" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "por-que", label: "Por qué elegirnos" },
  { id: "cobertura", label: "Cobertura" },
];

export const HERO = {
  titulo: "Un hogar impecable, sin que muevas un dedo",
  subtitulo:
    "Golden Shine es tu servicio de limpieza de confianza para casa y oficina. Personal capacitado, productos seguros y resultados que brillan. Solicita en línea en menos de un minuto.",
  ctaPrimario: "Solicitar limpieza",
  ctaSecundario: "Ver servicios",
  stats: [
    { valor: "+2,400", etiqueta: "limpiezas realizadas" },
    { valor: "4.9/5", etiqueta: "satisfacción de clientes" },
    { valor: "100%", etiqueta: "garantía de servicio" },
  ],
};

export interface Servicio {
  id: TipoServicio;
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
  incluye: string[];
}

export const SERVICIOS: Servicio[] = [
  {
    id: "residencial",
    icon: Home,
    titulo: "Limpieza Residencial",
    descripcion:
      "Mantenimiento regular de tu casa o apartamento para que siempre luzca y se sienta fresco.",
    incluye: [
      "Cocina, baños y áreas comunes",
      "Pisos, polvo y superficies",
      "Frecuencia semanal, quincenal o mensual",
    ],
  },
  {
    id: "comercial",
    icon: Building2,
    titulo: "Limpieza Comercial",
    descripcion:
      "Oficinas, locales y consultorios siempre presentables para tu equipo y tus clientes.",
    incluye: [
      "Escritorios y áreas de trabajo",
      "Recepción, baños y salas",
      "Horarios flexibles, fuera de operación",
    ],
  },
  {
    id: "profunda",
    icon: Sparkles,
    titulo: "Limpieza Profunda",
    descripcion:
      "Una limpieza a fondo, de arriba a abajo. Ideal para mudanzas, post-obra o puesta a punto.",
    incluye: [
      "Detalle en rincones y zócalos",
      "Interior de electrodomésticos",
      "Desinfección de puntos de contacto",
    ],
  },
];

export interface Punto {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

export const POR_QUE: Punto[] = [
  {
    icon: Clock,
    titulo: "Puntualidad",
    descripcion: "Llegamos a la hora acordada y respetamos tu tiempo.",
  },
  {
    icon: BadgeCheck,
    titulo: "Personal capacitado",
    descripcion: "Equipo verificado y entrenado en cada tipo de servicio.",
  },
  {
    icon: Leaf,
    titulo: "Productos seguros",
    descripcion: "Insumos eficaces y amables con tu familia y mascotas.",
  },
  {
    icon: ShieldCheck,
    titulo: "Garantía de satisfacción",
    descripcion: "Si algo no quedó perfecto, lo corregimos sin costo.",
  },
];

export interface Paso {
  numero: number;
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

export const PASOS: Paso[] = [
  {
    numero: 1,
    icon: ClipboardList,
    titulo: "Solicitas en línea",
    descripcion: "Completas el formulario con el tipo de limpieza, fecha y hora deseada.",
  },
  {
    numero: 2,
    icon: CalendarCheck,
    titulo: "Confirmamos fecha y hora",
    descripcion: "Te contactamos para confirmar los detalles y resolver dudas.",
  },
  {
    numero: 3,
    icon: Wand2,
    titulo: "Limpiamos",
    descripcion: "Nuestro equipo llega y deja tu espacio impecable.",
  },
];

export interface Testimonio {
  nombre: string;
  inicial: string;
  ciudad: string;
  texto: string;
}

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: "María L.",
    inicial: "M",
    ciudad: "Cliente residencial",
    texto:
      "Dejaron mi cocina impecable y fueron muy amables. Solicitar tomó menos de un minuto.",
  },
  {
    nombre: "Jorge P.",
    inicial: "J",
    ciudad: "Oficina comercial",
    texto:
      "Usamos Golden Shine cada semana para la oficina. Siempre puntuales y muy minuciosos.",
  },
  {
    nombre: "Aisha K.",
    inicial: "A",
    ciudad: "Limpieza profunda",
    texto:
      "La limpieza profunda antes de mudarnos fue excelente. Valió cada centavo.",
  },
];

export const ZONAS: string[] = [
  "Centro",
  "Zona Norte",
  "Zona Sur",
  "Zona Este",
  "Zona Oeste",
  "Áreas aledañas",
];
