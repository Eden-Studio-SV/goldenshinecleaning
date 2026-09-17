import { useState } from "react";
import { CalendarClock } from "lucide-react";
import {
  ACCION_META,
  accionesDisponibles,
  mensajeEstado,
  type AccionId,
} from "@/lib/lifecycle";
import {
  aceptarPropuesta,
  cancelarSolicitud,
  completarSolicitud,
  confirmarSolicitud,
  proponerCambio,
  rechazarPropuesta,
  rechazarSolicitud,
} from "@/lib/solicitudes";
import { hoyISO, reprogramarSchema } from "@/lib/validators";
import type { Actor, Solicitud } from "@/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useTranslation, useLocale, translateText, accionLabel } from "@/i18n";

type Modo = null | "proponer" | "pedirReprogramar" | "rechazar";

export function AccionesSolicitud({
  solicitud,
  rol,
  onDone,
}: {
  solicitud: Solicitud;
  rol: Actor;
  onDone?: () => void;
}) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [modo, setModo] = useState<Modo>(null);
  const [fecha, setFecha] = useState(solicitud.fechaDeseada);
  const [hora, setHora] = useState(solicitud.horaDeseada);
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acciones = accionesDisponibles(solicitud, rol);
  const avisoRaw = mensajeEstado(solicitud, rol);
  const aviso = avisoRaw ? translateText(avisoRaw, locale) : null;
  if (acciones.length === 0 && !aviso) return null;

  const run = async (fn: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await fn();
      setModo(null);
      setMotivo("");
      onDone?.();
    } catch {
      setError(t("acciones.error"));
    } finally {
      setSaving(false);
    }
  };

  const handle = (a: AccionId) => {
    setError(null);
    switch (a) {
      case "proponer":
      case "pedirReprogramar":
        setFecha(solicitud.fechaDeseada);
        setHora(solicitud.horaDeseada);
        setModo(a);
        return;
      case "rechazar":
        setModo("rechazar");
        return;
      case "confirmar":
        return run(() => confirmarSolicitud(solicitud.id));
      case "completar":
        return run(() => completarSolicitud(solicitud));
      case "cancelar":
        if (!window.confirm(t("acciones.confirmCancel"))) return;
        return run(() =>
          cancelarSolicitud(
            solicitud.id,
            rol === "cliente" ? t("acciones.cancelCliente") : t("acciones.cancelAdmin"),
          ),
        );
      case "aceptarPropuesta":
        return run(() => aceptarPropuesta(solicitud, rol));
      case "rechazarPropuesta":
        if (!window.confirm(t("acciones.confirmRejectProp"))) return;
        return run(() => rechazarPropuesta(solicitud, rol));
    }
  };

  const enviarReprograma = () => {
    const parsed = reprogramarSchema.safeParse({ fecha, hora, motivo });
    if (!parsed.success) {
      setError(translateText(parsed.error.issues[0]?.message ?? t("val.reprogramar"), locale));
      return;
    }
    run(() => proponerCambio(solicitud, { fecha, hora, motivo }, rol satisfies Actor));
  };

  const enviarRechazo = () => run(() => rechazarSolicitud(solicitud.id, motivo));

  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        {t("acciones.title")}
      </h2>

      {aviso && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-800">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" /> {aviso}
        </p>
      )}

      {modo === null ? (
        <div className="mt-3 grid gap-2">
          {acciones.map((a) => (
            <Button
              key={a}
              variant={ACCION_META[a].variant}
              size="md"
              disabled={saving}
              className="w-full justify-center"
              onClick={() => handle(a)}
            >
              {accionLabel(a, locale)}
            </Button>
          ))}
        </div>
      ) : modo === "rechazar" ? (
        <div className="mt-3 grid gap-2">
          <label className="label" htmlFor="motivo-rechazo">
            {t("acciones.motivo")}
          </label>
          <textarea
            id="motivo-rechazo"
            rows={2}
            className="input"
            placeholder={t("acciones.motivo.ph")}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="peligro" className="flex-1 justify-center" disabled={saving} onClick={enviarRechazo}>
              {t("acciones.confirmarRechazo")}
            </Button>
            <Button variant="ghost" disabled={saving} onClick={() => setModo(null)}>
              {t("acciones.volver")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-3 grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label" htmlFor="re-fecha">
                {t("acciones.nuevaFecha")}
              </label>
              <input
                id="re-fecha"
                type="date"
                min={hoyISO()}
                className="input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="re-hora">
                {t("acciones.nuevaHora")}
              </label>
              <input
                id="re-hora"
                type="time"
                className="input"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="re-motivo">
              {t("acciones.nota")}
            </label>
            <input
              id="re-motivo"
              type="text"
              className="input"
              placeholder={t("acciones.nota.ph")}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1 justify-center" disabled={saving} onClick={enviarReprograma}>
              {t("acciones.enviarPropuesta")}
            </Button>
            <Button variant="ghost" disabled={saving} onClick={() => setModo(null)}>
              {t("acciones.volver")}
            </Button>
          </div>
        </div>
      )}

      {saving && (
        <p className="mt-3 inline-flex items-center gap-2 text-xs text-gray-400">
          <Spinner className="h-3.5 w-3.5" /> {t("common.saving")}
        </p>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </div>
  );
}