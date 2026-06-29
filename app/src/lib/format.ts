import type { Timestamp } from "firebase/firestore";

/** Formatea una fecha ISO (YYYY-MM-DD) en español. */
export function formatFecha(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  if (!iso) return "—";
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(
      "es",
      opts ?? { day: "2-digit", month: "short", year: "numeric" },
    );
  } catch {
    return iso;
  }
}

/** Formatea un Timestamp de Firestore (fecha + hora) en español. */
export function formatTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return "—";
  try {
    return ts.toDate().toLocaleString("es", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}
