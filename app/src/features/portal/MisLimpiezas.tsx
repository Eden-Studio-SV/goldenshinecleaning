import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CalendarPlus, ChevronRight, Sparkles } from "lucide-react";
import { observarSolicitudesCliente } from "@/lib/solicitudes";
import { useAuth } from "@/lib/auth";
import { formatFecha } from "@/lib/format";
import { ESTADOS_ACTIVOS, FRECUENCIA_LABEL, TIPOS_SERVICIO, type Solicitud } from "@/types";
import { EstadoBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

function tipoLabel(value: string): string {
  return TIPOS_SERVICIO.find((t) => t.value === value)?.label ?? value;
}

function Tarjeta({ s }: { s: Solicitud }) {
  return (
    <Link
      to={`/portal/solicitud/${s.id}`}
      className="card flex items-center justify-between gap-3 p-4 transition hover:border-brand-300"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-semibold text-navy-800">{tipoLabel(s.tipoServicio)}</span>
          <EstadoBadge estado={s.estado} />
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">
          {formatFecha(s.fechaDeseada)} · {s.horaDeseada}
          {s.frecuencia !== "unica" && <> · {FRECUENCIA_LABEL[s.frecuencia]}</>}
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
  const [items, setItems] = useState<Solicitud[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setItems(null);
    setError(null);
    const unsub = observarSolicitudesCliente(
      user.uid,
      setItems,
      () => setError("No se pudieron cargar tus solicitudes. Revisa tu conexión."),
    );
    return unsub;
  }, [user]);

  const proximas = (items ?? []).filter((s) => ESTADOS_ACTIVOS.includes(s.estado));
  const historial = (items ?? []).filter((s) => !ESTADOS_ACTIVOS.includes(s.estado));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Mis limpiezas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Solicita, da seguimiento y reprograma tus servicios.
          </p>
        </div>
        <Link to="/solicitar">
          <Button variant="gold">
            <CalendarPlus className="h-4 w-4" /> Solicitar limpieza
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
          <p className="mt-3 font-medium text-gray-600">Aún no has solicitado ninguna limpieza.</p>
          <Link to="/solicitar" className="mt-4">
            <Button variant="gold">
              <CalendarPlus className="h-4 w-4" /> Solicitar mi primera limpieza
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Seccion titulo="Próximas" items={proximas} vacio="No tienes limpiezas activas." />
          <Seccion titulo="Historial" items={historial} vacio="Aún no hay historial." />
        </>
      )}
    </div>
  );
}
