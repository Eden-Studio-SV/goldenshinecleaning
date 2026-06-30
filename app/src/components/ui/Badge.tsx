import type { EstadoSolicitud } from "@/types";
import { ESTADO_LABEL } from "@/types";

const STYLE: Record<EstadoSolicitud, string> = {
  pendiente: "bg-amber-100 text-amber-800 ring-amber-200",
  agendada: "bg-blue-100 text-blue-800 ring-blue-200",
  reprogramacion: "bg-purple-100 text-purple-800 ring-purple-200",
  completada: "bg-green-100 text-green-800 ring-green-200",
  rechazada: "bg-red-100 text-red-700 ring-red-200",
  cancelada: "bg-gray-100 text-gray-600 ring-gray-200",
};

export function EstadoBadge({ estado }: { estado: EstadoSolicitud }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STYLE[estado]}`}
    >
      {ESTADO_LABEL[estado]}
    </span>
  );
}
