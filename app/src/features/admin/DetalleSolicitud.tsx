import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { obtenerSolicitud, actualizarEstado } from "@/lib/solicitudes";
import { isFirebaseConfigured } from "@/firebase";
import { formatFecha, formatTimestamp } from "@/lib/format";
import {
  ESTADOS,
  ESTADO_LABEL,
  TIPOS_SERVICIO,
  type EstadoSolicitud,
  type Solicitud,
} from "@/types";
import { EstadoBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

function tipoLabel(value: string): string {
  return TIPOS_SERVICIO.find((t) => t.value === value)?.label ?? value;
}

function DatoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof User;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
      <div>
        <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
        <dd className="mt-0.5 text-navy-800">{children}</dd>
      </div>
    </div>
  );
}

export default function DetalleSolicitud() {
  const { id } = useParams<{ id: string }>();
  const [solicitud, setSolicitud] = useState<Solicitud | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!isFirebaseConfigured || !id) {
      setSolicitud(null);
      return;
    }
    obtenerSolicitud(id)
      .then((s) => active && setSolicitud(s))
      .catch(() => active && setError("No se pudo cargar la solicitud."));
    return () => {
      active = false;
    };
  }, [id]);

  const cambiarEstado = async (estado: EstadoSolicitud) => {
    if (!id || !solicitud || estado === solicitud.estado) return;
    setSaving(true);
    setError(null);
    const previo = solicitud.estado;
    setSolicitud({ ...solicitud, estado }); // optimista
    try {
      await actualizarEstado(id, estado);
    } catch {
      setSolicitud({ ...solicitud, estado: previo }); // revertir
      setError("No se pudo actualizar el estado. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (solicitud === undefined) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="h-7 w-7 text-brand-500" />
      </div>
    );
  }

  if (solicitud === null) {
    return (
      <div>
        <BackLink />
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            {isFirebaseConfigured
              ? "No encontramos esta solicitud. Es posible que haya sido eliminada."
              : "Firebase no está conectado. El detalle estará disponible cuando se configuren las credenciales."}
          </p>
        </div>
      </div>
    );
  }

  const tel = solicitud.telefono.replace(/[^\d+]/g, "");
  const wa = solicitud.telefono.replace(/\D/g, "");

  return (
    <div>
      <BackLink />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy-800">{solicitud.nombre}</h1>
        <EstadoBadge estado={solicitud.estado} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Detalles */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Detalle de la solicitud
          </h2>
          <dl className="mt-2 divide-y divide-gray-100">
            <DatoRow icon={User} label="Nombre">
              {solicitud.nombre}
            </DatoRow>
            <DatoRow icon={FileText} label="Tipo de servicio">
              {tipoLabel(solicitud.tipoServicio)}
            </DatoRow>
            <DatoRow icon={Calendar} label="Fecha deseada">
              <span className="capitalize">
                {formatFecha(solicitud.fechaDeseada, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </DatoRow>
            <DatoRow icon={Clock} label="Hora deseada">
              {solicitud.horaDeseada}
            </DatoRow>
            <DatoRow icon={MapPin} label="Dirección">
              {solicitud.direccion}
            </DatoRow>
            {solicitud.email && (
              <DatoRow icon={Mail} label="Correo">
                <a href={`mailto:${solicitud.email}`} className="text-brand-500 hover:underline">
                  {solicitud.email}
                </a>
              </DatoRow>
            )}
            {solicitud.notas && (
              <DatoRow icon={FileText} label="Notas">
                <span className="whitespace-pre-wrap">{solicitud.notas}</span>
              </DatoRow>
            )}
          </dl>

          <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
            Creada: {formatTimestamp(solicitud.creadoEn)}
            {solicitud.actualizadoEn && <> · Actualizada: {formatTimestamp(solicitud.actualizadoEn)}</>}
          </p>
        </div>

        {/* Acciones */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Cambiar estado
            </h2>
            <div className="mt-3 grid gap-2">
              {ESTADOS.map((e) => {
                const active = solicitud.estado === e;
                return (
                  <button
                    key={e}
                    type="button"
                    disabled={saving}
                    onClick={() => cambiarEstado(e)}
                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-600"
                        : "border-gray-200 text-gray-600 hover:border-brand-300"
                    }`}
                  >
                    {ESTADO_LABEL[e]}
                    {active && <span className="text-xs">Actual</span>}
                  </button>
                );
              })}
            </div>
            {saving && (
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-gray-400">
                <Spinner className="h-3.5 w-3.5" /> Guardando…
              </p>
            )}
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              Contactar al cliente
            </h2>
            <div className="mt-3 grid gap-2">
              <a
                href={`tel:${tel}`}
                className="btn btn-outline btn-md w-full justify-center"
              >
                <Phone className="h-4 w-4" /> Llamar · {solicitud.telefono}
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-md w-full justify-center"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/admin"
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
    >
      <ArrowLeft className="h-4 w-4" /> Volver al listado
    </Link>
  );
}
