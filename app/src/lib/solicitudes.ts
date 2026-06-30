import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import type {
  Actor,
  EstadoSolicitud,
  Frecuencia,
  Solicitud,
  SolicitudInput,
} from "@/types";
import { estadoAlRechazarPropuesta } from "@/lib/lifecycle";

const COL = "solicitudes";

function requireDb() {
  if (!db) {
    throw new Error(
      "Firebase no está configurado. Define las variables VITE_FIREBASE_* en el archivo .env.",
    );
  }
  return db;
}

function mapDoc(
  snap: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): Solicitud {
  const data = snap.data() ?? {};
  return {
    id: snap.id,
    clienteId: data.clienteId ?? "",
    clienteEmail: data.clienteEmail ?? data.email ?? "",
    nombre: data.nombre ?? "",
    telefono: data.telefono ?? "",
    email: data.email ?? undefined,
    tipoServicio: data.tipoServicio,
    direccion: data.direccion ?? "",
    ubicacion: data.ubicacion ?? null,
    fechaDeseada: data.fechaDeseada ?? "",
    horaDeseada: data.horaDeseada ?? "",
    frecuencia: (data.frecuencia as Frecuencia) ?? "unica",
    serieId: data.serieId ?? null,
    notas: data.notas ?? undefined,
    estado: (data.estado as EstadoSolicitud) ?? "pendiente",
    estadoPrevio: (data.estadoPrevio as EstadoSolicitud) ?? null,
    propuesta: data.propuesta ?? null,
    motivo: data.motivo ?? null,
    creadoEn: data.creadoEn ?? null,
    actualizadoEn: data.actualizadoEn ?? null,
  };
}

/** Crea una solicitud del cliente autenticado. Siempre fuerza estado "pendiente". */
export async function crearSolicitud(
  data: SolicitudInput,
  owner: { uid: string; email: string },
): Promise<string> {
  const database = requireDb();
  const payload: Record<string, unknown> = {
    clienteId: owner.uid,
    clienteEmail: owner.email,
    nombre: data.nombre.trim(),
    telefono: data.telefono.trim(),
    tipoServicio: data.tipoServicio,
    direccion: data.direccion.trim(),
    fechaDeseada: data.fechaDeseada,
    horaDeseada: data.horaDeseada,
    frecuencia: data.frecuencia,
    estado: "pendiente",
    creadoEn: serverTimestamp(),
  };
  if (data.email && data.email.trim()) payload.email = data.email.trim();
  if (data.notas && data.notas.trim()) payload.notas = data.notas.trim();
  if (data.ubicacion) {
    payload.ubicacion = { lat: data.ubicacion.lat, lng: data.ubicacion.lng };
  }

  const ref = await addDoc(collection(database, COL), payload);
  return ref.id;
}

/**
 * Suscripción en tiempo real al listado del panel (más recientes primero).
 * Pasa "todas" para no filtrar por estado. Devuelve la función de desuscripción.
 */
export function observarSolicitudes(
  estado: EstadoSolicitud | "todas",
  onData: (items: Solicitud[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const database = requireDb();
  const base = collection(database, COL);
  const q =
    estado === "todas"
      ? query(base, orderBy("creadoEn", "desc"))
      : query(base, where("estado", "==", estado), orderBy("creadoEn", "desc"));

  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(mapDoc)),
    (error) => onError?.(error),
  );
}

/** Suscripción a las solicitudes de un cliente (su portal), más recientes primero. */
export function observarSolicitudesCliente(
  clienteId: string,
  onData: (items: Solicitud[]) => void,
  onError?: (error: Error) => void,
): () => void {
  const database = requireDb();
  const q = query(
    collection(database, COL),
    where("clienteId", "==", clienteId),
    orderBy("creadoEn", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(mapDoc)),
    (error) => onError?.(error),
  );
}

export async function obtenerSolicitud(id: string): Promise<Solicitud | null> {
  const database = requireDb();
  const snap = await getDoc(doc(database, COL, id));
  return snap.exists() ? mapDoc(snap) : null;
}

function patch(id: string, data: Record<string, unknown>): Promise<void> {
  const database = requireDb();
  return updateDoc(doc(database, COL, id), { ...data, actualizadoEn: serverTimestamp() });
}

// ---- Transiciones del ciclo de vida -------------------------------------

/** Admin: confirma una solicitud pendiente (queda agendada con su fecha). */
export function confirmarSolicitud(id: string): Promise<void> {
  return patch(id, { estado: "agendada" });
}

/** Admin: rechaza una solicitud (con motivo opcional). */
export function rechazarSolicitud(id: string, motivo?: string): Promise<void> {
  return patch(id, { estado: "rechazada", motivo: motivo?.trim() || null });
}

/** Cliente o admin: cancela una solicitud. */
export function cancelarSolicitud(id: string, motivo?: string): Promise<void> {
  return patch(id, { estado: "cancelada", motivo: motivo?.trim() || null });
}

/**
 * Admin o cliente: propone otra fecha/hora. Deja la solicitud en
 * `reprogramacion` esperando confirmación de la otra parte.
 */
export function proponerCambio(
  s: Solicitud,
  nueva: { fecha: string; hora: string; motivo?: string },
  por: Actor,
): Promise<void> {
  const estadoPrevio =
    s.estado === "reprogramacion" ? (s.estadoPrevio ?? "agendada") : s.estado;
  return patch(s.id, {
    estado: "reprogramacion",
    estadoPrevio,
    propuesta: {
      fecha: nueva.fecha,
      hora: nueva.hora,
      por,
      motivo: nueva.motivo?.trim() || null,
      creadaEn: serverTimestamp(),
    },
  });
}

/** Acepta la propuesta vigente: aplica la nueva fecha/hora y vuelve a agendada. */
export function aceptarPropuesta(s: Solicitud): Promise<void> {
  if (!s.propuesta) return Promise.reject(new Error("No hay propuesta que aceptar."));
  return patch(s.id, {
    estado: "agendada",
    fechaDeseada: s.propuesta.fecha,
    horaDeseada: s.propuesta.hora,
    propuesta: null,
    estadoPrevio: null,
  });
}

/** Rechaza la propuesta vigente: vuelve al estado previo con la fecha original. */
export function rechazarPropuesta(s: Solicitud): Promise<void> {
  return patch(s.id, {
    estado: estadoAlRechazarPropuesta(s),
    propuesta: null,
    estadoPrevio: null,
  });
}

/**
 * Admin: marca una visita como completada. Si la solicitud pertenece a un plan
 * recurrente (frecuencia ≠ única), agenda automáticamente la siguiente visita.
 * Devuelve el id de la visita generada, si la hubo.
 */
export async function completarSolicitud(s: Solicitud): Promise<string | null> {
  await patch(s.id, { estado: "completada" });
  if (s.frecuencia === "unica") return null;
  return agendarSiguienteVisita(s);
}

async function agendarSiguienteVisita(s: Solicitud): Promise<string> {
  const database = requireDb();
  const siguiente: Record<string, unknown> = {
    clienteId: s.clienteId,
    clienteEmail: s.clienteEmail,
    nombre: s.nombre,
    telefono: s.telefono,
    tipoServicio: s.tipoServicio,
    direccion: s.direccion,
    fechaDeseada: proximaFecha(s.fechaDeseada, s.frecuencia),
    horaDeseada: s.horaDeseada,
    frecuencia: s.frecuencia,
    serieId: s.serieId || s.id,
    estado: "agendada",
    creadoEn: serverTimestamp(),
  };
  if (s.email) siguiente.email = s.email;
  if (s.notas) siguiente.notas = s.notas;
  if (s.ubicacion) siguiente.ubicacion = { lat: s.ubicacion.lat, lng: s.ubicacion.lng };
  const ref = await addDoc(collection(database, COL), siguiente);
  return ref.id;
}

/** Siguiente fecha (YYYY-MM-DD) según la frecuencia, siempre en el futuro. */
export function proximaFecha(iso: string, frecuencia: Frecuencia): string {
  const [y, m, d] = iso.split("-").map(Number);
  const fecha = new Date(y, (m || 1) - 1, d || 1);
  const avanzar = () => {
    if (frecuencia === "semanal") fecha.setDate(fecha.getDate() + 7);
    else if (frecuencia === "quincenal") fecha.setDate(fecha.getDate() + 14);
    else if (frecuencia === "mensual") fecha.setMonth(fecha.getMonth() + 1);
  };
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  let guard = 0;
  do {
    avanzar();
    guard += 1;
  } while (fecha < hoy && guard < 120);
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
