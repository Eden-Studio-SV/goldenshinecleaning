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
import type { Actor, Solicitud } from "@/types";
import {
  useTranslation,
  useLocale,
  tipoServicioLabel,
  frecuenciaLabel,
} from "@/i18n";

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

function actorLabel(actor: Actor, locale: string): string {
  return locale === "en"
    ? actor === "admin"
      ? "Golden Shine"
      : "the customer"
    : actor === "admin"
      ? "Golden Shine"
      : "el cliente";
}

export function ResumenSolicitud({ s, mostrarCliente }: { s: Solicitud; mostrarCliente?: boolean }) {
  const { t } = useTranslation();
  const locale = useLocale();

  const mapsHref = s.ubicacion
    ? `https://www.openstreetmap.org/?mlat=${s.ubicacion.lat}&mlon=${s.ubicacion.lng}#map=17/${s.ubicacion.lat}/${s.ubicacion.lng}`
    : null;

  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        {t("resumen.title")}
      </h2>
      <dl className="mt-2 divide-y divide-gray-100">
        {mostrarCliente && (
          <Row icon={User} label={t("resumen.cliente")}>
            {s.nombre}
            {s.clienteEmail && <span className="text-gray-400"> · {s.clienteEmail}</span>}
          </Row>
        )}
        <Row icon={FileText} label={t("resumen.tipoServicio")}>
          {tipoServicioLabel(s.tipoServicio, locale)}
        </Row>
        <Row icon={Repeat} label={t("resumen.frecuencia")}>
          {frecuenciaLabel(s.frecuencia, locale)}
        </Row>
        <Row icon={Calendar} label={t("resumen.fecha")}>
          <span className="capitalize">
            {formatFecha(
              s.fechaDeseada,
              { weekday: "long", day: "numeric", month: "long", year: "numeric" },
              locale,
            )}
          </span>
        </Row>
        <Row icon={Clock} label={t("resumen.hora")}>
          {s.horaDeseada}
        </Row>

        {s.estado === "reprogramacion" && s.propuesta && (
          <Row icon={CalendarClock} label={t("resumen.nuevaFecha")}>
            <span className="capitalize">
              {formatFecha(s.propuesta.fecha, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, locale)}
            </span>{" "}
            · {s.propuesta.hora}
            <span className="ml-1 text-xs text-gray-400">
              {t("resumen.propuestaPor", { actor: actorLabel(s.propuesta.por, locale) })}
            </span>
            {s.propuesta.motivo && (
              <p className="mt-1 text-sm text-gray-500">“{s.propuesta.motivo}”</p>
            )}
          </Row>
        )}

        <Row icon={MapPin} label={t("resumen.direccion")}>
          {s.direccion}
          {mapsHref && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-sm text-brand-500 hover:underline"
            >
              {t("resumen.verMapa")}
            </a>
          )}
        </Row>

        {mostrarCliente && s.email && (
          <Row icon={Mail} label={t("resumen.correo")}>
            <a href={`mailto:${s.email}`} className="text-brand-500 hover:underline">
              {s.email}
            </a>
          </Row>
        )}

        {s.notas && (
          <Row icon={FileText} label={t("resumen.notas")}>
            <span className="whitespace-pre-wrap">{s.notas}</span>
          </Row>
        )}

        {(s.estado === "rechazada" || s.estado === "cancelada") && s.motivo && (
          <Row
            icon={Ban}
            label={s.estado === "rechazada" ? t("resumen.motivoRechazo") : t("resumen.motivo")}
          >
            {s.motivo}
          </Row>
        )}
      </dl>

      <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
        {t("resumen.creada")}: {formatTimestamp(s.creadoEn, locale)}
        {s.actualizadoEn && (
          <>
            {" · "}
            {t("resumen.actualizada")}: {formatTimestamp(s.actualizadoEn, locale)}
          </>
        )}
      </p>
    </div>
  );
}