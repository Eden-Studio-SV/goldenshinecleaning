import { spawn } from "node:child_process";
import net from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectId = "demo-goldenshine";
const authPort = 9100;
const firestorePort = 8081;
const startupTimeout = 60_000;
const logLines: string[] = [];

function sanitizeLog(line: string) {
  return line
    .replace(/([?&](?:key|token|secret|password|credential)=)[^&\s]+/gi, "$1[redacted]")
    .replace(/((?:api[_-]?key|token|secret|password|credential|authorization)\s*[:=]\s*)\S+/gi, "$1[redacted]")
    .slice(0, 500);
}

function emulatorLogs() {
  return logLines.length ? `\nSalida reciente del emulador:\n${logLines.join("\n")}` : "";
}

function captureLogs(chunk: Buffer | string) {
  for (const line of String(chunk).split(/\r?\n/)) {
    if (!line) continue;
    logLines.push(sanitizeLog(line));
  }
  if (logLines.length > 40) logLines.splice(0, logLines.length - 40);
}

function assertPortAvailable(port: number) {
  return new Promise<void>((resolvePromise, reject) => {
    const server = net.createServer();
    server.once("error", () => reject(new Error(`El puerto ${port} ya está ocupado; no se iniciará ni detendrá ningún proceso ajeno.`)));
    server.listen({ host: "127.0.0.1", port, exclusive: true }, () => {
      server.close((error) => error ? reject(error) : resolvePromise());
    });
  });
}

async function requestReady(url: string, accepts: (response: Response, body: unknown) => boolean) {
  const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
  const body = await response.json().catch(() => null);
  return accepts(response, body);
}

async function emulatorsReady() {
  const authReady = await requestReady(
    `http://127.0.0.1:${authPort}/emulator/v1/projects/${projectId}/config`,
    (response, body) => response.ok && typeof body === "object" && body !== null,
  );
  const firestoreReady = await requestReady(
    `http://127.0.0.1:${firestorePort}/v1/projects/${projectId}/databases/(default)/documents/e2ereadiness/probe`,
    (response, body) => response.status === 403
      && typeof body === "object"
      && body !== null
      && "error" in body
      && (body as { error?: { status?: string } }).error?.status === "PERMISSION_DENIED",
  );
  return authReady && firestoreReady;
}

function wait(milliseconds: number) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function waitForPortsReleased(timeout = 10_000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      await Promise.all([assertPortAvailable(authPort), assertPortAvailable(firestorePort)]);
      return;
    } catch {
      await wait(100);
    }
  }
  throw new Error("Los emuladores no liberaron los puertos 9100 y 8081 tras detenerse.");
}

export default async function globalSetup() {
  await Promise.all([assertPortAvailable(authPort), assertPortAvailable(firestorePort)]);

  const emulator = spawn(
    process.execPath,
    [resolve(appDir, "node_modules/firebase-tools/lib/bin/firebase.js"), "emulators:start", "--only", "firestore,auth", "--project", projectId],
    { cwd: appDir, detached: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  emulator.stdout?.on("data", captureLogs);
  emulator.stderr?.on("data", captureLogs);
  let spawnError: Error | undefined;
  emulator.once("error", (error) => {
    spawnError = error;
    captureLogs(error.message);
  });

  let cleanupPromise: Promise<void> | undefined;
  const cleanup = () => cleanupPromise ??= (async () => {
    if (emulator.pid && emulator.exitCode === null) {
      try { process.kill(-emulator.pid, "SIGTERM"); } catch { /* Ya no existe. */ }
    }
    await waitForPortsReleased();
  })();
  const cleanupOnExit = () => { void cleanup().catch(() => undefined); };
  process.once("exit", cleanupOnExit);

  const emulatorFailure = () => {
    if (spawnError) {
      return `No se pudo iniciar el proceso de emuladores: ${sanitizeLog(spawnError.message)}.${emulatorLogs()}`;
    }
    if (emulator.exitCode !== null) {
      return `El proceso de emuladores terminó antes de estar listo (código ${emulator.exitCode}).${emulatorLogs()}`;
    }
    return null;
  };

  try {
    const started = Date.now();
    while (Date.now() - started < startupTimeout) {
      const failure = emulatorFailure();
      if (failure) throw new Error(failure);
      try {
        if (await emulatorsReady()) break;
      } catch {
        // Aún no está listo; el timeout conserva el diagnóstico sanitizado.
      }
      await wait(250);
    }
    const failure = emulatorFailure();
    if (failure) throw new Error(failure);
    if (!(await emulatorsReady())) {
      throw new Error(`Los emuladores Auth y Firestore no respondieron para ${projectId} en ${startupTimeout / 1_000}s.${emulatorLogs()}`);
    }
  } catch (error) {
    await cleanup();
    process.off("exit", cleanupOnExit);
    throw error;
  }

  return async () => {
    try {
      await cleanup();
    } finally {
      process.off("exit", cleanupOnExit);
    }
  };
}
