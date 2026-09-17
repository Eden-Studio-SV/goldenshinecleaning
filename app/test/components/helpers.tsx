import type { ComponentProps, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, type RenderOptions } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider, type Locale } from "@/i18n";
import "./setup";

/**
 * Helpers compartidos para pruebas de componentes.
 *
 * `renderWith` envuelve el componente con MemoryRouter (rutas controladas) e
 * I18nProvider (locale controlado vía localStorage). Centraliza el
 * boilerplate para que cada test sea conciso y consistente.
 */

interface RenderWithOptions {
  /** Ruta inicial para MemoryRouter. Default "/". */
  initialEntries?: ComponentProps<typeof MemoryRouter>["initialEntries"];
  /** Locale inicial para I18nProvider. Default "en". */
  locale?: Locale;
  /** RenderOptions adicionales. */
  renderOptions?: Omit<RenderOptions, "wrapper">;
}

/**
 * Wrapper que provee Router + i18n. El locale se controla vía localStorage
 * (que I18nProvider lee al inicializar). Usamos una key en el wrapper para
 * forzar el remount al cambiar de locale entre tests.
 */
export function makeWrapper(
  initialEntries: ComponentProps<typeof MemoryRouter>["initialEntries"] = ["/"],
  locale: Locale = "en",
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <HelmetProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <I18nProvider initialLocale={locale}>{children}</I18nProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
  };
}

export function renderWith(
  ui: ReactNode,
  { initialEntries = ["/"], locale = "en", renderOptions }: RenderWithOptions = {},
) {
  const wrapper = makeWrapper(initialEntries, locale);
  return render(ui, { wrapper, ...renderOptions });
}
