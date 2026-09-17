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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50">
        <Spinner className="h-10 w-10 text-brand-500" />
        <span className="sr-only">{t("confirm.loading")}</span>
      </div>
    );
  }

  if (status === "noId") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 py-16 flex flex-col justify-center">
        <div className="container-app max-w-xl animate-fade-in-up">
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t("confirm.backToForm")}
          </Link>
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100/50">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-50 text-amber-500 mb-6">
               <AlertTriangle className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium text-slate-600 mb-8">{t("confirm.noId")}</p>
            <Link to="/solicitar" className="inline-block">
              <Button className="bg-brand-500 hover:bg-brand-600 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5">{t("form.submit")}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "notFound") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 py-16 flex flex-col justify-center">
        <div className="container-app max-w-xl animate-fade-in-up">
          <Link
            to="/portal"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t("confirm.backToForm")}
          </Link>
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100/50">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-50 text-amber-500 mb-6">
               <AlertTriangle className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium text-slate-600">{t("confirm.notFound")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !resumen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 py-16 flex flex-col justify-center">
        <div className="container-app max-w-xl animate-fade-in-up">
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t("confirm.backToForm")}
          </Link>
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100/50">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-50 text-red-500 mb-6">
               <AlertTriangle className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium text-slate-600 mb-8">{t("confirm.error")}</p>
            <Button className="rounded-2xl px-8 h-12 font-bold" onClick={cargar}>
              {t("confirm.retry")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 py-16 lg:py-24 flex flex-col justify-center">
      <div className="container-app max-w-xl animate-fade-in-up">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 sm:p-12 text-center border border-slate-100/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-50 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
             <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-xl shadow-brand-500/40 mb-8 transform hover:scale-105 transition-transform duration-300">
               <CheckCircle2 className="h-12 w-12" />
             </div>
   
             <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">{t("confirm.title")}</h1>
             <p className="mx-auto text-lg text-slate-500 leading-relaxed mb-8">
               {t("confirm.body", { nombre: resumen.nombre.split(" ")[0] })}
             </p>
   
             <dl className="mx-auto max-w-sm space-y-4 rounded-3xl bg-slate-50 p-6 text-left text-sm border border-slate-100 shadow-inner">
               <div className="flex justify-between items-center gap-4 border-b border-slate-200/60 pb-3">
                 <dt className="text-slate-500 font-medium">{t("confirm.servicio")}</dt>
                 <dd className="font-bold text-brand-700">{servicioLabel}</dd>
               </div>
               <div className="flex justify-between items-center gap-4 border-b border-slate-200/60 pb-3">
                 <dt className="text-slate-500 font-medium">{t("confirm.frecuencia")}</dt>
                 <dd className="font-bold text-slate-900">
                   {frecuenciaLabel(resumen.frecuencia, locale)}
                 </dd>
               </div>
               <div className="flex justify-between items-center gap-4 border-b border-slate-200/60 pb-3">
                 <dt className="text-slate-500 font-medium">{t("confirm.fecha")}</dt>
                 <dd className="text-right font-bold capitalize text-slate-900">
                   {formatearFecha(resumen.fechaDeseada, locale)}
                 </dd>
               </div>
               <div className="flex justify-between items-center gap-4">
                 <dt className="text-slate-500 font-medium">{t("confirm.hora")}</dt>
                 <dd className="font-bold text-slate-900">{resumen.horaDeseada}</dd>
               </div>
             </dl>
   
             <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
               <Link to="/portal" className="w-full sm:w-auto">
                 <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl h-14 px-8 text-base font-bold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5">
                   <LayoutDashboard className="h-5 w-5 mr-2" /> {t("confirm.verSolicitudes")}
                 </Button>
               </Link>
               {CONTACTO.whatsappHref && (
                 <a href={`${CONTACTO.whatsappHref}?text=${waMsg}`} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                   <Button variant="outline" className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl h-14 px-8 text-base font-bold shadow-sm transition-all hover:-translate-y-0.5">
                     <MessageCircle className="h-5 w-5 mr-2 text-green-500" /> {t("confirm.whatsapp")}
                   </Button>
                 </a>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}