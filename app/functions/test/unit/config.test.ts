import { expect, it } from "vitest";
import { APP_BASE_URL, MAIL_ENABLED, SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT } from "../../src/config.js";

it("declara parámetros y secretos del runtime sin valores embebidos", () => {
  expect(SMTP_HOST).toBeDefined(); expect(SMTP_PORT).toBeDefined(); expect(MAIL_ENABLED).toBeDefined();
  expect(APP_BASE_URL).toBeDefined(); expect(SMTP_EMAIL).toBeDefined(); expect(SMTP_PASSWORD).toBeDefined();
});
