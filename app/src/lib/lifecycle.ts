import type { Actor, EstadoSolicitud, Solicitud } from "@/types";

/**
 * Máquina de estados del ciclo de vida de una solicitud.
 *
 * Modelo de reprogramación = "con confirmación": cuando el admin o el cliente
 * propone otra fecha/hora, la solicitud pasa a `reprogramacion` con una
 * `propuesta` (que guarda quién la hizo). La OTRA parte la acepta (se aplica la
 * nueva fecha y vuelve a `agendada`) o la rechaza (vuelve a `estadoPrevio` con
 * la fecha original). Las recurrencias se manejan en la capa de datos al
 * completar una visita.
 */
export type AccionId =
  | "confirmar"
  | "proponer"
  | "rechazar"
  | "completar"
  | "cancelar"
  | "pedirReprogramar"
  | "aceptarPropuesta"
  | "rechazarPropuesta";

export interface AccionMeta {
  label: string;
  /** Estilo del botón. */
  variant: "primary" | "gold" | "outline" | "ghost" | "peligro" | "exito";
  /** Pide al usuario una nueva fecha/hora (proponer / pedir reprogramar). */
  pideFechaHora?: boolean;
  /** Pide un motivo opcional (rechazar). */
  pideMotivo?: boolean;
  /** Confirmación adicional por ser destructiva/irreversible. */
  confirma?: boolean;
}

export const ACCION_META: Record<AccionId, AccionMeta> = {
  confirmar: { label: "Confirmar", variant: "exito" },
  proponer: { label: "Proponer otra fecha", variant: "outline", pideFechaHora: true },
  rechazar: { label: "Rechazar", variant: "peligro", pideMotivo: true, confirma: true },
  completar: { label: "Marcar completada", variant: "primary" },
  cancelar: { label: "Cancelar", variant: "peligro", confirma: true },
  pedirReprogramar: { label: "Pedir otra fecha", variant: "outline", pideFechaHora: true },
  aceptarPropuesta: { label: "Aceptar nueva fecha", variant: "exito" },
  rechazarPropuesta: { label: "Rechazar propuesta", variant: "peligro", confirma: true },
};

/**
 * Acciones disponibles para un rol dado el estado actual de la solicitud.
 * El cliente solo puede operar sobre sus propias solicitudes (lo garantizan
 * además las reglas de Firestore).
 */
export function accionesDisponibles(
  s: Pick<Solicitud, "estado" | "propuesta">,
  rol: Actor,
): AccionId[] {
  const propusoOtro = (autor: Actor) => s.propuesta?.por === autor;

  if (rol === "admin") {
    switch (s.estado) {
      case "pendiente":
        return ["confirmar", "proponer", "rechazar"];
      case "agendada":
        return ["completar", "proponer", "cancelar"];
      case "reprogramacion":
        // El admin responde si fue el cliente quien propuso.
        return propusoOtro("cliente")
          ? ["aceptarPropuesta", "rechazarPropuesta", "proponer", "cancelar"]
          : ["proponer", "cancelar"];
      default:
        return [];
    }
  }

  // rol === "cliente"
  switch (s.estado) {
    case "pendiente":
      return ["cancelar"];
    case "agendada":
      return ["pedirReprogramar", "cancelar"];
    case "reprogramacion":
      // El cliente responde si fue el admin quien propuso.
      return propusoOtro("admin")
        ? ["aceptarPropuesta", "rechazarPropuesta", "cancelar"]
        : ["cancelar"];
    default:
      return [];
  }
}

/** Texto de ayuda según el estado y quién debe actuar. */
export function mensajeEstado(s: Pick<Solicitud, "estado" | "propuesta">, rol: Actor): string | null {
  if (s.estado !== "reprogramacion" || !s.propuesta) return null;
  const esMia = s.propuesta.por === rol;
  if (esMia) return "Esperando confirmación de la otra parte.";
  return rol === "cliente"
    ? "Golden Shine propone una nueva fecha. ¿La aceptas?"
    : "El cliente solicita otra fecha. ¿La aceptas?";
}

/** A dónde vuelve la solicitud si se rechaza una propuesta. */
export function estadoAlRechazarPropuesta(s: Pick<Solicitud, "estadoPrevio">): EstadoSolicitud {
  return s.estadoPrevio ?? "agendada";
}
