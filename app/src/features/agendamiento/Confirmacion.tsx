import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, LayoutDashboard, MessageCircle, ArrowLeft } from "lucide-react";
import { obtenerSolicitud } from "@/lib/solicitudes";
import { useAuth } from "@/lib/auth";
import type { Frecuencia, TipoServicio } from "@/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CONTACTO } from "@/features/landing/content";
import { useTranslation, tipoServicioLabel, frecuenciaLabel } from "@/i18n";

interface Resumen {
  nombre: string;
  tipoServicio: TipoServicio;
  frecuencia: Frecuencia;
  fechaDeseada: string;
  horaDeseada: string;
}

interface ConfirmState {
  resumen?: Resumen;
}

type Status = "loading" | "ready" | "noId" | "notFound" | "error";

function formatearFecha(iso: string, locale: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(locale, {
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
  const [params] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { t, locale } = useTranslation();

  const id = params.get("id");
  const resumenState = (state as ConfirmState | null)?.resumen;

  const [status, setStatus] = useState<Status>(id ? "loading" : resumenState ? "ready" : "noId");
  const [resumen, setResumen] = useState<Resumen | null>(resumenState ?? null);

  const cargar = useCallback(async () => {
    if (!id) {
      setStatus(resumen ? "ready" : "noId");
      return;
    }
    if (!user) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const s = await obtenerSolicitud(id);
      // Solo el dueño o un admin pueden verla (las reglas de Firestore también).
      if (!s || (s.clienteId !== user.uid && !isAdmin)) {
        setStatus("notFound");
        return;
      }
      setResumen({
        nombre: s.nombre,
        tipoServicio: s.tipoServicio,
        frecuencia: s.frecuencia,
        fechaDeseada: s.fechaDeseada,
        horaDeseada: s.horaDeseada,
      });
      setStatus("ready");
    } catch {
      // Si hay resumen en el state, lo usamos como fallback.
      if (resumen) {
        setStatus("ready");
      } else {
        setStatus("error");
      }
    }
  }, [id, user, isAdmin, resumen]);

  useEffect(() => {
    // Si ya tenemos resumen del state, lo mostramos de inmediato y, si hay id,
    // intentamos cargar la solicitud en segundo plano para confirmar.
    if (resumenState && !id) {
      setStatus("ready");
      return;
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const servicioLabel = resumen ? tipoServicioLabel(resumen.tipoServicio, locale) : "";

  const waMsg = resumen
    ? encodeURIComponent(
        locale === "es"
          ? `Hola, acabo de solicitar una ${servicioLabel} para el ${formatearFecha(
              resumen.fechaDeseada,
              "es",
            )} a las ${resumen.horaDeseada}. Mi nombre es ${resumen.nombre}.`
          : `Hi, I just requested a ${servicioLabel} for ${formatearFecha(
              resumen.fechaDeseada,
              "en",
            )} at ${resumen.horaDeseada}. My name is ${resumen.nombre}.`,
      )
    : "";

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-7 w-7 text-brand-500" />
        <span className="sr-only">{t("confirm.loading")}</span>
      </div>
    );
  }

  if (status === "noId") {
    return (
      <div className="bg-brand-50/50 py-16">
        <div className="container-app max-w-xl">
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
          >
            <ArrowLeft className="h-4 w-4" /> {t("confirm.backToForm")}
          </Link>
          <div className="card mt-6 p-8 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
            <p className="mt-4 text-gray-600">{t("confirm.noId")}</p>
            <Link to="/solicitar" className="mt-6 inline-block">
              <Button variant="gold">{t("form.submit")}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "notFound") {
    return (
      <div className="bg-brand-50/50 py-16">
        <div className="container-app max-w-xl">
          <Link
            to="/portal"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
          >
            <ArrowLeft className="h-4 w-4" /> {t("confirm.backToForm")}
          </Link>
          <div className="card mt-6 p-8 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
            <p className="mt-4 text-gray-600">{t("confirm.notFound")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !resumen) {
    return (
      <div className="bg-brand-50/50 py-16">
        <div className="container-app max-w-xl">
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
          >
            <ArrowLeft className="h-4 w-4" /> {t("confirm.backToForm")}
          </Link>
          <div className="card mt-6 p-8 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
            <p className="mt-4 text-gray-600">{t("confirm.error")}</p>
            <Button variant="outline" className="mt-6" onClick={cargar}>
              {t("confirm.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-50/50 py-16 lg:py-24">
      <div className="container-app max-w-xl">
        <div className="card p-8 text-center sm:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-11 w-11" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold">{t("confirm.title")}</h1>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            {t("confirm.body", { nombre: resumen.nombre.split(" ")[0] })}
          </p>

          <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-xl bg-brand-50 p-5 text-left text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">{t("confirm.servicio")}</dt>
              <dd className="font-semibold text-navy-800">{servicioLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">{t("confirm.frecuencia")}</dt>
              <dd className="font-semibold text-navy-800">
                {frecuenciaLabel(resumen.frecuencia, locale)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">{t("confirm.fecha")}</dt>
              <dd className="text-right font-semibold capitalize text-navy-800">
                {formatearFecha(resumen.fechaDeseada, locale)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">{t("confirm.hora")}</dt>
              <dd className="font-semibold text-navy-800">{resumen.horaDeseada}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/portal">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                <LayoutDashboard className="h-5 w-5" /> {t("confirm.verSolicitudes")}
              </Button>
            </Link>
            {CONTACTO.whatsappHref && (
              <a href={`${CONTACTO.whatsappHref}?text=${waMsg}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5" /> {t("confirm.whatsapp")}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}