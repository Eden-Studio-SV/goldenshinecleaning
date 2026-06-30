import type { Timestamp } from "firebase/firestore";

/** Tipo de servicio de limpieza ofrecido. */
export type TipoServicio = "residencial" | "comercial" | "profunda";

/** Frecuencia de un plan de limpieza. `unica` = sin recurrencia. */
export type Frecuencia = "unica" | "semanal" | "quincenal" | "mensual";

/**
 * Estado de una solicitud dentro de su ciclo de vida.
 * - `pendiente`: el cliente la solicitó; espera acción del admin.
 * - `agendada`: confirmada con fecha y hora en firme.
 * - `reprogramacion`: hay una propuesta de nueva fecha/hora esperando que la
 *   otra parte la acepte o rechace (ver `propuesta`).
 * - `completada`: el servicio se realizó.
 * - `rechazada`: el admin la rechazó.
 * - `cancelada`: la canceló el cliente o el admin.
 */
export type EstadoSolicitud =
  | "pendiente"
  | "agendada"
  | "reprogramacion"
  | "completada"
  | "rechazada"
  | "cancelada";

/** Quién originó una propuesta de cambio de fecha/hora. */
export type Actor = "admin" | "cliente";

/** Propuesta de reprogramación pendiente de confirmación. */
export interface Propuesta {
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  por: Actor;
  motivo?: string;
  creadaEn?: Timestamp | null;
}

/** Coordenadas elegidas en el mapa (Leaflet). */
export interface Ubicacion {
  lat: number;
  lng: number;
}

/** Perfil de cliente (colección `clientes/{uid}`). */
export interface Cliente {
  id: string; // uid de Firebase Auth
  nombre: string;
  email: string;
  telefono?: string;
  creadoEn?: Timestamp | null;
  actualizadoEn?: Timestamp | null;
}

/**
 * Documento de la colección `solicitudes` en Firestore.
 * `creadoEn` / `actualizadoEn` son Timestamps del servidor.
 */
export interface Solicitud {
  id: string;
  clienteId: string;
  clienteEmail: string;
  nombre: string;
  telefono: string;
  email?: string;
  tipoServicio: TipoServicio;
  direccion: string;
  ubicacion?: Ubicacion | null;
  fechaDeseada: string; // YYYY-MM-DD
  horaDeseada: string; // HH:mm
  frecuencia: Frecuencia;
  serieId?: string | null; // agrupa las visitas de un plan recurrente
  notas?: string;
  estado: EstadoSolicitud;
  estadoPrevio?: EstadoSolicitud | null; // a dónde volver si se rechaza una propuesta
  propuesta?: Propuesta | null;
  motivo?: string | null; // razón de rechazo / cancelación
  creadoEn: Timestamp | null;
  actualizadoEn?: Timestamp | null;
}

/** Datos que el formulario envía al crear (sin metadatos de servidor). */
export interface SolicitudInput {
  nombre: string;
  telefono: string;
  email?: string;
  tipoServicio: TipoServicio;
  direccion: string;
  ubicacion?: Ubicacion | null;
  fechaDeseada: string;
  horaDeseada: string;
  frecuencia: Frecuencia;
  notas?: string;
}

export const TIPOS_SERVICIO: { value: TipoServicio; label: string }[] = [
  { value: "residencial", label: "Limpieza Residencial" },
  { value: "comercial", label: "Limpieza Comercial" },
  { value: "profunda", label: "Limpieza Profunda" },
];

export const FRECUENCIAS: { value: Frecuencia; label: string; corto: string }[] = [
  { value: "unica", label: "Una sola vez", corto: "Única" },
  { value: "semanal", label: "Cada semana", corto: "Semanal" },
  { value: "quincenal", label: "Cada 2 semanas", corto: "Quincenal" },
  { value: "mensual", label: "Cada mes", corto: "Mensual" },
];

export const FRECUENCIA_LABEL: Record<Frecuencia, string> = {
  unica: "Una sola vez",
  semanal: "Semanal",
  quincenal: "Quincenal",
  mensual: "Mensual",
};

/** Estados que el panel ofrece como filtros, en orden de flujo. */
export const ESTADOS: EstadoSolicitud[] = [
  "pendiente",
  "agendada",
  "reprogramacion",
  "completada",
  "rechazada",
  "cancelada",
];

export const ESTADO_LABEL: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  agendada: "Agendada",
  reprogramacion: "Por confirmar",
  completada: "Completada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
};

/** Estados “vivos” (próximas visitas) vs. cerrados (historial). */
export const ESTADOS_ACTIVOS: EstadoSolicitud[] = [
  "pendiente",
  "agendada",
  "reprogramacion",
];
export const ESTADOS_CERRADOS: EstadoSolicitud[] = [
  "completada",
  "rechazada",
  "cancelada",
];
