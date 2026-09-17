import { test, expect } from "@playwright/test";

/**
 * Smoke test de infraestructura Playwright.
 * Verifica que el webServer levanta y la landing carga.
 */
test("la landing carga y muestra el hero (EN default)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Golden Shine/i);
  await expect(page.getByRole("heading", { name: /Cleaning for your home, move, or short-term rental/i })).toBeVisible();
});
