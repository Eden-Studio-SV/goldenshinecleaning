import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import type { Cliente } from "@/types";

const COL = "clientes";

/**
 * Crea o actualiza el perfil del cliente (colección `clientes/{uid}`).
 * Se llama tras iniciar sesión. `creadoEn` se fija solo la primera vez.
 */
export async function upsertCliente(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<void> {
  if (!db) return;
  const ref = doc(db, COL, user.uid);
  const snap = await getDoc(ref);
  const base = {
    nombre: user.displayName || snap.data()?.nombre || "",
    email: user.email || "",
    actualizadoEn: serverTimestamp(),
  };
  if (snap.exists()) {
    await updateDoc(ref, base);
  } else {
    await setDoc(ref, { ...base, creadoEn: serverTimestamp() });
  }
}

export async function obtenerCliente(uid: string): Promise<Cliente | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, COL, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    nombre: data.nombre ?? "",
    email: data.email ?? "",
    telefono: data.telefono ?? undefined,
    creadoEn: data.creadoEn ?? null,
    actualizadoEn: data.actualizadoEn ?? null,
  };
}

/** Guarda el teléfono del cliente en su perfil (se reutiliza al solicitar). */
export async function guardarTelefonoCliente(uid: string, telefono: string): Promise<void> {
  if (!db || !telefono.trim()) return;
  await updateDoc(doc(db, COL, uid), {
    telefono: telefono.trim(),
    actualizadoEn: serverTimestamp(),
  });
}
