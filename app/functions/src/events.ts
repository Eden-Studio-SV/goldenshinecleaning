import { esEstado, type MailEvent, propuestaSlot, slot, type Solicitud } from "./domain.js";

/** Clasifica únicamente cambios de negocio; timestamps y campos decorativos no generan correo. */
export function clasificarEvento(before: Solicitud | undefined, after: Solicitud): MailEvent | null {
  if (!esEstado(after.estado)) return null;
  if (!before) {
    if (after.estado === "pendiente") return "receipt";
    return after.estado === "agendada" && typeof after.serieId === "string" && after.serieId ? "next_visit_scheduled" : null;
  }
  if (!esEstado(before.estado) || before.estado === after.estado) return null;
  if (before.estado === "pendiente" && after.estado === "agendada") return "confirmation";
  if (before.estado === "pendiente" && after.estado === "rechazada") return "rejection";
  if (["pendiente", "agendada", "reprogramacion"].includes(before.estado) && after.estado === "cancelada") return "cancellation";
  if (before.estado === "agendada" && after.estado === "reprogramacion") {
    return after.propuesta?.por === "admin" ? "reschedule_proposed" : after.propuesta?.por === "cliente" ? "reschedule_requested" : null;
  }
  if (before.estado === "reprogramacion" && after.estado === "agendada") {
    const previo = slot(before);
    const propuesto = propuestaSlot(before);
    const final = slot(after);
    if (!previo || !propuesto || !final || previo === propuesto) return "schedule_resolved";
    if (final === propuesto) return "reschedule_accepted";
    if (final === previo) return "reschedule_rejected";
    return "schedule_resolved";
  }
  if (before.estado === "agendada" && after.estado === "completada") return "completion";
  return null;
}
