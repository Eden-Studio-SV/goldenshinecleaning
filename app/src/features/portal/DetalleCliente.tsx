import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, MessageCircle } from "lucide-react";
import { obtenerSolicitud } from "@/lib/solicitudes";
import { useAuth } from "@/lib/auth";
import type { Solicitud } from "@/types";
import { ESTADO_LABEL } from "@/types";
import { EstadoBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ResumenSolicitud } from "@/features/agendamiento/ResumenSolicitud";
import { AccionesSolicitud } from "@/features/agendamiento/AccionesSolicitud";
import { CONTACTO } from "@/features/landing/content";

function BackLink() {
  return (
    <Link
      to="/portal"
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
    >
      <ArrowLeft className="h-4 w-4" /> Volver a mis limpiezas
    </Link>
  );
}

export default function DetalleCliente() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [solicitud, setSolicitud] = useState<Solicitud | null | undefined>(undefined);

  const cargar = useCallback(async () => {
    if (!id || !user) return;
    try {
      const s = await obtenerSolicitud(id);
      // Solo el dueño puede verla (las reglas también lo impiden).
      setSolicitud(s && s.clienteId === user.uid ? s : null);
    } catch {
      setSolicitud(null);
    }
  }, [id, user]);

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
          <p>No encontramos esta solicitud o no pertenece a tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy-800">Tu solicitud</h1>
        <EstadoBadge estado={solicitud.estado} />
      </div>
      <p className="mt-1 text-sm text-gray-500">Estado: {ESTADO_LABEL[solicitud.estado]}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ResumenSolicitud s={solicitud} />
        </div>

        <div className="space-y-6">
          <AccionesSolicitud solicitud={solicitud} rol="cliente" onDone={cargar} />

          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
              ¿Necesitas ayuda?
            </h2>
            <a
              href={CONTACTO.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-md mt-3 w-full justify-center"
            >
              <MessageCircle className="h-4 w-4" /> Escribirnos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
