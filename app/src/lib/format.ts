import type { Timestamp } from "firebase/firestore";

/**
 * Formatea una fecha ISO (YYYY-MM-DD) en español (o el locale indicado).
 * El locale es opcional y por defecto `"es"` para no romper los usos
 * existentes que no lo pasan.
 */
export function formatFecha(
  iso: string,
  opts?: Intl.DateTimeFormatOptions,
  locale: string = "es",
): string {
  if (!iso) return "—";
  try {
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(
      locale,
      opts ?? { day: "2-digit", month: "short", year: "numeric" },
    );
  } catch {
    return iso;
  }
}

/**
 * Formatea un Timestamp de Firestore (fecha + hora) en español (o el locale
 * indicado). El locale es opcional para preservar los usos existentes.
 */
export function formatTimestamp(
  ts: Timestamp | null | undefined,
  locale: string = "es",
): string {
  if (!ts) return "—";
  try {
    return ts.toDate().toLocaleString(locale, {
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