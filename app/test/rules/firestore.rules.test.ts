import {
  assertSucceeds,
  assertFails,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { afterAll, beforeAll, describe, it, expect } from "vitest";

/**
 * Pruebas de las reglas de Firestore contra el emulador.
 * Se ejecutan con: npm run test:rules
 * (firebase emulators:exec --only firestore --project demo-goldenshine 'vitest run --dir test/rules')
 *
 * El admin real del allowlist es info@edenstudio.dev (email_verified:true).
 * No se cambia el allowlist real; los tests lo usan tal cual.
 */

const PROJECT_ID = "demo-goldenshine";
const ADMIN_EMAIL = "info@edenstudio.dev";
const CLIENT_EMAIL = "cliente@correo.com";
const OTRO_CLIENTE_EMAIL = "otro@correo.com";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: PROJECT_ID });
});

afterAll(async () => {
  if (env) await env.cleanup();
});

function adminDb() {
  return env.authenticatedContext(ADMIN_EMAIL, {
    email: ADMIN_EMAIL,
    email_verified: true,
  }).firestore();
}

function clientDb(email: string, uid?: string) {
  return env
    .authenticatedContext(uid ?? email, {
      email,
      email_verified: true,
    })
    .firestore();
}

function anonDb() {
  return env.unauthenticatedContext().firestore();
}

const solicitudValida = {
  clienteId: "cliente@correo.com",
  clienteEmail: CLIENT_EMAIL,
  nombre: "Ana",
  telefono: "5551234567",
  email: CLIENT_EMAIL,
  tipoServicio: "residencial",
  direccion: "123 Beacon St, Boston",
  fechaDeseada: "2099-09-18",
  horaDeseada: "10:00",
  frecuencia: "unica",
  estado: "pendiente",
};

describe("clientes/{uid}", () => {
  it("cliente crea su perfil", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertSucceeds(
      db.collection("clientes").doc(CLIENT_EMAIL).set({
        email: CLIENT_EMAIL,
        nombre: "Ana",
      }),
    );
  });

  it("cliente no puede crear perfil de otro uid", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("clientes").doc(OTRO_CLIENTE_EMAIL).set({
        email: OTRO_CLIENTE_EMAIL,
        nombre: "Otro",
      }),
    );
  });

  it("admin lee cualquier perfil", async () => {
    const dbAdmin = adminDb();
    const dbClient = clientDb(CLIENT_EMAIL);
    await dbClient.collection("clientes").doc(CLIENT_EMAIL).set({
      email: CLIENT_EMAIL,
      nombre: "Ana",
    });
    await assertSucceeds(dbAdmin.collection("clientes").doc(CLIENT_EMAIL).get());
  });

  it("cliente no puede cambiar su email (inmutable)", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await db.collection("clientes").doc(CLIENT_EMAIL).set({
      email: CLIENT_EMAIL,
      nombre: "Ana",
    });
    await assertFails(
      db.collection("clientes").doc(CLIENT_EMAIL).update({ email: "nuevo@correo.com" }),
    );
  });

  it("anónimo no puede leer perfiles", async () => {
    const db = anonDb();
    await assertFails(db.collection("clientes").doc(CLIENT_EMAIL).get());
  });
});

describe("solicitudes — create", () => {
  it("cliente crea su propia solicitud válida", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertSucceeds(db.collection("solicitudes").add(solicitudValida));
  });

  it("cliente no puede crear solicitud con clienteId ajeno", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("solicitudes").add({ ...solicitudValida, clienteId: OTRO_CLIENTE_EMAIL }),
    );
  });

  it("rechaza estado distinto a pendiente en creación", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("solicitudes").add({ ...solicitudValida, estado: "agendada" }),
    );
  });

  it("rechaza tipo de servicio inválido", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("solicitudes").add({ ...solicitudValida, tipoServicio: "industrial" }),
    );
  });

  it("acepta los nuevos tipos de servicio", async () => {
    const db = clientDb(CLIENT_EMAIL);
    for (const t of ["post_construccion", "mudanza", "airbnb"]) {
      await assertSucceeds(
        db.collection("solicitudes").add({ ...solicitudValida, tipoServicio: t }),
      );
    }
  });

  it("rechaza frecuencia inválida", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("solicitudes").add({ ...solicitudValida, frecuencia: "anual" }),
    );
  });

  it("acepta locale en/es y documentos históricos sin locale", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertSucceeds(db.collection("solicitudes").add({ ...solicitudValida, locale: "en" }));
    await assertSucceeds(db.collection("solicitudes").add({ ...solicitudValida, locale: "es" }));
    await assertSucceeds(db.collection("solicitudes").add(solicitudValida));
  });

  it("rechaza locale inválido o que no sea string", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(db.collection("solicitudes").add({ ...solicitudValida, locale: "fr" }));
    await assertFails(db.collection("solicitudes").add({ ...solicitudValida, locale: 1 }));
  });

  it("rechaza email vacío (obligatorio)", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("solicitudes").add({ ...solicitudValida, email: "" }),
    );
  });

  it("rechaza hora con formato inválido", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(
      db.collection("solicitudes").add({ ...solicitudValida, horaDeseada: "8:00" }),
    );
  });

  it("rechaza payloads con campos arbitrarios o ubicación fuera de rango", async () => {
    const db = clientDb(CLIENT_EMAIL);
    await assertFails(db.collection("solicitudes").add({ ...solicitudValida, rol: "admin" }));
    await assertFails(
      db.collection("solicitudes").add({
        ...solicitudValida,
        ubicacion: { lat: 91, lng: -71 },
      }),
    );
  });

  it("admin puede crear (siguiente visita recurrente)", async () => {
    const db = adminDb();
    await assertSucceeds(
      db.collection("solicitudes").add({
        ...solicitudValida,
        estado: "agendada",
        serieId: "serie-1",
      }),
    );
  });

  it("anónimo no puede crear", async () => {
    const db = anonDb();
    await assertFails(db.collection("solicitudes").add(solicitudValida));
  });
});

describe("solicitudes — read", () => {
  it("admin lee todas", async () => {
    const dbAdmin = adminDb();
    const dbClient = clientDb(CLIENT_EMAIL);
    await dbClient.collection("solicitudes").add(solicitudValida);
    await assertSucceeds(dbAdmin.collection("solicitudes").get());
  });

  it("cliente lee solo las suyas", async () => {
    const dbClient = clientDb(CLIENT_EMAIL);
    const dbOtro = clientDb(OTRO_CLIENTE_EMAIL);
    await dbClient.collection("solicitudes").add(solicitudValida);
    await dbOtro.collection("solicitudes").add({
      ...solicitudValida,
      clienteId: OTRO_CLIENTE_EMAIL,
      clienteEmail: OTRO_CLIENTE_EMAIL,
      email: OTRO_CLIENTE_EMAIL,
    });
    // El cliente propio puede leer la suya
    const own = await dbClient
      .collection("solicitudes")
      .where("clienteId", "==", CLIENT_EMAIL)
      .get();
    expect(own.empty).toBe(false);
    // El otro cliente no puede leer la de CLIENT_EMAIL
    await assertFails(
      dbOtro
        .collection("solicitudes")
        .where("clienteId", "==", CLIENT_EMAIL)
        .get(),
    );
  });

  it("anónimo no puede leer", async () => {
    const db = anonDb();
    await assertFails(db.collection("solicitudes").get());
  });
});

describe("solicitudes — update transiciones del cliente", () => {
  async function crearComoCliente(email: string, data: Record<string, unknown>) {
    const db = clientDb(email);
    const ref = await db.collection("solicitudes").add(data);
    return ref;
  }

  it("cliente cancela desde pendiente", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertSucceeds(ref.update({ estado: "cancelada", motivo: "x" }));
  });

  it("cliente no puede confirmar (pasar a agendada)", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertFails(ref.update({ estado: "agendada" }));
  });

  it("cliente no puede cambiar clienteId (inmutable)", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertFails(ref.update({ clienteId: OTRO_CLIENTE_EMAIL }));
  });

  it("cliente no puede cambiar tipoServicio (inmutable)", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertFails(ref.update({ tipoServicio: "comercial" }));
  });

  it("cliente no puede cambiar direccion (inmutable)", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertFails(ref.update({ direccion: "otra" }));
  });

  it("cliente no puede cambiar locale", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, { ...solicitudValida, locale: "en" });
    await assertFails(ref.update({ locale: "es" }));
  });

  it("cancelar no permite alterar datos de la solicitud", async () => {
    const ref = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertFails(ref.update({ estado: "cancelada", nombre: "Cuenta tomada" }));
  });

  it("cliente propone reprogramacion desde agendada (via admin primero)", async () => {
    // Crear como admin en estado agendada para el cliente
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "agendada",
    });
    const dbCliente = clientDb(CLIENT_EMAIL);
    await assertSucceeds(
      dbCliente.collection("solicitudes").doc(ref.id).update({
        estado: "reprogramacion",
        estadoPrevio: "agendada",
        propuesta: {
          fecha: "2099-09-19",
          hora: "11:00",
          por: "cliente",
          motivo: null,
        },
      }),
    );
  });

  it("cliente no puede proponer desde pendiente ni sobrescribir una propuesta", async () => {
    const pendiente = await crearComoCliente(CLIENT_EMAIL, solicitudValida);
    await assertFails(
      pendiente.update({
        estado: "reprogramacion",
        estadoPrevio: "pendiente",
        propuesta: { fecha: "2099-09-19", hora: "11:00", por: "cliente" },
      }),
    );
    const ref = await adminDb().collection("solicitudes").add({
      ...solicitudValida,
      estado: "reprogramacion",
      estadoPrevio: "agendada",
      propuesta: { fecha: "2099-09-19", hora: "11:00", por: "admin" },
    });
    await assertFails(
      clientDb(CLIENT_EMAIL).collection("solicitudes").doc(ref.id).update({
        propuesta: { fecha: "2099-09-21", hora: "11:00", por: "cliente" },
      }),
    );
  });

  it("cliente no puede proponer con por == admin (falsa autoría)", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "agendada",
    });
    // El update se hace con el contexto del cliente, no con el ref del admin.
    const dbCliente = clientDb(CLIENT_EMAIL);
    await assertFails(
      dbCliente.collection("solicitudes").doc(ref.id).update({
        estado: "reprogramacion",
        estadoPrevio: "agendada",
        propuesta: { fecha: "2099-09-19", hora: "11:00", por: "admin", motivo: null },
      }),
    );
  });

  it("cliente acepta propuesta del admin (contraria)", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "reprogramacion",
      estadoPrevio: "agendada",
      propuesta: { fecha: "2099-09-19", hora: "11:00", por: "admin", motivo: null },
    });
    const dbCliente = clientDb(CLIENT_EMAIL);
    await assertSucceeds(
      dbCliente.collection("solicitudes").doc(ref.id).update({
        estado: "agendada",
        fechaDeseada: "2099-09-19",
        horaDeseada: "11:00",
        propuesta: null,
        estadoPrevio: null,
      }),
    );
  });

  it("cliente no puede aceptar su propia propuesta", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "reprogramacion",
      estadoPrevio: "agendada",
      propuesta: { fecha: "2099-09-19", hora: "11:00", por: "cliente", motivo: null },
    });
    const dbCliente = clientDb(CLIENT_EMAIL);
    await assertFails(
      dbCliente.collection("solicitudes").doc(ref.id).update({
        estado: "agendada",
        fechaDeseada: "2099-09-19",
        horaDeseada: "11:00",
        propuesta: null,
        estadoPrevio: null,
      }),
    );
  });

  it("cliente solo responde una propuesta del admin desde reprogramación y con sus datos exactos", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "reprogramacion",
      estadoPrevio: "agendada",
      propuesta: { fecha: "2099-09-19", hora: "11:00", por: "admin" },
    });
    const cliente = clientDb(CLIENT_EMAIL).collection("solicitudes").doc(ref.id);
    await assertFails(cliente.update({
      estado: "agendada", fechaDeseada: "2099-09-20", horaDeseada: "11:00",
      propuesta: null, estadoPrevio: null,
    }));
    await assertFails(cliente.update({
      estado: "pendiente", propuesta: null, estadoPrevio: null,
    }));
    await assertFails(cliente.update({
      estado: "agendada", fechaDeseada: "2099-09-19", horaDeseada: "11:00",
      propuesta: null, estadoPrevio: null, telefono: "5550000000",
    }));
  });

  it("cliente puede rechazar una propuesta del admin solo restaurando el estado previo", async () => {
    const ref = await adminDb().collection("solicitudes").add({
      ...solicitudValida,
      estado: "reprogramacion",
      estadoPrevio: "agendada",
      propuesta: { fecha: "2099-09-19", hora: "11:00", por: "admin" },
    });
    const cliente = clientDb(CLIENT_EMAIL).collection("solicitudes").doc(ref.id);
    await assertSucceeds(cliente.update({ estado: "agendada", propuesta: null, estadoPrevio: null }));
  });

  it("cliente no puede completar", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "agendada",
    });
    const dbCliente = clientDb(CLIENT_EMAIL);
    await assertFails(dbCliente.collection("solicitudes").doc(ref.id).update({ estado: "completada" }));
  });
});

describe("solicitudes — update admin", () => {
  it("admin puede cambiar estado libremente", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "pendiente",
    });
    await assertSucceeds(ref.update({ estado: "agendada" }));
    await assertSucceeds(ref.update({ estado: "completada" }));
  });
});

describe("solicitudes — delete", () => {
  it("cliente no puede borrar", async () => {
    const db = clientDb(CLIENT_EMAIL);
    const ref = await db.collection("solicitudes").add(solicitudValida);
    await assertFails(ref.delete());
  });
  it("admin no puede borrar (regla estricta)", async () => {
    const dbAdmin = adminDb();
    const ref = await dbAdmin.collection("solicitudes").add({
      ...solicitudValida,
      estado: "pendiente",
    });
    await assertFails(ref.delete());
  });
});

describe.each(["mailDeliveries", "mailRateLimits"])("colección interna %s", (coleccion) => {
  it("deniega lectura y escritura a clientes, incluido un admin autenticado por SDK cliente", async () => {
    await env.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection(coleccion).doc("interno").set({ estado: "interno" });
    });
    const cliente = clientDb(CLIENT_EMAIL).collection(coleccion).doc("interno");
    const adminCliente = adminDb().collection(coleccion).doc("interno");

    await assertFails(cliente.get());
    await assertFails(clientDb(CLIENT_EMAIL).collection(coleccion).get());
    await assertFails(cliente.set({ estado: "cliente" }));
    await assertFails(cliente.update({ estado: "cliente" }));
    await assertFails(adminCliente.get());
    await assertFails(adminDb().collection(coleccion).get());
    await assertFails(adminCliente.set({ estado: "admin-cliente" }));
    await assertFails(adminCliente.update({ estado: "admin-cliente" }));
  });
});
