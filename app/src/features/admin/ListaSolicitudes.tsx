import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, AlertTriangle, ChevronRight } from "lucide-react";
import { observarSolicitudes } from "@/lib/solicitudes";
import { isFirebaseConfigured } from "@/firebase";
import { formatFecha, formatTimestamp } from "@/lib/format";
import { ESTADOS, ESTADO_LABEL, TIPOS_SERVICIO, type EstadoSolicitud, type Solicitud } from "@/types";
import { EstadoBadge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

type Filtro = EstadoSolicitud | "todas";

const TABS: { value: Filtro; label: string }[] = [
  { value: "todas", label: "Todas" },
  ...ESTADOS.map((e) => ({ value: e, label: ESTADO_LABEL[e] })),
];

function tipoLabel(value: string): string {
  return TIPOS_SERVICIO.find((t) => t.value === value)?.label ?? value;
}

export default function ListaSolicitudes() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [items, setItems] = useState<Solicitud[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setItems([]);
      return;
    }
    setItems(null);
    setError(null);
    const unsub = observarSolicitudes(
      filtro,
      (data) => setItems(data),
      () => setError("No se pudieron cargar las solicitudes. Revisa tu conexión o los índices de Firestore."),
    );
    return unsub;
  }, [filtro]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Solicitudes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Se actualizan en tiempo real. Haz clic en una para ver el detalle.
          </p>
        </div>
      </div>

      {/* Tabs de filtro por estado */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFiltro(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filtro === t.value
                ? "bg-navy-800 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-brand-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!isFirebaseConfigured && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <strong>Firebase no está conectado.</strong> Cuando se configuren las credenciales y se
            creen usuarios, aquí aparecerán las solicitudes reales en tiempo real.
          </p>
        </div>
      )}

      <div className="mt-6">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
          </div>
        ) : items === null ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="h-7 w-7 text-brand-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <Inbox className="h-10 w-10 text-gray-300" />
            <p className="mt-3 font-medium text-gray-600">No hay solicitudes en esta categoría.</p>
          </div>
        ) : (
          <>
            {/* Tabla (desktop) */}
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-50/70 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Nombre</th>
                    <th className="px-5 py-3 font-semibold">Servicio</th>
                    <th className="px-5 py-3 font-semibold">Fecha deseada</th>
                    <th className="px-5 py-3 font-semibold">Estado</th>
                    <th className="px-5 py-3 font-semibold">Creada</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/admin/solicitud/${s.id}`)}
                      className="cursor-pointer transition hover:bg-brand-50/50"
                    >
                      <td className="px-5 py-3 font-medium text-navy-800">{s.nombre}</td>
                      <td className="px-5 py-3 text-gray-600">{tipoLabel(s.tipoServicio)}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {formatFecha(s.fechaDeseada)} · {s.horaDeseada}
                      </td>
                      <td className="px-5 py-3">
                        <EstadoBadge estado={s.estado} />
                      </td>
                      <td className="px-5 py-3 text-gray-500">{formatTimestamp(s.creadoEn)}</td>
                      <td className="px-5 py-3 text-right text-gray-400">
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas (móvil) */}
            <div className="grid gap-3 md:hidden">
              {items.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => navigate(`/admin/solicitud/${s.id}`)}
                  className="card flex items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-navy-800">{s.nombre}</span>
                      <EstadoBadge estado={s.estado} />
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {tipoLabel(s.tipoServicio)} · {formatFecha(s.fechaDeseada)} · {s.horaDeseada}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
