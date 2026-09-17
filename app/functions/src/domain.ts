export type Estado = "pendiente" | "agendada" | "reprogramacion" | "completada" | "rechazada" | "cancelada";
export type Locale = "en" | "es";

export interface Solicitud {
  clienteId?: unknown;
  clienteEmail?: unknown;
  nombre?: unknown;
  tipoServicio?: unknown;
  frecuencia?: unknown;
  direccion?: unknown;
  fechaDeseada?: unknown;
  horaDeseada?: unknown;
  notas?: unknown;
  estado?: unknown;
  estadoPrevio?: unknown;
  serieId?: unknown;
  locale?: unknown;
  propuesta?: { fecha?: unknown; hora?: unknown; por?: unknown; motivo?: unknown } | null;
}

export type MailEvent =
  | "receipt"
  | "next_visit_scheduled"
  | "confirmation"
  | "rejection"
  | "cancellation"
  | "reschedule_proposed"
  | "reschedule_requested"
  | "reschedule_accepted"
  | "reschedule_rejected"
  | "schedule_resolved"
  | "completion";

const estados = new Set<Estado>(["pendiente", "agendada", "reprogramacion", "completada", "rechazada", "cancelada"]);
export const esEstado = (value: unknown): value is Estado => typeof value === "string" && estados.has(value as Estado);

export function localeDe(solicitud: Solicitud): Locale {
  return solicitud.locale === "es" ? "es" : "en";
}

export function slot(solicitud: Solicitud | undefined): string | null {
  if (!solicitud || typeof solicitud.fechaDeseada !== "string" || typeof solicitud.horaDeseada !== "string") return null;
  return `${solicitud.fechaDeseada} ${solicitud.horaDeseada}`;
}

export function propuestaSlot(solicitud: Solicitud | undefined): string | null {
  const propuesta = solicitud?.propuesta;
  if (!propuesta || typeof propuesta.fecha !== "string" || typeof propuesta.hora !== "string") return null;
  return `${propuesta.fecha} ${propuesta.hora}`;
}
