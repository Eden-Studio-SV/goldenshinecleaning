import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { renderWith } from "./helpers";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  useMap: () => ({ getZoom: () => 13, setView: vi.fn() }),
  useMapEvents: () => null,
}));

vi.mock("leaflet", () => {
  const leaflet = {
    Icon: { Default: { prototype: {}, mergeOptions: vi.fn() } },
  };
  return { default: leaflet };
});

import { MapaUbicacion } from "@/components/ui/MapaUbicacion";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("MapaUbicacion", () => {
  it("expone el grupo del mapa y una alternativa cuando la geolocalización no está disponible", () => {
    const original = navigator.geolocation;
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
    try {
      renderWith(<MapaUbicacion value={null} onChange={vi.fn()} />);

      expect(screen.getByRole("group", { name: "Map location" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
      expect(screen.getByRole("alert")).toHaveTextContent("Enter the address instead");
    } finally {
      Object.defineProperty(navigator, "geolocation", { configurable: true, value: original });
    }
  });

  it("informa el error de geocodificación y conserva la selección manual", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const onChange = vi.fn();
    const onDireccion = vi.fn();
    const original = navigator.geolocation;
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success: (position: GeolocationPosition) => void) =>
          success({ coords: { latitude: 42.36, longitude: -71.06 } } as GeolocationPosition),
      },
    });

    try {
      renderWith(<MapaUbicacion value={null} onChange={onChange} onDireccion={onDireccion} />);
      fireEvent.click(screen.getByRole("button", { name: "Use my location" }));

      expect(onChange).toHaveBeenCalledWith({ lat: 42.36, lng: -71.06 });
      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("enter it manually"));
      expect(onDireccion).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(navigator, "geolocation", { configurable: true, value: original });
    }
  });
});
