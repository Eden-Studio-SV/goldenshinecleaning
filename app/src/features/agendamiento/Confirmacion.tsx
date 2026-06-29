import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, Home, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TIPOS_SERVICIO, type TipoServicio } from "@/types";
import { CONTACTO } from "@/features/landing/content";

interface Resumen {
  nombre: string;
  tipoServicio: TipoServicio;
  fechaDeseada: string;
  horaDeseada: string;
}

interface ConfirmState {
  resumen?: Resumen;
  demo?: boolean;
}

function formatearFecha(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function Confirmacion() {
  const { state } = useLocation();
  const { resumen, demo } = (state as ConfirmState | null) ?? {};

  // Acceso directo (sin enviar el formulario) → de vuelta a solicitar.
  if (!resumen) {
    return <Navigate to="/solicitar" replace />;
  }

  const servicioLabel =
    TIPOS_SERVICIO.find((t) => t.value === resumen.tipoServicio)?.label ?? resumen.tipoServicio;

  const waMsg = encodeURIComponent(
    `Hola, acabo de solicitar una ${servicioLabel} para el ${formatearFecha(
      resumen.fechaDeseada,
    )} a las ${resumen.horaDeseada}. Mi nombre es ${resumen.nombre}.`,
  );

  return (
    <div className="bg-brand-50/50 py-16 lg:py-24">
      <div className="container-app max-w-xl">
        <div className="card p-8 text-center sm:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-11 w-11" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold">¡Solicitud recibida!</h1>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            Gracias, {resumen.nombre.split(" ")[0]}. Nos pondremos en contacto pronto para confirmar
            tu limpieza.
          </p>

          <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-xl bg-brand-50 p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Servicio</dt>
              <dd className="font-semibold text-navy-800">{servicioLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Fecha</dt>
              <dd className="text-right font-semibold capitalize text-navy-800">
                {formatearFecha(resumen.fechaDeseada)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Hora</dt>
              <dd className="font-semibold text-navy-800">{resumen.horaDeseada}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`${CONTACTO.whatsappHref}?text=${waMsg}`} target="_blank" rel="noreferrer">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" /> Contáctanos por WhatsApp
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="h-5 w-5" /> Volver al inicio
              </Button>
            </Link>
          </div>

          {demo && (
            <p className="mt-6 inline-flex items-center gap-2 text-xs text-amber-700">
              <Info className="h-4 w-4" /> Modo demostración: esta solicitud no se guardó (Firebase
              no conectado).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
