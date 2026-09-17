import { describe, it, expect } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider, useTranslation } from "@/i18n";

function TestNav() {
  const { t } = useTranslation();
  return <div data-testid="services">{t("nav.services")}</div>;
}

function TestSwitcher() {
  const { setLocale } = useTranslation();
  return <button onClick={() => setLocale("es")}>cambiar</button>;
}

describe("i18n re-render", () => {
  it("TestNav re-renderiza al setLocale", async () => {
    render(
      <MemoryRouter>
        <I18nProvider initialLocale="en">
          <TestNav />
          <TestSwitcher />
        </I18nProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("cambiar"));
    expect(await screen.findByTestId("services", {}, { timeout: 2000 })).toHaveTextContent("Servicios");
  });
});
