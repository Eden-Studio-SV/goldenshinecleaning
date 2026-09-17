import { defineBoolean, defineInt, defineSecret, defineString } from "firebase-functions/params";

export const SMTP_HOST = defineString("SMTP_HOST");
export const SMTP_PORT = defineInt("SMTP_PORT", { default: 587 });
export const SMTP_EMAIL = defineSecret("SMTP_EMAIL");
export const SMTP_PASSWORD = defineSecret("SMTP_PASSWORD");
export const MAIL_FROM = defineString("MAIL_FROM", { default: "goldenshinecleaning@edenstudio.dev" });
export const MAIL_ENABLED = defineBoolean("MAIL_ENABLED", { default: false });
export const APP_BASE_URL = defineString("APP_BASE_URL", { default: "" });
export const MAIL_MAX_ATTEMPTS = defineInt("MAIL_MAX_ATTEMPTS", { default: 4 });
export const MAIL_PER_USER_HOUR = defineInt("MAIL_PER_USER_HOUR", { default: 10 });
export const MAIL_GLOBAL_HOUR = defineInt("MAIL_GLOBAL_HOUR", { default: 100 });

export interface MailConfig {
  enabled: boolean; host: string; port: number; username: string; password: string; from: string; appBaseUrl: string;
  maxAttempts: number; perUserHour: number; globalHour: number;
}

export function configActual(): MailConfig {
  return {
    enabled: MAIL_ENABLED.value(), host: SMTP_HOST.value(), port: SMTP_PORT.value(), username: SMTP_EMAIL.value(), password: SMTP_PASSWORD.value(),
    from: MAIL_FROM.value(), appBaseUrl: APP_BASE_URL.value(), maxAttempts: MAIL_MAX_ATTEMPTS.value(), perUserHour: MAIL_PER_USER_HOUR.value(), globalHour: MAIL_GLOBAL_HOUR.value(),
  };
}
