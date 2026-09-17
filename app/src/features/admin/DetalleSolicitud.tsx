import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, AlertTriangle } from "lucide-react";
import { obtenerSolicitud } from "@/lib/solicitudes";
import { isFirebaseConfigured } from "@/firebase";
import type { Solicitud } from "@/types";
import { EstadoBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ResumenSolicitud } from "@/features/agendamiento/ResumenSolicitud";
import { AccionesSolicitud } from "@/features/agendamiento/AccionesSolicitud";
import { useTranslation, useLocale, estadoLabel } from "@/i18n";

function BackLink() {
  const { t } = useTranslation();
  return (
    <Link
      to="/admin"
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
    >
      <ArrowLeft className="h-4 w-4" /> {t("admin.detalle.back")}
    </Link>
  );
}

export default function DetalleSolicitud() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const locale = useLocale();
  const [solicitud, setSolicitud] = useState<Solicitud | null | undefined>(undefined);

  const cargar = useCallback(async () => {
    if (!isFirebaseConfigured || !id) {
      setSolicitud(null);
      return;
    }
    try {
      setSolicitud(await obtenerSolicitud(id));
    } catch {
      setSolicitud(null);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

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
              ? t("admin.detalle.notFound")
              : t("login.firebaseNotConfigured")}
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
      <p className="mt-1 text-sm text-gray-500">
        {t("admin.detalle.estado", { estado: estadoLabel(solicitud.estado, locale) })}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ResumenSolicitud s={solicitud} mostrarCliente />
        </div>

        <div className="space-y-6">
          <AccionesSolicitud solicitud={solicitud} rol="admin" onDone={cargar} />

          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              {t("admin.detalle.contactar")}
            </h2>
            <div className="mt-3 grid gap-2">
              <a href={`tel:${tel}`} className="btn btn-outline btn-md w-full justify-center">
                <Phone className="h-4 w-4" /> {t("admin.detalle.llamar", { telefono: solicitud.telefono })}
              </a>
              {wa && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-md w-full justify-center"
                >
                  <MessageCircle className="h-4 w-4" /> {t("admin.detalle.whatsapp")}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}