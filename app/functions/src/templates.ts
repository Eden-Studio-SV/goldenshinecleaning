import type { MailEvent, Solicitud } from "./domain.js";
import { localeDe } from "./domain.js";

const escape = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const limpio = (value: unknown) => String(value ?? "").replace(/[\r\n]/g, " ").trim();
const fecha = (solicitud: Solicitud, locale: "en" | "es") => {
  const date = typeof solicitud.fechaDeseada === "string" ? new Date(`${solicitud.fechaDeseada}T12:00:00Z`) : null;
  const day = date && !Number.isNaN(date.valueOf()) ? new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "long", timeZone: "America/New_York" }).format(date) : "";
  return `${day}${day && solicitud.horaDeseada ? " · " : ""}${limpio(solicitud.horaDeseada)}`;
};

const copy: Record<"en" | "es", Record<MailEvent, [string, string]>> = {
  en: {
    receipt: ["We received your cleaning request", "We received your request. This is not a confirmed booking."],
    next_visit_scheduled: ["Your next cleaning visit is scheduled", "Your next visit has been scheduled."], confirmation: ["Your cleaning request is scheduled", "Your cleaning request is scheduled."],
    rejection: ["Update on your cleaning request", "We are unable to schedule this request."], cancellation: ["Your cleaning request was cancelled", "This request is now cancelled."],
    reschedule_proposed: ["A new time has been proposed", "Golden Shine proposed a new time for your request."], reschedule_requested: ["We received your rescheduling request", "We received your request for a different time."],
    reschedule_accepted: ["Your new time is scheduled", "The proposed time is now scheduled."], reschedule_rejected: ["Your original time remains scheduled", "The proposed time was not applied; your previous scheduled time remains."],
    schedule_resolved: ["Schedule update", "Your schedule has been updated. Please review the current details."], completion: ["Your cleaning service is complete", "Your cleaning service has been marked complete."],
  },
  es: {
    receipt: ["Recibimos tu solicitud de limpieza", "Recibimos tu solicitud. Esto no confirma una reserva."],
    next_visit_scheduled: ["Tu próxima visita de limpieza está agendada", "Tu próxima visita ha sido agendada."], confirmation: ["Tu solicitud de limpieza está agendada", "Tu solicitud de limpieza está agendada."],
    rejection: ["Actualización de tu solicitud de limpieza", "No podemos agendar esta solicitud."], cancellation: ["Tu solicitud de limpieza fue cancelada", "Esta solicitud ahora está cancelada."],
    reschedule_proposed: ["Se propuso un nuevo horario", "Golden Shine propuso un nuevo horario para tu solicitud."], reschedule_requested: ["Recibimos tu solicitud de cambio", "Recibimos tu solicitud para cambiar el horario."],
    reschedule_accepted: ["Tu nuevo horario está agendado", "El horario propuesto ahora está agendado."], reschedule_rejected: ["Tu horario anterior sigue agendado", "El horario propuesto no se aplicó; tu horario anterior sigue vigente."],
    schedule_resolved: ["Actualización de horario", "Tu horario se actualizó. Revisa los detalles actuales."], completion: ["Tu servicio de limpieza está completado", "Tu servicio de limpieza fue marcado como completado."],
  },
};

export function plantilla(event: MailEvent, solicitud: Solicitud, portalUrl?: string) {
  const locale = localeDe(solicitud); const [subject, intro] = copy[locale][event]; const when = fecha(solicitud, locale);
  const name = limpio(solicitud.nombre); const service = limpio(solicitud.tipoServicio);
  const details = when ? `${locale === "es" ? "Fecha y hora" : "Date and time"}: ${when}` : "";
  const link = portalUrl ? `\n${locale === "es" ? "Ver detalles" : "View details"}: ${portalUrl}` : "";
  const text = `${name ? `${locale === "es" ? "Hola" : "Hello"} ${name},\n\n` : ""}${intro}\n${service ? `${locale === "es" ? "Servicio" : "Service"}: ${service}\n` : ""}${details}${link}\n\nGolden Shine`;
  return { subject, text, html: `<main style="font-family:Arial,sans-serif;color:#102a43"><h1 style="color:#b8860b">Golden Shine</h1><p>${escape(name ? `${locale === "es" ? "Hola" : "Hello"} ${name},` : "")}</p><p>${escape(intro)}</p>${service ? `<p><strong>${locale === "es" ? "Servicio" : "Service"}:</strong> ${escape(service)}</p>` : ""}${details ? `<p><strong>${locale === "es" ? "Fecha y hora" : "Date and time"}:</strong> ${escape(when)}</p>` : ""}${portalUrl ? `<p><a href="${escape(portalUrl)}">${locale === "es" ? "Ver detalles" : "View details"}</a></p>` : ""}</main>` };
}
