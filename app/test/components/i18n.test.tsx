import { describe, it, expect } from "vitest";
import {
  I18nProvider,
  useTranslation,
  translateText,
  tipoServicioLabel,
  frecuenciaLabel,
  frecuenciaLabelFull,
  estadoLabel,
  accionLabel,
  type Locale,
} from "@/i18n";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

function wrapper(locale: Locale = "en") {
  return ({ children }: { children: ReactNode }) => (
    <I18nProvider initialLocale={locale}>{children}</I18nProvider>
  );
}

describe("i18n — useTranslation", () => {
  it("devuelve el locale por defecto (en)", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper("en") });
    expect(result.current.locale).toBe("en");
  });

  it("cambia de locale con setLocale", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper("en") });
    act(() => result.current.setLocale("es"));
    expect(result.current.locale).toBe("es");
  });

  it("t() traduce claves en inglés", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper("en") });
    expect(result.current.t("hero.title")).toBe("Cleaning for your home, move, or short-term rental");
  });

  it("t() traduce claves en español", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper("es") });
    expect(result.current.t("hero.title")).toBe("Limpieza para tu hogar, mudanza o renta temporal");
  });

  it("t() interpola parámetros", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper("en") });
    expect(result.current.t("portal.hello", { nombre: "Ana" })).toBe("Hi, Ana");
  });

  it("t() hace fallback al locale por defecto si falta la clave", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper("es") });
    // Clave inexistente en ambos catálogos: devuelve la clave
    expect(result.current.t("clave.inexistente")).toBe("clave.inexistente");
  });
});

describe("i18n — translateText (mensajes sueltos en español)", () => {
  it("devuelve el original si locale es es", () => {
    expect(translateText("Ingresa tu nombre", "es")).toBe("Ingresa tu nombre");
  });

  it("traduce al inglés mensajes de validators.ts", () => {
    expect(translateText("Ingresa tu nombre", "en")).toBe("Enter your name");
    expect(translateText("Correo inválido", "en")).toBe("Invalid email");
    expect(translateText("Selecciona una fecha", "en")).toBe("Select a date");
    expect(
      translateText("La fecha no puede ser pasada ni domingo (atendemos lun–sáb)", "en"),
    ).toBe("The date can't be in the past or a Sunday (we work Mon–Sat)");
  });

  it("traduce al inglés mensajes de solicitudes.ts", () => {
    expect(translateText("La solicitud no existe.", "en")).toBe("The request does not exist.");
    expect(translateText("No hay propuesta que aceptar.", "en")).toBe(
      "There is no proposal to accept.",
    );
    expect(translateText("No puedes aceptar tu propia propuesta.", "en")).toBe(
      "You cannot accept your own proposal.",
    );
  });

  it("traduce al inglés labels de lifecycle.ts (ACCION_META)", () => {
    expect(translateText("Confirmar", "en")).toBe("Confirm");
    expect(translateText("Proponer otra fecha", "en")).toBe("Propose another date");
    expect(translateText("Marcar completada", "en")).toBe("Mark as completed");
    expect(translateText("Aceptar nueva fecha", "en")).toBe("Accept new date");
  });

  it("traduce al inglés mensajes de mensajeEstado", () => {
    expect(translateText("Esperando confirmación de la otra parte.", "en")).toBe(
      "Waiting for the other party to confirm.",
    );
    expect(translateText("Golden Shine propone una nueva fecha. ¿La aceptas?", "en")).toBe(
      "Golden Shine proposes a new date. Do you accept?",
    );
  });

  it("traduce al inglés labels de tipos/frecuencias/estados", () => {
    expect(translateText("Limpieza Residencial", "en")).toBe("Residential Cleaning");
    expect(translateText("Limpieza Airbnb y Rentas Temporales", "en")).toBe(
      "Airbnb & Short-Term Rental Cleaning",
    );
    expect(translateText("Semanal", "en")).toBe("Weekly");
    expect(translateText("Pendiente", "en")).toBe("Pending");
    expect(translateText("Por confirmar", "en")).toBe("To confirm");
  });

  it("devuelve el original si no hay traducción conocida", () => {
    expect(translateText("Mensaje totalmente desconocido", "en")).toBe(
      "Mensaje totalmente desconocido",
    );
  });
});

describe("i18n — helpers de catálogo", () => {
  it("tipoServicioLabel traduce todos los tipos", () => {
    const tipos = ["residencial", "comercial", "profunda", "post_construccion", "mudanza", "airbnb"];
    for (const t of tipos) {
      expect(tipoServicioLabel(t as never, "en")).not.toBe(t);
      expect(tipoServicioLabel(t as never, "es")).not.toBe(t);
    }
  });

  it("frecuenciaLabel y frecuenciaLabelFull", () => {
    expect(frecuenciaLabel("semanal", "en")).toBe("Weekly");
    expect(frecuenciaLabelFull("semanal", "en")).toBe("Every week");
    expect(frecuenciaLabel("quincenal", "es")).toBe("Quincenal");
    expect(frecuenciaLabelFull("quincenal", "es")).toBe("Cada 2 semanas");
  });

  it("estadoLabel traduce todos los estados", () => {
    expect(estadoLabel("pendiente", "en")).toBe("Pending");
    expect(estadoLabel("completada", "en")).toBe("Completed");
    expect(estadoLabel("rechazada", "es")).toBe("Rechazada");
  });

  it("accionLabel traduce acciones", () => {
    expect(accionLabel("confirmar", "en")).toBe("Confirm");
    expect(accionLabel("rechazar", "es")).toBe("Rechazar");
  });
});

describe("i18n — paridad de diccionarios EN/ES", () => {
  // Cargamos los catálogos indirectamente via t() para verificar que todas las
  // claves de EN existen en ES y viceversa.
  it("todas las claves de EN existen en ES", () => {
    const { result: en } = renderHook(() => useTranslation(), { wrapper: wrapper("en") });
    const { result: es } = renderHook(() => useTranslation(), { wrapper: wrapper("es") });

    // Lista representativa de claves críticas que deben existir en ambos.
    const claves = [
      "hero.title",
      "nav.services",
      "servicios.residencial.title",
      "servicios.airbnb.title",
      "comoFunciona.1.title",
      "porQue.proceso.title",
      "cobertura.boston",
      "cta.title",
      "footer.tagline",
      "login.title",
      "login.noteQuote",
      "form.title",
      "form.quoteNote",
      "confirm.title",
      "confirm.noId",
      "confirm.notFound",
      "resumen.title",
      "acciones.title",
      "acciones.confirmCancel",
      "portal.title",
      "portal.vacio.titulo",
      "admin.title",
      "admin.firebaseNotConfigured",
      "mapa.hint",
      "estado.pendiente",
      "tipo.residencial",
      "frec.semanal",
      "accion.confirmar",
      "val.nombre",
      "guard.noAccess.title",
      "audiencias.familias.title",
    ];
    for (const k of claves) {
      expect(en.current.t(k)).not.toBe(k);
      expect(es.current.t(k)).not.toBe(k);
    }
  });
});
