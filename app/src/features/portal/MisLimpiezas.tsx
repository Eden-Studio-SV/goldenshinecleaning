import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarPlus, ChevronRight, Sparkles } from "lucide-react";
import { observarSolicitudesCliente } from "@/lib/solicitudes";
import { useAuth } from "@/lib/auth";
import { formatFecha } from "@/lib/format";
import { ESTADOS_ACTIVOS, type Solicitud } from "@/types";
import { EstadoBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useTranslation, useLocale, tipoServicioLabel, frecuenciaLabel } from "@/i18n";

function Tarjeta({ s }: { s: Solicitud }) {
  const locale = useLocale();
  return (
    <Link
      to={`/portal/solicitud/${s.id}`}
      className="card flex items-center justify-between gap-3 p-4 transition hover:border-brand-300"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-semibold text-navy-800">
            {tipoServicioLabel(s.tipoServicio, locale)}
          </span>
          <EstadoBadge estado={s.estado} />
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">
          {formatFecha(s.fechaDeseada, undefined, locale)} · {s.horaDeseada}
          {s.frecuencia !== "unica" && <> · {frecuenciaLabel(s.frecuencia, locale)}</>}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
    </Link>
  );
}

function Seccion({ titulo, items, vacio }: { titulo: string; items: Solicitud[]; vacio: string }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">{titulo}</h2>
      {items.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
          {vacio}
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          {items.map((s) => (
            <Tarjeta key={s.id} s={s} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function MisLimpiezas() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState<Solicitud[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setItems(null);
    setError(null);
    const unsub = observarSolicitudesCliente(
      user.uid,
      setItems,
      () => setError(t("portal.error")),
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const proximas = (items ?? []).filter((s) => ESTADOS_ACTIVOS.includes(s.estado));
  const historial = (items ?? []).filter((s) => !ESTADOS_ACTIVOS.includes(s.estado));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">{t("portal.title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("portal.subtitle")}</p>
        </div>
        <Link to="/solicitar">
          <Button variant="gold">
            <CalendarPlus className="h-4 w-4" /> {t("portal.requestCleaning")}
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      {items === null ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="h-7 w-7 text-brand-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Sparkles className="h-10 w-10 text-gray-300" />
          <p className="mt-3 font-medium text-gray-600">{t("portal.vacio.titulo")}</p>
          <Link to="/solicitar" className="mt-4">
            <Button variant="gold">
              <CalendarPlus className="h-4 w-4" /> {t("portal.vacio.cta")}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Seccion titulo={t("portal.proximas")} items={proximas} vacio={t("portal.vacio.proximas")} />
          <Seccion titulo={t("portal.historial")} items={historial} vacio={t("portal.vacio.historial")} />
        </>
      )}
    </div>
  );
}