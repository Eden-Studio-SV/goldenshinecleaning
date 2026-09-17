/**
 * Sistema de internacionalización (i18n) propio de Golden Shine.
 *
 * API pública:
 * - `<I18nProvider>`: provee el contexto de idioma a toda la app.
 * - `useTranslation()`: hook que devuelve `{ t, locale, setLocale }`.
 * - `translateText(esText, locale?)`: traduce un mensaje en español suelto
 *   (de libs/catálogos que no se pueden modificar) al locale activo.
 * - `useLocale()`: hook que devuelve solo el locale activo (ligero).
 *
 * Diseño:
 * - Sin dependencias externas (package compartido prohibido).
 * - Inglés por defecto (Boston, MA). Español disponible.
 * - Persistencia en localStorage (`gs_locale`).
 * - Sincroniza `<html lang>` y metadatos básicos al cambiar.
 * - Sin reemplazo DOM automático: las traducciones se aplican vía `t()`.
 *
 * Contrato para futuros tests/componentes:
 * - Las claves son strings planas con namespaces separados por punto
 *   (ej. `"hero.title"`). Los parámetros se interpolan con `{nombre}`.
 * - `translateText` recibe SIEMPRE el texto en español y devuelve la
 *   traducción al locale indicado (o al activo si se omite). Si no hay
 *   traducción conocida, devuelve el texto original en español.
 * - Los catálogos de tipos (TIPOS_SERVICIO, FRECUENCIAS, ESTADO_LABEL)
 *   viven en `@/types` en español; aquí se exponen mapas de traducción
 *   `tipoServicioLabel` / `frecuenciaLabel` / `estadoLabel` para usarlos
 *   en la UI sin modificar `@/types`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

const STORAGE_KEY = "gs_locale";

/** Entrada de catálogo: string o función de interpolación. */
type Msg = string | ((p: Record<string, string | number>) => string);

/** Diccionario completo de un locale. */
type Catalog = Record<string, Msg>;

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------

const en: Catalog = {
  // common
  "common.loading": "Loading…",
  "common.saving": "Saving…",
  "common.sending": "Sending…",
  "common.retry": "Retry",
  "common.back": "Back",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.optional": "(optional)",
  "common.required": "Required",
  "common.or": "or",
  "common.close": "Close",
  "common.open": "Open",
  "common.searching": "Searching…",
  "common.notConfigured": "Not configured yet",

  // brand
  "brand.home": "Golden Shine — Home",

  // nav
  "nav.services": "Services",
  "nav.howItWorks": "How it works",
  "nav.whyUs": "Why choose us",
  "nav.coverage": "Coverage",
  "nav.myAccount": "My account",
  "nav.requestCleaning": "Request cleaning",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.language": "Language",
  "nav.english": "English",
  "nav.spanish": "Español",

  // hero
  "hero.badge": "Cleaning services in Boston, MA",
  "hero.title": "Cleaning for your home, move, or short-term rental",
  "hero.subtitle":
    "Tell us what you need and when. Submit a cleaning request online, and we will contact you to coordinate the details.",
  "hero.ctaPrimary": "Request cleaning",
  "hero.ctaSecondary": "See services",
  "hero.areaBoston": "Boston, Massachusetts",
  "hero.schedule": "Mon–Sat · 8:00 AM – 7:00 PM",

  // servicios
  "servicios.eyebrow": "Our services",
  "servicios.title": "Cleaning for every space",
  "servicios.sub": "Choose the service you need. All with the same attention to detail.",
  "servicios.requestThis": "Request this service",
  "servicios.residencial.title": "Residential Cleaning",
  "servicios.residencial.desc":
    "Regular maintenance for your home or apartment so it always looks and feels fresh.",
  "servicios.residencial.0": "Kitchen, bathrooms and common areas",
  "servicios.residencial.1": "Floors, dusting and surfaces",
  "servicios.residencial.2": "Weekly, biweekly or monthly frequency",
  "servicios.post_construccion.title": "Post-Construction Cleaning",
  "servicios.post_construccion.desc":
    "Detailed cleanup after renovations or construction, removing dust and debris from every surface.",
  "servicios.post_construccion.0": "Fine dust removal from walls, floors and fixtures",
  "servicios.post_construccion.1": "Window, frame and vent cleaning",
  "servicios.post_construccion.2": "Surface disinfection and final touch-up",
  "servicios.profunda.title": "Deep Cleaning",
  "servicios.profunda.desc":
    "A thorough top-to-bottom clean. Ideal for move-ins, move-outs or a full refresh.",
  "servicios.profunda.0": "Detail in corners and baseboards",
  "servicios.profunda.1": "Inside appliances",
  "servicios.profunda.2": "Disinfection of high-touch points",
  "servicios.recurrente.title": "Recurring Cleaning",
  "servicios.recurrente.desc":
    "Set a weekly, biweekly or monthly plan and we'll keep your space consistently clean.",
  "servicios.recurrente.0": "Customizable schedule",
  "servicios.recurrente.1": "Same trusted team when possible",
  "servicios.recurrente.2": "Automatic next-visit scheduling",
  "servicios.mudanza.title": "Move In / Move Out Cleaning",
  "servicios.mudanza.desc":
    "Start or end your move in a spotless space. Comprehensive cleaning for empty or packed homes.",
  "servicios.mudanza.0": "Full interior including cabinets and drawers",
  "servicios.mudanza.1": "Appliance interior cleaning",
  "servicios.mudanza.2": "Ready for new occupants",
  "servicios.airbnb.title": "Airbnb & Short-Term Rental Cleaning",
  "servicios.airbnb.desc":
    "Reliable turnover cleaning for hosts and property managers. Guests arrive to a pristine space.",
  "servicios.airbnb.0": "Fast, reliable turnover service",
  "servicios.airbnb.1": "Linen and supply restock support",
  "servicios.airbnb.2": "Flexible scheduling for check-in/out times",
  "servicios.comercial.title": "Commercial Cleaning",
  "servicios.comercial.desc":
    "Offices, retail and clinics always presentable for your team and your clients.",
  "servicios.comercial.0": "Desks and work areas",
  "servicios.comercial.1": "Reception, restrooms and meeting rooms",
  "servicios.comercial.2": "Flexible hours, outside business operations",

  // como funciona
  "comoFunciona.eyebrow": "Simple and fast",
  "comoFunciona.title": "How it works",
  "comoFunciona.sub": "Your clean space is just 3 simple steps away.",
  "comoFunciona.1.title": "Request online",
  "comoFunciona.1.desc": "Fill out the form with the type of cleaning, date and time you want.",
  "comoFunciona.2.title": "We confirm date and time",
  "comoFunciona.2.desc": "We contact you to confirm details and answer any questions.",
  "comoFunciona.3.title": "We clean",
  "comoFunciona.3.desc": "Our team arrives and leaves your space spotless.",

  // por que
  "porQue.eyebrow": "Why choose us",
  "porQue.title": "A clear way to request cleaning",
  "porQue.puntualidad.title": "Punctuality",
  "porQue.puntualidad.desc": "Share the date and time you prefer in your request.",
  "porQue.personal.title": "Services for different needs",
  "porQue.personal.desc": "Choose residential, deep cleaning, move cleaning, or Airbnb turnover support.",
  "porQue.productos.title": "Recurring frequency",
  "porQue.productos.desc": "Choose a one-time, weekly, biweekly, or monthly frequency.",
  "porQue.proceso.title": "Request before confirmation",
  "porQue.proceso.desc": "A submitted request is not a confirmed booking; we will contact you to coordinate it.",

  // cobertura
  "cobertura.eyebrow": "Coverage",
  "cobertura.title": "Areas we serve",
  "cobertura.sub": "We serve Boston, Massachusetts. Submit your request and we will confirm availability for your address.",
  "cobertura.boston": "Boston",
  "cobertura.north": "North Shore",
  "cobertura.south": "South Shore",
  "cobertura.east": "East Boston & Waterfront",
  "cobertura.west": "MetroWest",
  "cobertura.cambridge": "Cambridge & Somerville",
  "cobertura.surrounding": "Surrounding areas",

  // audiencias (reemplaza testimonios no verificados)
  "audiencias.eyebrow": "Who we serve",
  "audiencias.title": "Cleaning for every situation",
  "audiencias.sub": "Tailored service for families, businesses, property managers and hosts.",
  "audiencias.familias.title": "Families",
  "audiencias.familias.desc": "Recurring or one-time cleaning so you can enjoy your home without worrying about chores.",
  "audiencias.negocios.title": "Businesses",
  "audiencias.negocios.desc": "Offices and retail spaces kept presentable with flexible hours outside your operations.",
  "audiencias.administradores.title": "Property managers",
  "audiencias.administradores.desc": "Reliable turnover and maintenance cleaning across the properties you manage.",
  "audiencias.hosts.title": "Airbnb hosts",
  "audiencias.hosts.desc": "Fast turnover service so every guest arrives to a spotless, ready space.",

  // cta final
  "cta.title": "Ready for a spotless space?",
  "cta.sub": "Request your cleaning in under a minute. We'll contact you to confirm date and time.",
  "cta.button": "Request cleaning",

  // footer
  "footer.tagline": "Cleaning requests for homes, moves, and short-term rentals in Boston, MA.",
  "footer.contact": "Contact",
  "footer.info": "Information",
  "footer.links": "Links",
  "footer.phone": "Phone",
  "footer.email": "Email",
  "footer.whatsapp": "WhatsApp",
  "footer.schedule": "Schedule",
  "footer.area": "Service area",
  "footer.requestCleaning": "Request cleaning",
  "footer.services": "Services",
  "footer.staffAccess": "Staff access",
  "footer.rights": "All rights reserved.",
  "footer.contactMissing": "Contact info not yet configured. Use the request form and we'll get back to you.",
  "footer.contactForm": "Contact us",

  // auth / login
  "login.title": "Sign in to your account",
  "login.subtitle": "Sign in with Google to request cleanings and track them.",
  "login.continueGoogle": "Continue with Google",
  "login.connecting": "Connecting…",
  "login.backToSite": "← Back to site",
  "login.firebaseNotConfigured": "Firebase is not connected yet.",
  "login.error.popupBlocked": "Your browser blocked the popup. Allow pop-ups and try again.",
  "login.error.network": "Network error. Check your connection.",
  "login.error.generic": "Could not sign in. Please try again.",
  "login.error.sessionExpired": "Your session expired. Please sign in again.",
  "login.noteQuote": "Requesting a quote does not confirm a booking. We'll contact you to confirm date and time.",

  // guards
  "guard.noAccess.title": "Account without panel access",
  "guard.noAccess.desc": "{email} is not an administrator. If you're a customer, go to your portal.",
  "guard.noAccess.portal": "Go to my portal",
  "guard.noAccess.logout": "Sign out",

  // formulario
  "form.title": "Request your cleaning",
  "form.subtitle":
    "Fill out the form and we'll contact you to confirm the date and time. You can track it from your portal.",
  "form.backHome": "← Back to home",
  "form.tipoServicio": "Service type",
  "form.frecuencia": "How often?",
  "form.frecuenciaHint": "We'll automatically schedule the next visit after each cleaning.",
  "form.nombre": "Full name",
  "form.nombre.ph": "Your name",
  "form.telefono": "Phone",
  "form.telefono.ph": "(617) 123-4567",
  "form.email": "Email",
  "form.direccion": "Address",
  "form.direccion.ph": "Street, number, city, references…",
  "form.ubicacion": "Map location",
  "form.fechaDeseada": "Preferred date",
  "form.horaDeseada": "Preferred time",
  "form.notas": "Additional notes",
  "form.notas.ph": "Tell us any details (pets, access, priority areas…)",
  "form.submit": "Request cleaning",
  "form.consent": "By submitting you agree that we contact you to coordinate your service.",
  "form.error.generic": "We couldn't send your request. Please try again or contact us.",
  "form.error.session": "Your session expired. Please sign in again.",
  "form.quoteNote": "Requesting a quote does not confirm a booking. We'll contact you to confirm.",

  // confirmacion
  "confirm.title": "Request received!",
  "confirm.body":
    "Thank you, {nombre}. We'll get in touch soon to confirm your cleaning. You can track its status from your portal.",
  "confirm.servicio": "Service",
  "confirm.frecuencia": "Frequency",
  "confirm.fecha": "Date",
  "confirm.hora": "Time",
  "confirm.verSolicitudes": "View my requests",
  "confirm.whatsapp": "WhatsApp",
  "confirm.loading": "Loading your request…",
  "confirm.noId": "No request ID was provided. Please submit the form again.",
  "confirm.notFound": "We couldn't find this request or it doesn't belong to your account.",
  "confirm.error": "We couldn't load your request. Please try again.",
  "confirm.retry": "Retry",
  "confirm.backToForm": "← Back to request form",

  // resumen solicitud
  "resumen.title": "Request details",
  "resumen.cliente": "Customer",
  "resumen.tipoServicio": "Service type",
  "resumen.frecuencia": "Frequency",
  "resumen.fecha": "Date",
  "resumen.hora": "Time",
  "resumen.nuevaFecha": "Proposed new date",
  "resumen.propuestaPor": "(proposed by {actor})",
  "resumen.direccion": "Address",
  "resumen.verMapa": "View on map",
  "resumen.correo": "Email",
  "resumen.notas": "Notes",
  "resumen.motivoRechazo": "Rejection reason",
  "resumen.motivo": "Reason",
  "resumen.creada": "Created",
  "resumen.actualizada": "Updated",
  "resumen.actor.admin": "Golden Shine",
  "resumen.actor.cliente": "the customer",

  // acciones solicitud
  "acciones.title": "Actions",
  "acciones.motivo": "Reason (optional)",
  "acciones.motivo.ph": "e.g. No availability on that date.",
  "acciones.nuevaFecha": "New date",
  "acciones.nuevaHora": "New time",
  "acciones.nota": "Note (optional)",
  "acciones.nota.ph": "Reason for the change",
  "acciones.confirmarRechazo": "Confirm rejection",
  "acciones.enviarPropuesta": "Send proposal",
  "acciones.volver": "Back",
  "acciones.error": "Could not complete the action. Please try again.",
  "acciones.confirmCancel": "Are you sure you want to cancel this request?",
  "acciones.confirmRejectProp": "Reject the proposal and keep the previous date?",
  "acciones.cancelCliente": "Cancelled by the customer",
  "acciones.cancelAdmin": "Cancelled by Golden Shine",
  "acciones.aviso.espera": "Waiting for the other party to confirm.",
  "acciones.aviso.cliente": "Golden Shine proposes a new date. Do you accept?",
  "acciones.aviso.admin": "The customer requests another date. Do you accept?",

  // portal
  "portal.badge": "My portal",
  "portal.hello": "Hi, {nombre}",
  "portal.request": "Request",
  "portal.logout": "Sign out",
  "portal.title": "My cleanings",
  "portal.subtitle": "Request, track and reschedule your services.",
  "portal.requestCleaning": "Request cleaning",
  "portal.proximas": "Upcoming",
  "portal.historial": "History",
  "portal.vacio.proximas": "You have no active cleanings.",
  "portal.vacio.historial": "No history yet.",
  "portal.vacio.titulo": "You haven't requested any cleaning yet.",
  "portal.vacio.cta": "Request my first cleaning",
  "portal.error": "Could not load your requests. Check your connection.",
  "portal.detalle.title": "Your request",
  "portal.detalle.estado": "Status: {estado}",
  "portal.detalle.back": "← Back to my cleanings",
  "portal.detalle.notFound": "We couldn't find this request or it doesn't belong to your account.",
  "portal.detalle.ayuda": "Need help?",
  "portal.detalle.whatsapp": "Message us on WhatsApp",

  // admin
  "admin.badge": "Panel",
  "admin.logout": "Sign out",
  "admin.title": "Requests",
  "admin.subtitle": "Updates in real time. Click one to see details.",
  "admin.tab.todas": "All",
  "admin.error": "Could not load requests. Check your connection or Firestore indexes.",
  "admin.firebaseNotConfigured":
    "Firebase is not connected. Once credentials are set and users created, real requests will appear here in real time.",
  "admin.vacio": "No requests in this category.",
  "admin.col.nombre": "Name",
  "admin.col.servicio": "Service",
  "admin.col.fecha": "Preferred date",
  "admin.col.estado": "Status",
  "admin.col.creada": "Created",
  "admin.detalle.back": "← Back to list",
  "admin.detalle.estado": "Status: {estado}",
  "admin.detalle.notFound": "We couldn't find this request.",
  "admin.detalle.contactar": "Contact the customer",
  "admin.detalle.llamar": "Call · {telefono}",
  "admin.detalle.whatsapp": "WhatsApp",

  // mapa
  "mapa.hint": "Tap the map or drag the marker to indicate where the cleaning will be.",
  "mapa.usarUbicacion": "Use my location",
  "mapa.buscar": "Locating…",
  "mapa.marcada": "Location marked: {lat}, {lng}",
  "mapa.sinUbicacion": "No map location yet (optional).",
  "mapa.geoError": "Could not get your location. You can enter the address instead.",
  "mapa.geoUnsupported": "Geolocation is not available in this browser. Enter the address instead.",
  "mapa.fetchError": "Could not determine the address from the map. Please enter it manually.",

  // estados (traducción de ESTADO_LABEL)
  "estado.pendiente": "Pending",
  "estado.agendada": "Scheduled",
  "estado.reprogramacion": "To confirm",
  "estado.completada": "Completed",
  "estado.rechazada": "Rejected",
  "estado.cancelada": "Cancelled",

  // tipos servicio (traducción de TIPOS_SERVICIO labels)
  "tipo.residencial": "Residential Cleaning",
  "tipo.comercial": "Commercial Cleaning",
  "tipo.profunda": "Deep Cleaning",
  "tipo.post_construccion": "Post-Construction Cleaning",
  "tipo.mudanza": "Move In / Move Out Cleaning",
  "tipo.airbnb": "Airbnb & Short-Term Rental Cleaning",

  // frecuencias (traducción de FRECUENCIA_LABEL)
  "frec.unica": "One-time",
  "frec.semanal": "Weekly",
  "frec.quincenal": "Biweekly",
  "frec.mensual": "Monthly",
  "frec.unica.full": "One-time",
  "frec.semanal.full": "Every week",
  "frec.quincenal.full": "Every 2 weeks",
  "frec.mensual.full": "Every month",

  // errores validación (traducción de mensajes de zod en validators.ts)
  "val.nombre": "Enter your name",
  "val.nombre.max": "Maximum 80 characters",
  "val.telefono": "Invalid phone",
  "val.telefono.max": "Phone too long",
  "val.telefono.digitos": "Phone must have at least 8 digits",
  "val.email": "Enter your email",
  "val.email.invalid": "Invalid email",
  "val.tipoServicio": "Select a service type",
  "val.frecuencia": "Select a frequency",
  "val.direccion": "Enter the address or city",
  "val.direccion.max": "Maximum 200 characters",
  "val.fecha": "Select a date",
  "val.fecha.invalid": "The date can't be in the past or a Sunday (we work Mon–Sat)",
  "val.hora": "Select a time",
  "val.hora.format": "Invalid time format (HH:mm)",
  "val.hora.rango": "We work Monday to Saturday, 08:00 to 19:00",
  "val.notas.max": "Maximum 500 characters",
  "val.motivo.max": "Maximum 300 characters",
  "val.reprogramar": "Check the date and time.",

  // lifecycle acciones (traducción de ACCION_META labels)
  "accion.confirmar": "Confirm",
  "accion.proponer": "Propose another date",
  "accion.rechazar": "Reject",
  "accion.completar": "Mark as completed",
  "accion.cancelar": "Cancel",
  "accion.pedirReprogramar": "Request another date",
  "accion.aceptarPropuesta": "Accept new date",
  "accion.rechazarPropuesta": "Reject proposal",
};

const es: Catalog = {
  // common
  "common.loading": "Cargando…",
  "common.saving": "Guardando…",
  "common.sending": "Enviando…",
  "common.retry": "Reintentar",
  "common.back": "Volver",
  "common.cancel": "Cancelar",
  "common.confirm": "Confirmar",
  "common.optional": "(opcional)",
  "common.required": "Requerido",
  "common.or": "o",
  "common.close": "Cerrar",
  "common.open": "Abrir",
  "common.searching": "Buscando…",
  "common.notConfigured": "Aún no configurado",

  // brand
  "brand.home": "Golden Shine — Inicio",

  // nav
  "nav.services": "Servicios",
  "nav.howItWorks": "Cómo funciona",
  "nav.whyUs": "Por qué elegirnos",
  "nav.coverage": "Cobertura",
  "nav.myAccount": "Mi cuenta",
  "nav.requestCleaning": "Solicitar limpieza",
  "nav.openMenu": "Abrir menú",
  "nav.closeMenu": "Cerrar menú",
  "nav.language": "Idioma",
  "nav.english": "English",
  "nav.spanish": "Español",

  // hero
  "hero.badge": "Servicios de limpieza en Boston, MA",
  "hero.title": "Limpieza para tu hogar, mudanza o renta temporal",
  "hero.subtitle":
    "Cuéntanos qué necesitas y cuándo. Envía una solicitud de limpieza en línea y te contactaremos para coordinar los detalles.",
  "hero.ctaPrimary": "Solicitar limpieza",
  "hero.ctaSecondary": "Ver servicios",
  "hero.areaBoston": "Boston, Massachusetts",
  "hero.schedule": "Lun – Sáb · 8:00 am – 7:00 pm",

  // servicios
  "servicios.eyebrow": "Nuestros servicios",
  "servicios.title": "Limpieza para cada espacio",
  "servicios.sub": "Elige el servicio que necesitas. Todos con la misma atención al detalle.",
  "servicios.requestThis": "Solicitar este servicio",
  "servicios.residencial.title": "Limpieza Residencial",
  "servicios.residencial.desc":
    "Mantenimiento regular de tu casa o apartamento para que siempre luzca y se sienta fresco.",
  "servicios.residencial.0": "Cocina, baños y áreas comunes",
  "servicios.residencial.1": "Pisos, polvo y superficies",
  "servicios.residencial.2": "Frecuencia semanal, quincenal o mensual",
  "servicios.post_construccion.title": "Limpieza Post-Construcción",
  "servicios.post_construccion.desc":
    "Limpieza detallada tras renovaciones u obra, eliminando polvo y residuos de cada superficie.",
  "servicios.post_construccion.0": "Retiro de polvo fino de paredes, pisos y fixtures",
  "servicios.post_construccion.1": "Limpieza de ventanas, marcos y ventilaciones",
  "servicios.post_construccion.2": "Desinfección de superficies y retoque final",
  "servicios.profunda.title": "Limpieza Profunda",
  "servicios.profunda.desc":
    "Una limpieza a fondo, de arriba a abajo. Ideal para mudanzas o puesta a punto.",
  "servicios.profunda.0": "Detalle en rincones y zócalos",
  "servicios.profunda.1": "Interior de electrodomésticos",
  "servicios.profunda.2": "Desinfección de puntos de contacto",
  "servicios.recurrente.title": "Limpieza Recurrente",
  "servicios.recurrente.desc":
    "Define un plan semanal, quincenal o mensual y mantendremos tu espacio siempre limpio.",
  "servicios.recurrente.0": "Calendario personalizable",
  "servicios.recurrente.1": "Mismo equipo de confianza cuando sea posible",
  "servicios.recurrente.2": "Agendado automático de la próxima visita",
  "servicios.mudanza.title": "Limpieza de Mudanza",
  "servicios.mudanza.desc":
    "Empieza o termina tu mudanza en un espacio impecable. Limpieza integral para casas vacías o empacadas.",
  "servicios.mudanza.0": "Interior completo incluyendo gabinetes y cajones",
  "servicios.mudanza.1": "Limpieza interior de electrodomésticos",
  "servicios.mudanza.2": "Listo para nuevos ocupantes",
  "servicios.airbnb.title": "Limpieza Airbnb y Rentas Temporales",
  "servicios.airbnb.desc":
    "Limpieza confiable de turnover para hosts y administradores. Tus huéspedes llegan a un espacio impecable.",
  "servicios.airbnb.0": "Servicio de turnover rápido y confiable",
  "servicios.airbnb.1": "Apoyo en reposición de linos e insumos",
  "servicios.airbnb.2": "Horarios flexibles según check-in/check-out",
  "servicios.comercial.title": "Limpieza Comercial",
  "servicios.comercial.desc":
    "Oficinas, locales y consultorios siempre presentables para tu equipo y tus clientes.",
  "servicios.comercial.0": "Escritorios y áreas de trabajo",
  "servicios.comercial.1": "Recepción, baños y salas",
  "servicios.comercial.2": "Horarios flexibles, fuera de operación",

  // como funciona
  "comoFunciona.eyebrow": "Simple y rápido",
  "comoFunciona.title": "Cómo funciona",
  "comoFunciona.sub": "Tu espacio limpio está a solo 3 sencillos pasos.",
  "comoFunciona.1.title": "Solicitas en línea",
  "comoFunciona.1.desc": "Completas el formulario con el tipo de limpieza, fecha y hora deseada.",
  "comoFunciona.2.title": "Confirmamos fecha y hora",
  "comoFunciona.2.desc": "Te contactamos para confirmar los detalles y resolver dudas.",
  "comoFunciona.3.title": "Limpiamos",
  "comoFunciona.3.desc": "Nuestro equipo llega y deja tu espacio impecable.",

  // por que
  "porQue.eyebrow": "Por qué elegirnos",
  "porQue.title": "Una forma clara de solicitar limpieza",
  "porQue.puntualidad.title": "Puntualidad",
  "porQue.puntualidad.desc": "Comparte la fecha y hora que prefieres en tu solicitud.",
  "porQue.personal.title": "Servicios para distintas necesidades",
  "porQue.personal.desc": "Elige limpieza residencial, profunda, de mudanza o apoyo para rotación de Airbnb.",
  "porQue.productos.title": "Frecuencia recurrente",
  "porQue.productos.desc": "Elige una frecuencia única, semanal, quincenal o mensual.",
  "porQue.proceso.title": "Solicitud antes de confirmar",
  "porQue.proceso.desc": "Enviar una solicitud no confirma una reserva; te contactaremos para coordinarla.",

  // cobertura
  "cobertura.eyebrow": "Cobertura",
  "cobertura.title": "Zonas donde trabajamos",
  "cobertura.sub": "Atendemos Boston, Massachusetts. Envía tu solicitud y confirmaremos disponibilidad para tu dirección.",
  "cobertura.boston": "Boston",
  "cobertura.north": "North Shore",
  "cobertura.south": "South Shore",
  "cobertura.east": "East Boston y Waterfront",
  "cobertura.west": "MetroWest",
  "cobertura.cambridge": "Cambridge y Somerville",
  "cobertura.surrounding": "Áreas aledañas",

  // cta final
  "cta.title": "¿Listo para un espacio impecable?",
  "cta.sub": "Solicita tu limpieza en menos de un minuto. Te contactamos para confirmar fecha y hora.",
  "cta.button": "Solicitar limpieza",

  // audiencias (reemplaza testimonios no verificados)
  "audiencias.eyebrow": "A quién servimos",
  "audiencias.title": "Limpieza para cada situación",
  "audiencias.sub": "Servicio a la medida para familias, negocios, administradores y hosts.",
  "audiencias.familias.title": "Familias",
  "audiencias.familias.desc": "Limpieza recurrente o única para que disfrutes tu hogar sin preocuparte por las tareas.",
  "audiencias.negocios.title": "Negocios",
  "audiencias.negocios.desc": "Oficinas y locales siempre presentables con horarios flexibles fuera de tu operación.",
  "audiencias.administradores.title": "Administradores",
  "audiencias.administradores.desc": "Limpieza confiable de turnover y mantenimiento en las propiedades que administras.",
  "audiencias.hosts.title": "Hosts de Airbnb",
  "audiencias.hosts.desc": "Servicio rápido de turnover para que cada huésped llegue a un espacio impecable.",

  // footer
  "footer.tagline": "Solicitudes de limpieza para hogares, mudanzas y rentas temporales en Boston, MA.",
  "footer.contact": "Contacto",
  "footer.info": "Información",
  "footer.links": "Enlaces",
  "footer.phone": "Teléfono",
  "footer.email": "Correo",
  "footer.whatsapp": "WhatsApp",
  "footer.schedule": "Horario",
  "footer.area": "Zona de servicio",
  "footer.requestCleaning": "Solicitar limpieza",
  "footer.services": "Servicios",
  "footer.staffAccess": "Acceso personal",
  "footer.rights": "Todos los derechos reservados.",
  "footer.contactMissing": "Contacto aún no configurado. Usa el formulario y te responderemos.",
  "footer.contactForm": "Contáctanos",

  // auth / login
  "login.title": "Ingresa a tu cuenta",
  "login.subtitle": "Inicia sesión con Google para solicitar limpiezas y darles seguimiento.",
  "login.continueGoogle": "Continuar con Google",
  "login.connecting": "Conectando…",
  "login.backToSite": "← Volver al sitio",
  "login.firebaseNotConfigured": "Firebase no está conectado todavía.",
  "login.error.popupBlocked": "El navegador bloqueó la ventana emergente. Permite pop-ups e intenta de nuevo.",
  "login.error.network": "Error de red. Verifica tu conexión.",
  "login.error.generic": "No se pudo iniciar sesión. Intenta de nuevo.",
  "login.error.sessionExpired": "Tu sesión expiró. Vuelve a iniciar sesión.",
  "login.noteQuote": "Solicitar una cotización no implica reserva confirmada. Te contactamos para confirmar fecha y hora.",

  // guards
  "guard.noAccess.title": "Cuenta sin acceso al panel",
  "guard.noAccess.desc": "{email} no es administrador. Si eres cliente, entra a tu portal.",
  "guard.noAccess.portal": "Ir a mi portal",
  "guard.noAccess.logout": "Cerrar sesión",

  // formulario
  "form.title": "Solicita tu limpieza",
  "form.subtitle":
    "Completa el formulario y te contactaremos para confirmar la fecha y hora. Podrás darle seguimiento desde tu portal.",
  "form.backHome": "← Volver al inicio",
  "form.tipoServicio": "Tipo de servicio",
  "form.frecuencia": "¿Con qué frecuencia?",
  "form.frecuenciaHint": "Agendaremos automáticamente la siguiente visita al completar cada limpieza.",
  "form.nombre": "Nombre completo",
  "form.nombre.ph": "Tu nombre",
  "form.telefono": "Teléfono",
  "form.telefono.ph": "(617) 123-4567",
  "form.email": "Correo",
  "form.direccion": "Dirección",
  "form.direccion.ph": "Calle, número, ciudad, referencias…",
  "form.ubicacion": "Ubicación en el mapa",
  "form.fechaDeseada": "Fecha deseada",
  "form.horaDeseada": "Hora deseada",
  "form.notas": "Notas adicionales",
  "form.notas.ph": "Cuéntanos cualquier detalle (mascotas, accesos, áreas prioritarias…)",
  "form.submit": "Solicitar limpieza",
  "form.consent": "Al enviar aceptas que te contactemos para coordinar tu servicio.",
  "form.error.generic": "No pudimos enviar tu solicitud. Intenta de nuevo o contáctanos.",
  "form.error.session": "Tu sesión expiró. Vuelve a iniciar sesión.",
  "form.quoteNote": "Solicitar una cotización no implica reserva confirmada. Te contactamos para confirmar.",

  // confirmacion
  "confirm.title": "¡Solicitud recibida!",
  "confirm.body":
    "Gracias, {nombre}. Nos pondremos en contacto pronto para confirmar tu limpieza. Puedes seguir su estado desde tu portal.",
  "confirm.servicio": "Servicio",
  "confirm.frecuencia": "Frecuencia",
  "confirm.fecha": "Fecha",
  "confirm.hora": "Hora",
  "confirm.verSolicitudes": "Ver mis solicitudes",
  "confirm.whatsapp": "WhatsApp",
  "confirm.loading": "Cargando tu solicitud…",
  "confirm.noId": "No se proporcionó un ID de solicitud. Envía el formulario de nuevo.",
  "confirm.notFound": "No encontramos esta solicitud o no pertenece a tu cuenta.",
  "confirm.error": "No pudimos cargar tu solicitud. Intenta de nuevo.",
  "confirm.retry": "Reintentar",
  "confirm.backToForm": "← Volver al formulario",

  // resumen solicitud
  "resumen.title": "Detalle de la solicitud",
  "resumen.cliente": "Cliente",
  "resumen.tipoServicio": "Tipo de servicio",
  "resumen.frecuencia": "Frecuencia",
  "resumen.fecha": "Fecha",
  "resumen.hora": "Hora",
  "resumen.nuevaFecha": "Nueva fecha propuesta",
  "resumen.propuestaPor": "(propuesta por {actor})",
  "resumen.direccion": "Dirección",
  "resumen.verMapa": "Ver en mapa",
  "resumen.correo": "Correo",
  "resumen.notas": "Notas",
  "resumen.motivoRechazo": "Motivo del rechazo",
  "resumen.motivo": "Motivo",
  "resumen.creada": "Creada",
  "resumen.actualizada": "Actualizada",
  "resumen.actor.admin": "Golden Shine",
  "resumen.actor.cliente": "el cliente",

  // acciones solicitud
  "acciones.title": "Acciones",
  "acciones.motivo": "Motivo (opcional)",
  "acciones.motivo.ph": "Ej. No tenemos disponibilidad en esa fecha.",
  "acciones.nuevaFecha": "Nueva fecha",
  "acciones.nuevaHora": "Nueva hora",
  "acciones.nota": "Nota (opcional)",
  "acciones.nota.ph": "Motivo del cambio",
  "acciones.confirmarRechazo": "Confirmar rechazo",
  "acciones.enviarPropuesta": "Enviar propuesta",
  "acciones.volver": "Volver",
  "acciones.error": "No se pudo completar la acción. Intenta de nuevo.",
  "acciones.confirmCancel": "¿Seguro que quieres cancelar esta solicitud?",
  "acciones.confirmRejectProp": "¿Rechazar la propuesta y mantener la fecha anterior?",
  "acciones.cancelCliente": "Cancelada por el cliente",
  "acciones.cancelAdmin": "Cancelada por Golden Shine",
  "acciones.aviso.espera": "Esperando confirmación de la otra parte.",
  "acciones.aviso.cliente": "Golden Shine propone una nueva fecha. ¿La aceptas?",
  "acciones.aviso.admin": "El cliente solicita otra fecha. ¿La aceptas?",

  // portal
  "portal.badge": "Mi portal",
  "portal.hello": "Hola, {nombre}",
  "portal.request": "Solicitar",
  "portal.logout": "Salir",
  "portal.title": "Mis limpiezas",
  "portal.subtitle": "Solicita, da seguimiento y reprograma tus servicios.",
  "portal.requestCleaning": "Solicitar limpieza",
  "portal.proximas": "Próximas",
  "portal.historial": "Historial",
  "portal.vacio.proximas": "No tienes limpiezas activas.",
  "portal.vacio.historial": "Aún no hay historial.",
  "portal.vacio.titulo": "Aún no has solicitado ninguna limpieza.",
  "portal.vacio.cta": "Solicitar mi primera limpieza",
  "portal.error": "No se pudieron cargar tus solicitudes. Revisa tu conexión.",
  "portal.detalle.title": "Tu solicitud",
  "portal.detalle.estado": "Estado: {estado}",
  "portal.detalle.back": "← Volver a mis limpiezas",
  "portal.detalle.notFound": "No encontramos esta solicitud o no pertenece a tu cuenta.",
  "portal.detalle.ayuda": "¿Necesitas ayuda?",
  "portal.detalle.whatsapp": "Escribirnos por WhatsApp",

  // admin
  "admin.badge": "Panel",
  "admin.logout": "Cerrar sesión",
  "admin.title": "Solicitudes",
  "admin.subtitle": "Se actualizan en tiempo real. Haz clic en una para ver el detalle.",
  "admin.tab.todas": "Todas",
  "admin.error": "No se pudieron cargar las solicitudes. Revisa tu conexión o los índices de Firestore.",
  "admin.firebaseNotConfigured":
    "Firebase no está conectado. Cuando se configuren las credenciales y se creen usuarios, aquí aparecerán las solicitudes reales en tiempo real.",
  "admin.vacio": "No hay solicitudes en esta categoría.",
  "admin.col.nombre": "Nombre",
  "admin.col.servicio": "Servicio",
  "admin.col.fecha": "Fecha deseada",
  "admin.col.estado": "Estado",
  "admin.col.creada": "Creada",
  "admin.detalle.back": "← Volver al listado",
  "admin.detalle.estado": "Estado: {estado}",
  "admin.detalle.notFound": "No encontramos esta solicitud.",
  "admin.detalle.contactar": "Contactar al cliente",
  "admin.detalle.llamar": "Llamar · {telefono}",
  "admin.detalle.whatsapp": "WhatsApp",

  // mapa
  "mapa.hint": "Toca el mapa o arrastra el marcador para indicar dónde será la limpieza.",
  "mapa.usarUbicacion": "Usar mi ubicación",
  "mapa.buscar": "Buscando…",
  "mapa.marcada": "Ubicación marcada: {lat}, {lng}",
  "mapa.sinUbicacion": "Aún sin ubicación en el mapa (opcional).",
  "mapa.geoError": "No se pudo obtener tu ubicación. Puedes ingresar la dirección.",
  "mapa.geoUnsupported": "La geolocalización no está disponible en este navegador. Ingresa la dirección.",
  "mapa.fetchError": "No se pudo determinar la dirección desde el mapa. Ingrésala manualmente.",

  // estados
  "estado.pendiente": "Pendiente",
  "estado.agendada": "Agendada",
  "estado.reprogramacion": "Por confirmar",
  "estado.completada": "Completada",
  "estado.rechazada": "Rechazada",
  "estado.cancelada": "Cancelada",

  // tipos servicio
  "tipo.residencial": "Limpieza Residencial",
  "tipo.comercial": "Limpieza Comercial",
  "tipo.profunda": "Limpieza Profunda",
  "tipo.post_construccion": "Limpieza Post-Construcción",
  "tipo.mudanza": "Limpieza de Mudanza",
  "tipo.airbnb": "Limpieza Airbnb y Rentas Temporales",

  // frecuencias
  "frec.unica": "Única",
  "frec.semanal": "Semanal",
  "frec.quincenal": "Quincenal",
  "frec.mensual": "Mensual",
  "frec.unica.full": "Una sola vez",
  "frec.semanal.full": "Cada semana",
  "frec.quincenal.full": "Cada 2 semanas",
  "frec.mensual.full": "Cada mes",

  // errores validación
  "val.nombre": "Ingresa tu nombre",
  "val.nombre.max": "Máximo 80 caracteres",
  "val.telefono": "Teléfono inválido",
  "val.telefono.max": "Teléfono demasiado largo",
  "val.telefono.digitos": "El teléfono debe tener al menos 8 dígitos",
  "val.email": "Ingresa tu correo",
  "val.email.invalid": "Correo inválido",
  "val.tipoServicio": "Selecciona un tipo de servicio",
  "val.frecuencia": "Selecciona una frecuencia",
  "val.direccion": "Ingresa la dirección o ciudad",
  "val.direccion.max": "Máximo 200 caracteres",
  "val.fecha": "Selecciona una fecha",
  "val.fecha.invalid": "La fecha no puede ser pasada ni domingo (atendemos lun–sáb)",
  "val.hora": "Selecciona una hora",
  "val.hora.format": "Formato de hora inválido (HH:mm)",
  "val.hora.rango": "Atendemos de lunes a sábado, 08:00 a 19:00",
  "val.notas.max": "Máximo 500 caracteres",
  "val.motivo.max": "Máximo 300 caracteres",
  "val.reprogramar": "Revisa la fecha y hora.",

  // lifecycle acciones
  "accion.confirmar": "Confirmar",
  "accion.proponer": "Proponer otra fecha",
  "accion.rechazar": "Rechazar",
  "accion.completar": "Marcar completada",
  "accion.cancelar": "Cancelar",
  "accion.pedirReprogramar": "Pedir otra fecha",
  "accion.aceptarPropuesta": "Aceptar nueva fecha",
  "accion.rechazarPropuesta": "Rechazar propuesta",
};

const CATALOGS: Record<Locale, Catalog> = { en, es };

// ---------------------------------------------------------------------------
// Mapa de traducción de mensajes sueltos en español (para libs/catálogos)
// ---------------------------------------------------------------------------

/**
 * Tabla de traducción de mensajes en español que provienen de archivos que no
 * podemos modificar (validators.ts, lifecycle.ts, solicitudes.ts). La clave es
 * el texto exacto en español; el valor es la traducción al inglés. Si un texto
 * no aparece aquí, `translateText` devuelve el original.
 */
const ES_TO_EN: Record<string, string> = {
  // validators.ts
  "Ingresa tu nombre": "Enter your name",
  "Máximo 80 caracteres": "Maximum 80 characters",
  "Teléfono inválido": "Invalid phone",
  "Teléfono demasiado largo": "Phone too long",
  "El teléfono debe tener al menos 8 dígitos": "Phone must have at least 8 digits",
  "Ingresa tu correo": "Enter your email",
  "Correo inválido": "Invalid email",
  "Selecciona un tipo de servicio": "Select a service type",
  "Selecciona una frecuencia": "Select a frequency",
  "Ingresa la dirección o ciudad": "Enter the address or city",
  "Máximo 200 caracteres": "Maximum 200 characters",
  "Selecciona una fecha": "Select a date",
  "La fecha no puede ser pasada ni domingo (atendemos lun–sáb)":
    "The date can't be in the past or a Sunday (we work Mon–Sat)",
  "Selecciona una hora": "Select a time",
  "Formato de hora inválido (HH:mm)": "Invalid time format (HH:mm)",
  "Atendemos de lunes a sábado, 08:00 a 19:00":
    "We work Monday to Saturday, 08:00 to 19:00",
  "Máximo 500 caracteres": "Maximum 500 characters",
  "Máximo 300 caracteres": "Maximum 300 characters",
  "Revisa la fecha y hora.": "Check the date and time.",

  // lifecycle.ts — ACCION_META labels
  Confirmar: "Confirm",
  "Proponer otra fecha": "Propose another date",
  Rechazar: "Reject",
  "Marcar completada": "Mark as completed",
  Cancelar: "Cancel",
  "Pedir otra fecha": "Request another date",
  "Aceptar nueva fecha": "Accept new date",
  "Rechazar propuesta": "Reject proposal",
  "Esperando confirmación de la otra parte.": "Waiting for the other party to confirm.",
  "Golden Shine propone una nueva fecha. ¿La aceptas?":
    "Golden Shine proposes a new date. Do you accept?",
  "El cliente solicita otra fecha. ¿La aceptas?":
    "The customer requests another date. Do you accept?",

  // solicitudes.ts — errores
  "La solicitud no existe.": "The request does not exist.",
  "No hay propuesta que aceptar.": "There is no proposal to accept.",
  "No puedes aceptar tu propia propuesta.": "You cannot accept your own proposal.",
  "La propuesta tiene una fecha u hora inválida.": "The proposal has an invalid date or time.",
  "No hay propuesta vigente que aceptar.": "There is no active proposal to accept.",
  "No hay propuesta que rechazar.": "There is no proposal to reject.",
  "No puedes rechazar tu propia propuesta.": "You cannot reject your own proposal.",
  "No hay propuesta vigente que rechazar.": "There is no active proposal to reject.",
  "La fecha propuesta no es válida (no domingos).": "The proposed date is invalid (no Sundays).",
  "La hora propuesta debe estar entre 08:00 y 19:00 (lun–sáb).":
    "The proposed time must be between 08:00 and 19:00 (Mon–Sat).",

  // tipos/frecuencias/estados de @/types (labels en español)
  "Limpieza Residencial": "Residential Cleaning",
  "Limpieza Comercial": "Commercial Cleaning",
  "Limpieza Profunda": "Deep Cleaning",
  "Limpieza Post-Construcción": "Post-Construction Cleaning",
  "Limpieza de Mudanza": "Move In / Move Out Cleaning",
  "Limpieza Airbnb y Rentas Temporales": "Airbnb & Short-Term Rental Cleaning",
  "Una sola vez": "One-time",
  Semanal: "Weekly",
  Quincenal: "Biweekly",
  Mensual: "Monthly",
  Pendiente: "Pending",
  Agendada: "Scheduled",
  "Por confirmar": "To confirm",
  Completada: "Completed",
  Rechazada: "Rejected",
  Cancelada: "Cancelled",
  "Única": "One-time",
  "Cada semana": "Every week",
  "Cada 2 semanas": "Every 2 weeks",
  "Cada mes": "Every month",
};

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function interpolate(msg: Msg, params?: Record<string, string | number>): string {
  if (typeof msg === "function") return msg(params ?? {});
  if (!params) return msg;
  return msg.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  );
}

function resolveCatalog(locale: Locale): Catalog {
  return CATALOGS[locale] ?? CATALOGS[DEFAULT_LOCALE];
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {
    // localStorage puede estar bloqueado; usar default.
  }
  return DEFAULT_LOCALE;
}

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  /** Locale inicial (tests). Si se omite, lee de localStorage o default. */
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? getInitialLocale());

  // Persistir el locale inicial si se pasó explícitamente (tests).
  useEffect(() => {
    if (initialLocale) {
      try {
        window.localStorage.setItem(STORAGE_KEY, initialLocale);
      } catch {
        // ignore
      }
    }
  }, [initialLocale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // Ignorar si localStorage no está disponible.
    }
  }, []);

  // Sincronizar <html lang> y metadatos al cambiar de idioma.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const catalog = resolveCatalog(locale);
      const msg = catalog[key];
      if (msg === undefined) {
        // Fallback al locale por defecto si falta la clave.
        const fallback = resolveCatalog(DEFAULT_LOCALE)[key];
        if (fallback !== undefined) return interpolate(fallback, params);
        // Último recurso: devolver la clave (facilita detectar claves faltantes).
        return key;
      }
      return interpolate(msg, params);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation debe usarse dentro de <I18nProvider>");
  return ctx;
}

/** Hook ligero: devuelve solo el locale activo. */
export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) return DEFAULT_LOCALE;
  return ctx.locale;
}

// ---------------------------------------------------------------------------
// translateText: traduce un mensaje en español suelto al locale activo
// ---------------------------------------------------------------------------

/**
 * Traduce un texto en español (de libs/catálogos que no se pueden modificar)
 * al locale indicado. Si el locale es "es" o no hay traducción conocida,
 * devuelve el texto original.
 *
 * Uso típico: `translateText(error.message)` dentro de un componente que ya
 * tiene acceso al contexto vía `useTranslation().locale`.
 */
export function translateText(esText: string, locale: Locale = DEFAULT_LOCALE): string {
  if (locale === "es") return esText;
  if (locale === "en") {
    return ES_TO_EN[esText] ?? esText;
  }
  return esText;
}

// ---------------------------------------------------------------------------
// Helpers de catálogo para tipos de @/types (sin modificar @/types)
// ---------------------------------------------------------------------------

import type { EstadoSolicitud, Frecuencia, TipoServicio } from "@/types";

/** Traduce un TipoServicio al locale activo. */
export function tipoServicioLabel(tipo: TipoServicio, locale: Locale = DEFAULT_LOCALE): string {
  const key = `tipo.${tipo}`;
  const catalog = resolveCatalog(locale);
  const msg = catalog[key];
  return typeof msg === "string" ? msg : tipo;
}

/** Traduce una Frecuencia al locale activo (forma corta). */
export function frecuenciaLabel(frec: Frecuencia, locale: Locale = DEFAULT_LOCALE): string {
  const key = `frec.${frec}`;
  const catalog = resolveCatalog(locale);
  const msg = catalog[key];
  return typeof msg === "string" ? msg : frec;
}

/** Traduce una Frecuencia al locale activo (forma larga). */
export function frecuenciaLabelFull(frec: Frecuencia, locale: Locale = DEFAULT_LOCALE): string {
  const key = `frec.${frec}.full`;
  const catalog = resolveCatalog(locale);
  const msg = catalog[key];
  return typeof msg === "string" ? msg : frec;
}

/** Traduce un EstadoSolicitud al locale activo. */
export function estadoLabel(estado: EstadoSolicitud, locale: Locale = DEFAULT_LOCALE): string {
  const key = `estado.${estado}`;
  const catalog = resolveCatalog(locale);
  const msg = catalog[key];
  return typeof msg === "string" ? msg : estado;
}

/** Traduce una AccionId (de lifecycle.ts) al locale activo. */
export function accionLabel(accion: string, locale: Locale = DEFAULT_LOCALE): string {
  const key = `accion.${accion}`;
  const catalog = resolveCatalog(locale);
  const msg = catalog[key];
  return typeof msg === "string" ? msg : translateText(accion, locale);
}
