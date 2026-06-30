import type { ComponentType } from "react";
import {
  Calendar,
  CalendarClock,
  Clock,
  FileText,
  Mail,
  MapPin,
  Repeat,
  User,
  Ban,
} from "lucide-react";
import { formatFecha, formatTimestamp } from "@/lib/format";
import { FRECUENCIA_LABEL, TIPOS_SERVICIO, type Solicitud } from "@/types";

function tipoLabel(value: string): string {
  return TIPOS_SERVICIO.find((t) => t.value === value)?.label ?? value;
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
        <dd className="mt-0.5 text-navy-800">{children}</dd>
      </div>
    </div>
  );
}

export function ResumenSolicitud({ s, mostrarCliente }: { s: Solicitud; mostrarCliente?: boolean }) {
  const mapsHref = s.ubicacion
    ? `https://www.openstreetmap.org/?mlat=${s.ubicacion.lat}&mlon=${s.ubicacion.lng}#map=17/${s.ubicacion.lat}/${s.ubicacion.lng}`
    : null;

  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Detalle de la solicitud
      </h2>
      <dl className="mt-2 divide-y divide-gray-100">
        {mostrarCliente && (
          <Row icon={User} label="Cliente">
            {s.nombre}
            {s.clienteEmail && <span className="text-gray-400"> · {s.clienteEmail}</span>}
          </Row>
        )}
        <Row icon={FileText} label="Tipo de servicio">
          {tipoLabel(s.tipoServicio)}
        </Row>
        <Row icon={Repeat} label="Frecuencia">
          {FRECUENCIA_LABEL[s.frecuencia]}
        </Row>
        <Row icon={Calendar} label="Fecha">
          <span className="capitalize">
            {formatFecha(s.fechaDeseada, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </Row>
        <Row icon={Clock} label="Hora">
          {s.horaDeseada}
        </Row>

        {s.estado === "reprogramacion" && s.propuesta && (
          <Row icon={CalendarClock} label="Nueva fecha propuesta">
            <span className="capitalize">{formatFecha(s.propuesta.fecha)}</span> · {s.propuesta.hora}
            <span className="ml-1 text-xs text-gray-400">
              (propuesta por {s.propuesta.por === "admin" ? "Golden Shine" : "el cliente"})
            </span>
            {s.propuesta.motivo && (
              <p className="mt-1 text-sm text-gray-500">“{s.propuesta.motivo}”</p>
            )}
          </Row>
        )}

        <Row icon={MapPin} label="Dirección">
          {s.direccion}
          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-sm text-brand-500 hover:underline"
            >
              Ver en mapa
            </a>
          )}
        </Row>

        {mostrarCliente && s.email && (
          <Row icon={Mail} label="Correo">
            <a href={`mailto:${s.email}`} className="text-brand-500 hover:underline">
              {s.email}
            </a>
          </Row>
        )}

        {s.notas && (
          <Row icon={FileText} label="Notas">
            <span className="whitespace-pre-wrap">{s.notas}</span>
          </Row>
        )}

        {(s.estado === "rechazada" || s.estado === "cancelada") && s.motivo && (
          <Row icon={Ban} label={s.estado === "rechazada" ? "Motivo del rechazo" : "Motivo"}>
            {s.motivo}
          </Row>
        )}
      </dl>

      <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
        Creada: {formatTimestamp(s.creadoEn)}
        {s.actualizadoEn && <> · Actualizada: {formatTimestamp(s.actualizadoEn)}</>}
      </p>
    </div>
  );
}
