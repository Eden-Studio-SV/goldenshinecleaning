import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
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
  LocaleSolicitud,
  Solicitud,
  SolicitudInput,
} from "@/types";
import { estadoAlRechazarPropuesta } from "@/lib/lifecycle";
import {
  FRECUENCIAS_VALIDAS,
  TIPOS_SERVICIO_VALIDOS,
  esDomingoISO,
  esFechaISOValida,
  esHorarioValido,
  hoyISO,
} from "@/lib/validators";

const COL = "solicitudes";

function localeSolicitud(valor: unknown): LocaleSolicitud {
  return valor === "es" ? "es" : "en";
}

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
    locale: localeSolicitud(data.locale),
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
    email: (data.email ?? "").trim(),
    tipoServicio: data.tipoServicio,
    direccion: data.direccion.trim(),
    fechaDeseada: data.fechaDeseada,
    horaDeseada: data.horaDeseada,
    frecuencia: data.frecuencia,
    locale: localeSolicitud(data.locale),
    estado: "pendiente",
    creadoEn: serverTimestamp(),
  };
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

// ---- Transiciones del ciclo de vida -------------------------------------

/**
 * Invariante de transición de estado pura (sin Firestore). Devuelve true si el
 * paso `from -> to` es válido para el rol indicado, según el ciclo de vida de
 * confirmación de reprogramación. Usado por las funciones de transición y por
 * las pruebas unitarias; las reglas de Firestore son la frontera real.
 */
export function transicionValida(
  from: EstadoSolicitud,
  to: EstadoSolicitud,
  rol: Actor,
): boolean {
  if (rol === "admin") {
    // El admin tiene control total sobre el ciclo (confirmar, proponer,
    // rechazar, completar, cancelar, aceptar/rechazar propuesta).
    return (
      (from === "pendiente" && (to === "agendada" || to === "reprogramacion" || to === "rechazada")) ||
      (from === "agendada" && (to === "completada" || to === "reprogramacion" || to === "cancelada")) ||
      (from === "reprogramacion" && (to === "agendada" || to === "reprogramacion" || to === "cancelada"))
    );
  }
  // cliente
  return (
    (from === "pendiente" && to === "cancelada") ||
    (from === "agendada" && (to === "reprogramacion" || to === "cancelada")) ||
    (from === "reprogramacion" && (to === "agendada" || to === "cancelada"))
  );
}

/** Admin: confirma una solicitud pendiente (queda agendada con su fecha). */
export async function confirmarSolicitud(id: string): Promise<void> {
  const database = requireDb();
  await runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const actual = (snap.data().estado as EstadoSolicitud) ?? "pendiente";
    if (!transicionValida(actual, "agendada", "admin")) {
      throw new Error(`No se puede confirmar desde el estado "${actual}".`);
    }
    tx.update(doc(database, COL, id), {
      estado: "agendada",
      actualizadoEn: serverTimestamp(),
    });
  });
}

/** Admin: rechaza una solicitud (con motivo opcional). */
export async function rechazarSolicitud(id: string, motivo?: string): Promise<void> {
  const database = requireDb();
  await runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const actual = (snap.data().estado as EstadoSolicitud) ?? "pendiente";
    if (!transicionValida(actual, "rechazada", "admin")) {
      throw new Error(`No se puede rechazar desde el estado "${actual}".`);
    }
    tx.update(doc(database, COL, id), {
      estado: "rechazada",
      motivo: motivo?.trim() || null,
      actualizadoEn: serverTimestamp(),
    });
  });
}

/** Cliente o admin: cancela una solicitud. */
export async function cancelarSolicitud(id: string, motivo?: string): Promise<void> {
  const database = requireDb();
  await runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const actual = (snap.data().estado as EstadoSolicitud) ?? "pendiente";
    // El admin puede cancelar desde agendada/reprogramacion; el cliente también
    // desde pendiente. La frontera real es Firestore; aquí validamos lo común.
    if (actual === "completada" || actual === "rechazada" || actual === "cancelada") {
      throw new Error(`No se puede cancelar desde el estado "${actual}".`);
    }
    tx.update(doc(database, COL, id), {
      estado: "cancelada",
      motivo: motivo?.trim() || null,
      actualizadoEn: serverTimestamp(),
    });
  });
}

/**
 * Admin o cliente: propone otra fecha/hora. Deja la solicitud en
 * `reprogramacion` esperando confirmación de la otra parte.
 * Valida fecha/hora (no domingo, horario 08-19) antes de escribir.
 */
export async function proponerCambio(
  s: Solicitud,
  nueva: { fecha: string; hora: string; motivo?: string },
  por: Actor,
): Promise<void> {
  if (!nueva.fecha || esDomingoISO(nueva.fecha)) {
    throw new Error("La fecha propuesta no es válida (no domingos).");
  }
  if (!esHorarioValido(nueva.hora)) {
    throw new Error("La hora propuesta debe estar entre 08:00 y 19:00 (lun–sáb).");
  }
  const database = requireDb();
  const estadoPrevio =
    s.estado === "reprogramacion" ? (s.estadoPrevio ?? "agendada") : s.estado;
  await runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, s.id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const actual = (snap.data().estado as EstadoSolicitud) ?? "pendiente";
    if (!transicionValida(actual, "reprogramacion", por)) {
      throw new Error(`No se puede proponer un cambio desde el estado "${actual}".`);
    }
    tx.update(doc(database, COL, s.id), {
      estado: "reprogramacion",
      estadoPrevio,
      propuesta: {
        fecha: nueva.fecha,
        hora: nueva.hora,
        por,
        motivo: nueva.motivo?.trim() || null,
        creadaEn: serverTimestamp(),
      },
      actualizadoEn: serverTimestamp(),
    });
  });
}

/**
 * Acepta la propuesta vigente: aplica la nueva fecha/hora y vuelve a agendada.
 * Solo la parte contraria al autor de la propuesta puede aceptarla; si se pasa
 * `rol`, se valida dentro de la transacción que sea la contraria. Si no se pasa
 * `rol` (compatibilidad con llamadas existentes), solo valida que haya propuesta
 * vigente. No se apoya en el objeto `s` obsoleto: relee en la transacción.
 */
export async function aceptarPropuesta(
  s: Solicitud,
  rol?: Actor,
): Promise<void> {
  if (!s.propuesta) throw new Error("No hay propuesta que aceptar.");
  if (rol && s.propuesta.por === rol) {
    throw new Error("No puedes aceptar tu propia propuesta.");
  }
  if (esDomingoISO(s.propuesta.fecha) || !esHorarioValido(s.propuesta.hora)) {
    throw new Error("La propuesta tiene una fecha u hora inválida.");
  }
  const database = requireDb();
  await runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, s.id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const data = snap.data();
    const actual = (data.estado as EstadoSolicitud) ?? "pendiente";
    const propuesta = data.propuesta;
    if (actual !== "reprogramacion" || !propuesta) {
      throw new Error("No hay propuesta vigente que aceptar.");
    }
    if (rol && propuesta.por === rol) {
      throw new Error("No puedes aceptar tu propia propuesta.");
    }
    tx.update(doc(database, COL, s.id), {
      estado: "agendada",
      fechaDeseada: propuesta.fecha,
      horaDeseada: propuesta.hora,
      propuesta: null,
      estadoPrevio: null,
      actualizadoEn: serverTimestamp(),
    });
  });
}

/** Rechaza la propuesta vigente: vuelve al estado previo con la fecha original. */
export async function rechazarPropuesta(
  s: Solicitud,
  rol?: Actor,
): Promise<void> {
  if (!s.propuesta) throw new Error("No hay propuesta que rechazar.");
  if (rol && s.propuesta.por === rol) {
    throw new Error("No puedes rechazar tu propia propuesta.");
  }
  const database = requireDb();
  await runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, s.id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const data = snap.data();
    const actual = (data.estado as EstadoSolicitud) ?? "pendiente";
    const propuesta = data.propuesta;
    if (actual !== "reprogramacion" || !propuesta) {
      throw new Error("No hay propuesta vigente que rechazar.");
    }
    if (rol && propuesta.por === rol) {
      throw new Error("No puedes rechazar tu propia propuesta.");
    }
    const destino = estadoAlRechazarPropuesta({
      estadoPrevio: (data.estadoPrevio as EstadoSolicitud) ?? null,
    });
    tx.update(doc(database, COL, s.id), {
      estado: destino,
      propuesta: null,
      estadoPrevio: null,
      actualizadoEn: serverTimestamp(),
    });
  });
}

/**
 * Admin: marca una visita como completada de forma atómica e idempotente.
 * Si la solicitud pertenece a un plan recurrente (frecuencia ≠ única), agenda
 * automáticamente la siguiente visita usando un **id determinista**
 * (`{serieId}_{fechaSiguiente}`) para que la operación sea idempotente sin
 * depender de queries fuera de la transacción: dentro de la tx se lee ese doc
 * y, si ya existe, no se crea (set con merge sería idempotente pero crearía
 * un doc vacío; preferimos no escribir si ya existe). Todo ocurre dentro de
 * la misma transacción: no hay carrera ni objeto obsoleto.
 * Devuelve el id de la visita generada, si la hubo.
 */
export async function completarSolicitud(s: Solicitud): Promise<string | null> {
  const database = requireDb();

  return runTransaction(database, async (tx) => {
    const snap = await tx.get(doc(database, COL, s.id));
    if (!snap.exists()) throw new Error("La solicitud no existe.");
    const data = snap.data();
    const actual = (data.estado as EstadoSolicitud) ?? "pendiente";

    // Idempotencia: si ya está completada, no se vuelve a completar ni a
    // generar otra visita.
    if (actual === "completada") return null;
    if (!transicionValida(actual, "completada", "admin")) {
      throw new Error(`No se puede completar desde el estado "${actual}".`);
    }

    // Todo lo que determina la recurrencia procede del snapshot transaccional,
    // no del objeto que abrió la vista. Así los reintentos y carreras usan el
    // mismo origen que se marca como completado.
    const frecuencia = data.frecuencia as Frecuencia;
    const esRecurrente = frecuencia !== "unica";
    const serieId = esRecurrente ? ((data.serieId as string | null) || s.id) : null;
    const siguienteFecha = esRecurrente && serieId
      ? proximaFecha(data.fechaDeseada as string, frecuencia)
      : null;
    const siguienteId = serieId && siguienteFecha ? `${serieId}_${siguienteFecha}` : null;

    if (!siguienteId || !siguienteFecha || !serieId) {
      tx.update(doc(database, COL, s.id), {
        estado: "completada",
        actualizadoEn: serverTimestamp(),
      });
      return null;
    }

    // Firestore exige completar todas las lecturas de una transacción antes de
    // encolar escrituras. Leemos el documento determinista antes de actualizar
    // la visita origen para que las visitas recurrentes no fallen en runtime.
    const nextSnap = await tx.get(doc(database, COL, siguienteId));

    tx.update(doc(database, COL, s.id), {
      estado: "completada",
      actualizadoEn: serverTimestamp(),
    });

    // Idempotencia de recurrencia dentro de la tx: si ya existe, no lo creamos.
    if (nextSnap.exists()) return null;

    const siguiente: Record<string, unknown> = {
      clienteId: data.clienteId,
      clienteEmail: data.clienteEmail,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      tipoServicio: data.tipoServicio,
      direccion: data.direccion,
      fechaDeseada: siguienteFecha,
      horaDeseada: data.horaDeseada,
      frecuencia,
      locale: localeSolicitud(data.locale),
      serieId,
      estado: "agendada",
      creadoEn: serverTimestamp(),
    };
    if (data.notas) siguiente.notas = data.notas;
    if (data.ubicacion) {
      const ub = data.ubicacion;
      siguiente.ubicacion = { lat: ub.lat, lng: ub.lng };
    }
    tx.set(doc(database, COL, siguienteId), siguiente);
    return siguienteId;
  });
}

/** Siguiente fecha (YYYY-MM-DD) según la frecuencia, determinista y en el futuro. */
export function proximaFecha(iso: string, frecuencia: Frecuencia): string {
  if (!esFechaISOValida(iso)) {
    throw new Error(`Fecha inválida para proximaFecha: "${iso}"`);
  }
  const [y, m, d] = iso.split("-").map(Number);
  let fecha = new Date(Date.UTC(y, m - 1, d));
  const comoISO = (valor: Date) => valor.toISOString().slice(0, 10);
  const diasDelMes = (anio: number, mesCero: number) =>
    new Date(Date.UTC(anio, mesCero + 1, 0)).getUTCDate();

  const avanzar = () => {
    if (frecuencia === "semanal") fecha.setUTCDate(fecha.getUTCDate() + 7);
    else if (frecuencia === "quincenal") fecha.setUTCDate(fecha.getUTCDate() + 14);
    else if (frecuencia === "mensual") {
      // Una serie que cae en fin de mes conserva ese ancla: 31 ene → 28 feb →
      // 31 mar, en lugar de degradarse para siempre al día 28.
      const diaBase = fecha.getUTCDate();
      const eraFinDeMes = diaBase === diasDelMes(fecha.getUTCFullYear(), fecha.getUTCMonth());
      const mesDestino = fecha.getUTCMonth() + 1;
      const anioDestino = fecha.getUTCFullYear();
      const diasEnMesDestino = diasDelMes(anioDestino, mesDestino);
      fecha = new Date(Date.UTC(anioDestino, mesDestino, eraFinDeMes ? diasEnMesDestino : Math.min(diaBase, diasEnMesDestino)));
    }
    // Saltar domingos: si la fecha calculada cae en domingo (0), avanzar un día
    // al lunes. Esto preserves la invariante lun-sáb de Boston. Para semanal/
    // quincenal esto nunca debería ocurrir (preservan el día de la semana), pero
    // para mensual el día del mes puede caer en domingo según el calendario.
    if (fecha.getUTCDay() === 0) fecha.setUTCDate(fecha.getUTCDate() + 1);
  };

  let guard = 0;
  do {
    avanzar();
    guard += 1;
  } while (comoISO(fecha) < hoyISO() && guard < 6000);
  return comoISO(fecha);
}

// Re-export de catálogos para que la capa de datos pueda validar payloads
// entrantes sin depender directamente de validators (evita ciclo sutil).
export { TIPOS_SERVICIO_VALIDOS, FRECUENCIAS_VALIDAS };
