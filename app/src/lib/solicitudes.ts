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
import type { EstadoSolicitud, Solicitud, SolicitudInput } from "@/types";

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
    nombre: data.nombre ?? "",
    telefono: data.telefono ?? "",
    email: data.email ?? undefined,
    tipoServicio: data.tipoServicio,
    direccion: data.direccion ?? "",
    fechaDeseada: data.fechaDeseada ?? "",
    horaDeseada: data.horaDeseada ?? "",
    notas: data.notas ?? undefined,
    estado: (data.estado as EstadoSolicitud) ?? "pendiente",
    creadoEn: data.creadoEn ?? null,
    actualizadoEn: data.actualizadoEn ?? null,
  };
}

/** Crea una solicitud pública. Siempre fuerza estado "pendiente". */
export async function crearSolicitud(data: SolicitudInput): Promise<string> {
  const database = requireDb();
  const payload: Record<string, unknown> = {
    nombre: data.nombre.trim(),
    telefono: data.telefono.trim(),
    tipoServicio: data.tipoServicio,
    direccion: data.direccion.trim(),
    fechaDeseada: data.fechaDeseada,
    horaDeseada: data.horaDeseada,
    estado: "pendiente",
    creadoEn: serverTimestamp(),
  };
  if (data.email && data.email.trim()) payload.email = data.email.trim();
  if (data.notas && data.notas.trim()) payload.notas = data.notas.trim();

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

export async function obtenerSolicitud(id: string): Promise<Solicitud | null> {
  const database = requireDb();
  const snap = await getDoc(doc(database, COL, id));
  return snap.exists() ? mapDoc(snap) : null;
}

export async function actualizarEstado(id: string, estado: EstadoSolicitud): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COL, id), {
    estado,
    actualizadoEn: serverTimestamp(),
  });
}
