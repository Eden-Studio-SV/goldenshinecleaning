import { createHash } from "node:crypto";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { FieldValue, getFirestore, type Firestore } from "firebase-admin/firestore";
import type { Transporter } from "nodemailer";
import type { MailConfig } from "./config.js";
import type { MailEvent, Solicitud } from "./domain.js";
import { correoValido, configValida, crearTransport, esTransitorio } from "./mail.js";
import { plantilla } from "./templates.js";

if (!getApps().length) initializeApp();

export class RetryableMailError extends Error { constructor(message: string) { super(message); this.name = "RetryableMailError"; } }
type LedgerState = "pending" | "sending" | "sent" | "failed" | "suppressed";
interface Claim { action: "send" | "skip"; ledgerId: string; attempts: number; }
export interface Dependencies { db?: Firestore; auth?: Auth; transport?: Transporter; now?: () => Date; }

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const ledgerId = (eventId: string, solicitudId: string, type: MailEvent) => hash(`${eventId}:${solicitudId}:${type}`);
const bucket = (now: Date) => now.toISOString().slice(0, 13);
const expiresAt = (now: Date) => new Date(now.getTime() + 30 * 24 * 60 * 60_000);
const uidHash = (uid: string) => hash(uid);

function portal(base: string, solicitudId: string): string | undefined {
  if (!base) return undefined;
  try {
    const url = new URL(`/portal/solicitudes/${encodeURIComponent(solicitudId)}`, base);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch { return undefined; }
}

async function claim(db: Firestore, id: string, type: MailEvent, uid: string, config: MailConfig, now: Date): Promise<Claim> {
  const ref = db.collection("mailDeliveries").doc(id);
  const hour = bucket(now);
  const globalRef = db.collection("mailRateLimits").doc(`${hour}:global`);
  const userRef = db.collection("mailRateLimits").doc(`${hour}:uid:${uidHash(uid)}`);
  return db.runTransaction(async (tx) => {
    // Todas las lecturas se realizan antes de escribir; los dos contadores son O(1).
    const [current, global, user] = await tx.getAll(ref, globalRef, userRef);
    const existing = current.data() as { state?: LedgerState; attempts?: number; leaseUntil?: { toDate(): Date } } | undefined;
    if (existing?.state === "sent" || existing?.state === "suppressed") return { action: "skip", ledgerId: id, attempts: existing.attempts ?? 0 };
    const lease = existing?.leaseUntil?.toDate();
    if (existing?.state === "sending" && lease && lease > now) throw new RetryableMailError("active_lease");
    const globalCount = Number(global.data()?.count ?? 0);
    const userCount = Number(user.data()?.count ?? 0);
    if (!current.exists && (userCount >= config.perUserHour || globalCount >= config.globalHour)) {
      tx.set(ref, { state: "suppressed", reason: "rate_limited", hourBucket: hour, uidHash: uidHash(uid), attempts: 0, expiresAt: expiresAt(now), updatedAt: FieldValue.serverTimestamp() });
      return { action: "skip", ledgerId: id, attempts: 0 };
    }
    const attempts = (existing?.attempts ?? 0) + 1;
    if (attempts > config.maxAttempts) {
      tx.set(ref, { state: "failed", reason: "max_attempts", attempts, expiresAt: expiresAt(now), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return { action: "skip", ledgerId: id, attempts };
    }
    if (!current.exists) {
      tx.set(globalRef, { count: globalCount + 1, hourBucket: hour, scope: "global", expiresAt: expiresAt(now), updatedAt: FieldValue.serverTimestamp() });
      tx.set(userRef, { count: userCount + 1, hourBucket: hour, scope: "uid", expiresAt: expiresAt(now), updatedAt: FieldValue.serverTimestamp() });
    }
    tx.set(ref, { state: "sending", type, hourBucket: hour, uidHash: uidHash(uid), attempts, leaseUntil: new Date(now.getTime() + 5 * 60_000), expiresAt: expiresAt(now), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return { action: "send", ledgerId: id, attempts };
  });
}

async function finalizar(db: Firestore, id: string, state: Exclude<LedgerState, "sending" | "pending">, reason?: string) {
  await db.collection("mailDeliveries").doc(id).set({ state, reason: reason ?? null, leaseUntil: FieldValue.delete(), expiresAt: expiresAt(new Date()), updatedAt: FieldValue.serverTimestamp(), ...(state === "sent" ? { sentAt: FieldValue.serverTimestamp() } : {}) }, { merge: true });
}

async function destinatario(auth: Auth, solicitud: Solicitud): Promise<string | null> {
  if (typeof solicitud.clienteId !== "string" || !correoValido(solicitud.clienteEmail)) return null;
  try {
    const user = await auth.getUser(solicitud.clienteId);
    return user.emailVerified && correoValido(user.email) && user.email.toLowerCase() === solicitud.clienteEmail.toLowerCase() ? user.email : null;
  } catch { return null; }
}

/** Procesador inyectable: no expone HTTP y nunca usa el correo incluido en el formulario. */
export type MailOutcome = { status: "sent" | "skipped" | "suppressed"; reason?: string };
export async function procesarCorreo(eventId: string, solicitudId: string, type: MailEvent, solicitud: Solicitud, config: MailConfig, deps: Dependencies = {}): Promise<MailOutcome> {
  const db = deps.db ?? getFirestore(); const auth = deps.auth ?? getAuth(); const now = deps.now?.() ?? new Date(); const id = ledgerId(eventId, solicitudId, type);
  if (!config.enabled) { await finalizar(db, id, "suppressed", "mail_disabled"); return { status: "suppressed", reason: "mail_disabled" }; }
  const invalidConfig = configValida(config);
  if (invalidConfig) { await finalizar(db, id, "suppressed", invalidConfig); return { status: "suppressed", reason: invalidConfig }; }
  const recipient = await destinatario(auth, solicitud);
  if (!recipient) { await finalizar(db, id, "suppressed", "unverified_recipient"); return { status: "suppressed", reason: "unverified_recipient" }; }
  const claimed = await claim(db, id, type, solicitud.clienteId as string, config, now);
  if (claimed.action === "skip") return { status: "skipped", reason: "deduplicated_or_limited" };
  const transport = deps.transport ?? crearTransport(config);
  const message = plantilla(type, solicitud, portal(config.appBaseUrl, solicitudId));
  try {
    await transport.sendMail({ from: config.from, to: recipient, subject: message.subject, text: message.text, html: message.html, messageId: `<${id}@edenstudio.dev>` });
    await finalizar(db, id, "sent");
    return { status: "sent" };
  } catch (error) {
    const reason = esTransitorio(error) ? "smtp_transient" : "smtp_permanent";
    await finalizar(db, id, esTransitorio(error) && claimed.attempts < config.maxAttempts ? "failed" : "suppressed", reason);
    if (esTransitorio(error) && claimed.attempts < config.maxAttempts) throw new RetryableMailError(reason);
    return { status: "suppressed", reason };
  }
}
