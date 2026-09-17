import nodemailer, { type Transporter } from "nodemailer";
import type { MailConfig } from "./config.js";

const FROM = "goldenshinecleaning@edenstudio.dev";
const email = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

export function correoValido(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && email.test(value);
}

export function configValida(config: MailConfig): string | null {
  if (!correoValido(config.from) || config.from.toLowerCase() !== FROM) return "invalid_from";
  if (!correoValido(config.username) || !config.password || !config.host || /[\r\n]/.test(config.host)) return "invalid_smtp_config";
  if (config.port !== 465 && config.port !== 587) return "invalid_smtp_port";
  if (!Number.isInteger(config.maxAttempts) || config.maxAttempts < 1 || config.maxAttempts > 10) return "invalid_max_attempts";
  if (!Number.isInteger(config.perUserHour) || config.perUserHour < 1 || !Number.isInteger(config.globalHour) || config.globalHour < 1) return "invalid_limits";
  return null;
}

export function crearTransport(config: MailConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host, port: config.port, secure: config.port === 465, requireTLS: config.port === 587,
    auth: { user: config.username, pass: config.password }, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
    tls: { minVersion: "TLSv1.2" },
  });
}

export function esTransitorio(error: unknown): boolean {
  const item = error as { responseCode?: number; code?: string };
  return (typeof item.responseCode === "number" && item.responseCode >= 400 && item.responseCode < 500)
    || ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "ESOCKET", "EPIPE", "ENOTFOUND"].includes(item.code ?? "");
}
