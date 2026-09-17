import { z } from "zod";

/**
 * Catálogos validados también por las reglas de Firestore y por el backend de
 * la SPA. Mantener en sync con `firestore.rules` (datosValidos) y con
 * `TIPOS_SERVICIO` / `FRECUENCIAS` de `@/types`.
 */
export const TIPOS_SERVICIO_VALIDOS = [
  "residencial",
  "comercial",
  "profunda",
  "post_construccion",
  "mudanza",
  "airbnb",
] as const;

export const FRECUENCIAS_VALIDAS = ["unica", "semanal", "quincenal", "mensual"] as const;

const BOSTON_TIME_ZONE = "America/New_York";

/** Fecha de calendario de Boston en formato YYYY-MM-DD, independiente del huso del navegador. */
export function hoyISO(ahora = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOSTON_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ahora);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value;
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

/** Evita que Date normalice fechas inexistentes (por ejemplo, 2026-02-30). */
export function esFechaISOValida(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  return fecha.getUTCFullYear() === y && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}

/**
 * Devuelve el día de la semana de una fecha ISO (YYYY-MM-DD) en zona horaria
 * local: 0 = domingo, 6 = sábado. Usado para evitar agendar domingos (Boston).
 */
export function diaSemanaISO(iso: string): number {
  if (!esFechaISOValida(iso)) return Number.NaN;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** true si la fecha ISO corresponde a un domingo (0). */
export function esDomingoISO(iso: string): boolean {
  return diaSemanaISO(iso) === 0;
}

const REGEX_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Valida que una hora `HH:mm` esté dentro del horario de operación
 * (lun–sáb, 08:00–19:00). Devuelve true para horas en punto o con minutos,
 * siempre que el instante esté dentro del rango inclusive.
 */
export function esHorarioValido(hora: string): boolean {
  if (!REGEX_HHMM.test(hora)) return false;
  const [h, m] = hora.split(":").map(Number);
  const minutos = h * 60 + m;
  return minutos >= 8 * 60 && minutos <= 19 * 60;
}

/** Refine de zod: fecha real, no pasada, y no domingo (Boston). */
function fechaAgendable(v: string): boolean {
  if (!esFechaISOValida(v)) return false;
  if (v < hoyISO()) return false;
  if (esDomingoISO(v)) return false;
  return true;
}

export const solicitudSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(80, "Máximo 80 caracteres"),
  telefono: z
    .string()
    .trim()
    .min(8, "Teléfono inválido")
    .max(30, "Teléfono demasiado largo")
    .refine((v) => v.replace(/\D/g, "").length >= 8, "El teléfono debe tener al menos 8 dígitos"),
  // Email obligatorio (era opcional): se requiere para confirmar la solicitud.
  email: z.string().trim().min(1, "Ingresa tu correo").email("Correo inválido").max(160),
  tipoServicio: z.enum(TIPOS_SERVICIO_VALIDOS, {
    errorMap: () => ({ message: "Selecciona un tipo de servicio" }),
  }),
  frecuencia: z.enum(FRECUENCIAS_VALIDAS, {
    errorMap: () => ({ message: "Selecciona una frecuencia" }),
  }),
  // Dirección o ciudad: se exige al menos una dirección con contenido útil.
  direccion: z
    .string()
    .trim()
    .min(5, "Ingresa la dirección o ciudad")
    .max(200, "Máximo 200 caracteres"),
  ubicacion: z
    .object({ lat: z.number(), lng: z.number() })
    .nullable()
    .optional(),
  fechaDeseada: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine(fechaAgendable, "La fecha no puede ser pasada ni domingo (atendemos lun–sáb)"),
  horaDeseada: z
    .string()
    .min(1, "Selecciona una hora")
    .refine(REGEX_HHMM.test.bind(REGEX_HHMM), "Formato de hora inválido (HH:mm)")
    .refine(esHorarioValido, "Atendemos de lunes a sábado, 08:00 a 19:00"),
  notas: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type SolicitudFormValues = z.infer<typeof solicitudSchema>;

/** Validación de una propuesta de nueva fecha/hora (reprogramación). */
export const reprogramarSchema = z.object({
  fecha: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine(fechaAgendable, "La fecha no puede ser pasada ni domingo (atendemos lun–sáb)"),
  hora: z
    .string()
    .min(1, "Selecciona una hora")
    .refine(REGEX_HHMM.test.bind(REGEX_HHMM), "Formato de hora inválido (HH:mm)")
    .refine(esHorarioValido, "Atendemos de lunes a sábado, 08:00 a 19:00"),
  motivo: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type ReprogramarFormValues = z.infer<typeof reprogramarSchema>;
