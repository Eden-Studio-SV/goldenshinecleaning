import type { Timestamp } from "firebase/firestore";

/** Tipo de servicio de limpieza ofrecido. */
export type TipoServicio = "residencial" | "comercial" | "profunda";

/** Estado de gestión de una solicitud dentro del panel. */
export type EstadoSolicitud = "pendiente" | "agendada" | "completada";

/**
 * Documento de la colección `solicitudes` en Firestore.
 * `creadoEn` / `actualizadoEn` son Timestamps del servidor.
 */
export interface Solicitud {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  tipoServicio: TipoServicio;
  direccion: string;
  fechaDeseada: string; // YYYY-MM-DD
  horaDeseada: string; // HH:mm
  notas?: string;
  estado: EstadoSolicitud;
  creadoEn: Timestamp | null;
  actualizadoEn?: Timestamp | null;
}

/** Datos que el formulario público envía (sin metadatos de servidor). */
export interface SolicitudInput {
  nombre: string;
  telefono: string;
  email?: string;
  tipoServicio: TipoServicio;
  direccion: string;
  fechaDeseada: string;
  horaDeseada: string;
  notas?: string;
}

export const TIPOS_SERVICIO: { value: TipoServicio; label: string }[] = [
  { value: "residencial", label: "Limpieza Residencial" },
  { value: "comercial", label: "Limpieza Comercial" },
  { value: "profunda", label: "Limpieza Profunda" },
];

export const ESTADOS: EstadoSolicitud[] = ["pendiente", "agendada", "completada"];

export const ESTADO_LABEL: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  agendada: "Agendada",
  completada: "Completada",
};
