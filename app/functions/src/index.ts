import { logger } from "firebase-functions";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { configActual, SMTP_EMAIL, SMTP_PASSWORD } from "./config.js";
import { clasificarEvento } from "./events.js";
import { RetryableMailError, procesarCorreo } from "./processor.js";
import type { Solicitud } from "./domain.js";

export const enviarCorreoSolicitud = onDocumentWritten({ document: "solicitudes/{solicitudId}", region: "us-east1", retry: true, secrets: [SMTP_EMAIL, SMTP_PASSWORD] }, async (event) => {
  const before = event.data?.before.exists ? event.data.before.data() as Solicitud : undefined;
  const after = event.data?.after.exists ? event.data.after.data() as Solicitud : undefined;
  if (!after) return;
  const type = clasificarEvento(before, after);
  if (!type) return;
  try {
    const result = await procesarCorreo(event.id, event.params.solicitudId, type, after, configActual());
    const metadata = { type, status: result.status, code: result.reason ?? "ok" };
    if (result.status === "suppressed") logger.warn("mail_event_suppressed", metadata);
    else logger.info("mail_event_processed", metadata);
  } catch (error) {
    if (error instanceof RetryableMailError) {
      logger.warn("mail_event_retry", { type, code: error.message });
      throw error;
    }
    logger.error("mail_event_failed", { type, code: "unexpected" });
    throw error;
  }
});
