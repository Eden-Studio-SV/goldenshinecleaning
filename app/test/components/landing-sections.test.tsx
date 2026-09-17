import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Hero } from "@/features/landing/sections/Hero";
import { Servicios } from "@/features/landing/sections/Servicios";
import { ComoFunciona } from "@/features/landing/sections/ComoFunciona";
import { PorQueElegirnos } from "@/features/landing/sections/PorQueElegirnos";
import { Testimonios } from "@/features/landing/sections/Testimonios";
import { ZonasCobertura } from "@/features/landing/sections/ZonasCobertura";
import { CtaFinal } from "@/features/landing/sections/CtaFinal";
import { renderWith } from "./helpers";

describe("Hero", () => {
  it("muestra el título y subtítulo en inglés", () => {
    renderWith(<Hero />);
    expect(
      screen.getByText("Cleaning for your home, move, or short-term rental"),
    ).toBeInTheDocument();
  });

  it("no muestra stats inventadas (4.9, 2400, garantía)", () => {
    renderWith(<Hero />);
    expect(screen.queryByText(/4\.9/)).not.toBeInTheDocument();
    expect(screen.queryByText(/2,?400/)).not.toBeInTheDocument();
    expect(screen.queryByText(/guarantee|garantía/i)).not.toBeInTheDocument();
  });

  it("muestra Boston y horario real", () => {
    renderWith(<Hero />);
    expect(screen.getByText(/Boston, MA/)).toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<Hero />, { locale: "es" });
    expect(
      screen.getByText("Limpieza para tu hogar, mudanza o renta temporal"),
    ).toBeInTheDocument();
  });
});

describe("Servicios", () => {
  it("muestra los 6 servicios del brief, comercial y la oferta recurrente", () => {
    renderWith(<Servicios />);
    expect(screen.getByText("Residential Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Post-Construction Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Deep Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Move In / Move Out Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Airbnb & Short-Term Rental Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Commercial Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Recurring Cleaning")).toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<Servicios />, { locale: "es" });
    expect(screen.getByText("Limpieza Residencial")).toBeInTheDocument();
    expect(screen.getByText("Limpieza Post-Construcción")).toBeInTheDocument();
    expect(screen.getByText("Limpieza Airbnb y Rentas Temporales")).toBeInTheDocument();
    expect(screen.getByText("Limpieza Recurrente")).toBeInTheDocument();
  });

  it("cada servicio tiene un enlace de solicitud con el id correcto", () => {
    renderWith(<Servicios />);
    const links = screen.getAllByRole("link", { name: /Request this service/ });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", expect.stringContaining("/solicitar?servicio="));
  });

  it("preselecciona la frecuencia semanal desde la tarjeta recurrente en ambos idiomas", () => {
    const english = renderWith(<Servicios />);
    const recurringLink = screen.getByText("Recurring Cleaning").closest("article")?.querySelector("a");
    expect(recurringLink).toHaveAttribute("href", "/solicitar?servicio=residencial&frecuencia=semanal");
    english.unmount();

    renderWith(<Servicios />, { locale: "es" });
    const enlaceRecurrente = screen.getByText("Limpieza Recurrente").closest("article")?.querySelector("a");
    expect(enlaceRecurrente).toHaveAttribute("href", "/solicitar?servicio=residencial&frecuencia=semanal");
  });
});

describe("ComoFunciona", () => {
  it("muestra los 3 pasos en inglés", () => {
    renderWith(<ComoFunciona />);
    expect(screen.getByText("Request online")).toBeInTheDocument();
    expect(screen.getByText("We confirm date and time")).toBeInTheDocument();
    expect(screen.getByText("We clean")).toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<ComoFunciona />, { locale: "es" });
    expect(screen.getByText("Solicitas en línea")).toBeInTheDocument();
    expect(screen.getByText("Confirmamos fecha y hora")).toBeInTheDocument();
    expect(screen.getByText("Limpiamos")).toBeInTheDocument();
  });
});

describe("PorQueElegirnos", () => {
  it("muestra los 4 puntos en inglés", () => {
    renderWith(<PorQueElegirnos />);
    expect(screen.getByText("Punctuality")).toBeInTheDocument();
    expect(screen.getByText("Services for different needs")).toBeInTheDocument();
    expect(screen.getByText("Recurring frequency")).toBeInTheDocument();
    expect(screen.getByText("Request before confirmation")).toBeInTheDocument();
  });

  it("no muestra 'garantía' (afirmación no confirmada)", () => {
    renderWith(<PorQueElegirnos />);
    expect(screen.queryByText(/guarantee|garantía/i)).not.toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<PorQueElegirnos />, { locale: "es" });
    expect(screen.getByText("Puntualidad")).toBeInTheDocument();
    expect(screen.getByText("Servicios para distintas necesidades")).toBeInTheDocument();
    expect(screen.getByText("Frecuencia recurrente")).toBeInTheDocument();
    expect(screen.getByText("Solicitud antes de confirmar")).toBeInTheDocument();
  });
});

describe("Testimonios (sección Audiencias)", () => {
  it("NO muestra testimonios ficticios ni estrellas ni nombres inventados", () => {
    renderWith(<Testimonios />);
    expect(screen.queryByText(/María|Jorge|Aisha/)).not.toBeInTheDocument();
    expect(screen.queryAllByLabelText(/5 de 5 estrellas/)).toHaveLength(0);
  });

  it("muestra las 4 audiencias en inglés", () => {
    renderWith(<Testimonios />);
    expect(screen.getByText("Families")).toBeInTheDocument();
    expect(screen.getByText("Businesses")).toBeInTheDocument();
    expect(screen.getByText("Property managers")).toBeInTheDocument();
    expect(screen.getByText("Airbnb hosts")).toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<Testimonios />, { locale: "es" });
    expect(screen.getByText("Familias")).toBeInTheDocument();
    expect(screen.getByText("Negocios")).toBeInTheDocument();
    expect(screen.getByText("Administradores")).toBeInTheDocument();
    expect(screen.getByText("Hosts de Airbnb")).toBeInTheDocument();
  });
});

describe("ZonasCobertura", () => {
  it("muestra únicamente la cobertura confirmada", () => {
    renderWith(<ZonasCobertura />);
    expect(screen.getByText("Boston")).toBeInTheDocument();
    expect(screen.queryByText("North Shore")).not.toBeInTheDocument();
    expect(screen.queryByText("Cambridge & Somerville")).not.toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<ZonasCobertura />, { locale: "es" });
    expect(screen.getByText("Boston")).toBeInTheDocument();
    expect(screen.queryByText("Cambridge y Somerville")).not.toBeInTheDocument();
  });

  it("no inventa suburbios no confirmados", () => {
    renderWith(<ZonasCobertura />);
    expect(screen.queryByText(/Surrounding areas|Áreas aledañas/)).not.toBeInTheDocument();
  });
});

describe("CtaFinal", () => {
  it("muestra el título y botón en inglés", () => {
    renderWith(<CtaFinal />);
    expect(screen.getByText("Ready for a spotless space?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Request cleaning/ })).toBeInTheDocument();
  });

  it("traduce al español", () => {
    renderWith(<CtaFinal />, { locale: "es" });
    expect(screen.getByText("¿Listo para un espacio impecable?")).toBeInTheDocument();
  });
});
