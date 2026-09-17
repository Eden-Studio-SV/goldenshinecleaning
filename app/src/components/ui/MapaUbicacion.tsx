import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, MapPin, AlertTriangle } from "lucide-react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import type { Ubicacion } from "@/types";
import { MAPA_DEFAULT } from "@/features/landing/content";
import { useTranslation } from "@/i18n";

// Arreglo del icono por defecto de Leaflet al empaquetar con Vite.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

/** Geocodificación inversa best-effort con Nominatim (OpenStreetMap, gratis). */
async function reverseGeocode(
  lat: number,
  lng: number,
  locale: string,
  signal?: AbortSignal,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${locale}&zoom=18`,
      { signal },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { display_name?: string };
    return data.display_name ?? null;
  } catch (e) {
    if ((e as Error).name === "AbortError") return null;
    return null;
  }
}

function ClickHandler({ onPick }: { onPick: (u: Ubicacion) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recentrar({ punto }: { punto: Ubicacion | null }) {
  const map = useMap();
  useEffect(() => {
    if (punto) map.setView([punto.lat, punto.lng], Math.max(map.getZoom(), 15));
  }, [punto, map]);
  return null;
}

interface Props {
  value: Ubicacion | null;
  onChange: (u: Ubicacion) => void;
  /** Recibe una dirección aproximada al elegir un punto (best-effort). */
  onDireccion?: (texto: string) => void;
}

export function MapaUbicacion({ value, onChange, onDireccion }: Props) {
  const { t, locale } = useTranslation();
  const [buscando, setBuscando] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const centro = value ?? MAPA_DEFAULT.centro;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const elegir = (u: Ubicacion) => {
    onChange(u);
    if (onDireccion) {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      reverseGeocode(u.lat, u.lng, locale, ac.signal)
        .then((txt) => {
          if (txt) {
            onDireccion(txt);
          } else if (!ac.signal.aborted) {
            setGeoError(t("mapa.fetchError"));
          }
        })
        .catch(() => {
          if (!ac.signal.aborted) setGeoError(t("mapa.fetchError"));
        });
    }
  };

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoError(t("mapa.geoUnsupported"));
      return;
    }
    setBuscando(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        elegir({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBuscando(false);
      },
      () => {
        setBuscando(false);
        setGeoError(t("mapa.geoError"));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div role="group" aria-label={t("form.ubicacion")}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">{t("mapa.hint")}</p>
        <button
          type="button"
          onClick={usarMiUbicacion}
          disabled={buscando}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-60"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          {buscando ? t("mapa.buscar") : t("mapa.usarUbicacion")}
        </button>
      </div>

      <div className="h-72 w-full overflow-hidden rounded-xl border border-gray-200">
        <MapContainer
          center={[centro.lat, centro.lng]}
          zoom={value ? 15 : MAPA_DEFAULT.zoom}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={elegir} />
          <Recentrar punto={value} />
          {value && (
            <Marker
              position={[value.lat, value.lng]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target as L.Marker;
                  const { lat, lng } = m.getLatLng();
                  elegir({ lat, lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-500">
        <MapPin className="h-3.5 w-3.5 text-brand-500" />
        {value
          ? t("mapa.marcada", { lat: value.lat.toFixed(5), lng: value.lng.toFixed(5) })
          : t("mapa.sinUbicacion")}
      </p>

      {geoError && (
        <p
          className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {geoError}
        </p>
      )}
    </div>
  );
}
