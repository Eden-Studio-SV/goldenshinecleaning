# Testing — Golden Shine (app/)

Documentación técnica de la infraestructura de pruebas de la SPA `app/`:
pruebas unitarias (Vitest), de reglas de Firestore (emulador) y E2E (Playwright).

## Stack

- **Unitarias y componentes**: Vitest 3 + jsdom + Testing Library + coverage v8.
- **Reglas**: `@firebase/rules-unit-testing` sobre el emulador de Firestore (Firebase 11).
- **E2E**: Playwright Chromium contra Auth y Firestore Emulator reales.
- **Correo backend**: Functions Gen2 aisladas en `functions/`, con Vitest Node y
  una integración contra Firestore Emulator más un transporte SMTP inyectado.
- **Emuladores**: `firebase-tools` local (el CLI global puede estar roto).

## Scripts

Desde `app/` (o desde raíz con `npm --prefix app run <script>`):

| Script | Descripción |
| --- | --- |
| `npm run test` | Suite unitaria completa (Vitest, una pasada). |
| `npm run test:unit` | Pruebas unitarias de lógica y servicios (`test/unit`). |
| `npm run test:watch` | Vitest en modo watch. |
| `npm run test:coverage` | Unitarias + reporte de cobertura (v8) en `coverage/`. |
| `npm run test:rules` | Pruebas de reglas de Firestore contra el emulador. |
| `npm run test:e2e` | Playwright; crea emuladores y Vite propio en 5174, sin reutilizar procesos ajenos. |
| `npm run functions:build` | Compila el backend de correo (no forma parte de Vite). |
| `npm run functions:test` | Unitarias de clasificación, plantillas y transporte. |
| `npm run functions:test:coverage` | Cobertura v8 sobre todo `functions/src`. |
| `npm run functions:test:integration` | Arranca/detiene Firestore Emulator y usa un SMTP falso local. |
| `npm run emulators` | Inicia Firestore (8081) y Auth (9100), project `demo-goldenshine`. Detener con `Ctrl+C`. |

### Ejecución reproducible

Desde `app/`:

```bash
npm ci
# Solo si Playwright informa que falta Chromium:
npx playwright install chromium
npm run lint          # type-check de la app; no es ESLint
npm run lint:tests    # type-check de pruebas/configuración
npm test              # unitarias y componentes
npm run test:rules    # arranca y detiene Firestore Emulator local
npm run test:e2e      # arranca y detiene Auth/Firestore Emulator + Vite locales
npm run build
```

`test:rules` requiere Java (JDK 17+). Se usa el `firebase-tools` instalado en
este proyecto, no un CLI global. Playwright gestiona sus propios procesos y al
terminar deja libres 5174 (Vite), 8081 (Firestore) y 9100 (Auth).

### Reglas de Firestore (`test:rules`)

Levanta el emulador de Firestore, carga `firestore.rules` y corre Vitest sobre
`test/rules/`:

```
npm run test:rules
```

Requiere Java (JDK 17+) para el emulador. El `firebase-tools` local provee el
binario en `node_modules/.bin/firebase`; no depende del CLI global.

## Seguridad

- **Sin bypass de auth/reglas**: los emuladores aplican las mismas reglas de
  Firestore y exigen sesión. `VITE_USE_EMULATORS=true` solo conecta la SPA a
  los emuladores locales (Auth 9100, Firestore 8081) en desarrollo; nunca en
  producción.
- **Allowlist real**: las reglas y los tests usan el admin real
  `info@edenstudio.dev` con `email_verified: true`. No se cambia el allowlist.
- **Sin UI test auth en producción**: Playwright inyecta los datos Firebase del
  demo por variables de entorno de proceso (en `playwright.config.ts`), no lee
  `.env`. El `webServer` usa puerto fijo 5174 y `reuseExistingServer: false`
  (no reutiliza servidor ajeno).
- **No se leen ni imprimen `.env` ni secretos**: los valores de Firebase del
  demo son públicos por diseño (`demo-goldenshine`).

## Cobertura

- `npm run test:coverage` genera `coverage/` (text, html, json-summary).
- El denominador incluye todo `src/**/*.{ts,tsx}` salvo declaraciones y tipos;
  no se excluye UI para mejorar la cifra.
- La cobertura real se mide al ejecutar; no se afirma cobertura completa sin
  medición. Revisa `coverage/index.html` tras correr el script.
- **QA independiente final (todo exit 0)**: `lint` de la app, build SPA y
  `functions:build` pasaron;
  `test:coverage` completó 308 pruebas en 27 archivos, `test:rules` 41,
  Functions 20 (incluye 8 de integración) y E2E 51. El total de pruebas únicas
  informado es **420** (`308 + 41 + 20 + 51`); las 12 unitarias de Functions no
  se suman otra vez porque forman parte de esas 20.
- Cobertura SPA: **94.14% statements/líneas**, **79.28% ramas** y **82.51%
  funciones**. Cobertura Functions (`functions/src`): **93.30%
  statements/líneas**, **86.76% ramas** y **96% funciones**.
- No hubo `skip`, `only` ni envío de correo real. Tras E2E los puertos usados
  quedaron libres.

## Matriz de requisitos y pruebas

| Área | Cobertura concreta |
| --- | --- |
| Auth y autorización | 6 E2E de login, guardias, logout y `returnTo`; fixture con sesión SDK contra Auth Emulator. |
| Formulario | 9 E2E: campos obligatorios, fecha pasada/domingo, horario, preset `?servicio=`, creación Firestore y confirmación por query. |
| Portal y administración | 13 E2E: vacío, listado, filtros, detalle, transiciones, propuestas y completar recurrencia. |
| Recurrencia | La visita completada crea una nueva card `agendada` con ID determinista; pruebas unitarias validan el orden de lecturas/escrituras y E2E la creación sin duplicados. |
| Landing y accesibilidad | 18 E2E: contenido EN/ES, navegación, viewport desktop 1280/tablet 768/móvil 375, menú y básicos a11y. |
| Errores externos | 4 E2E: geocoding y tiles interceptados, más listener Firestore reintentable con estado estable. |
| Reglas | 36 pruebas contra Firestore Emulator, incluyendo allowlist admin y `email_verified`. |

La cobertura no es una garantía de comportamiento al 100%. Las rutas se ejercen
por E2E, pero `main.tsx`, `AdminApp` y `PortalApp` no tienen cobertura unitaria
directa; la cobertura de auth/firebase también es menor que la del dominio.

## Estructura

```
app/
  test/
    setup.ts                         # setup Vitest (jest-dom, stubs jsdom)
    unit/
      validators.test.ts             # zod schemas, horario, fechas, catálogos
      format.test.ts                 # formatFecha/formatTimestamp + locale
      lifecycle.test.ts              # accionesDisponibles/mensajeEstado/...
      solicitudes-logic.test.ts      # proximaFecha (fin de mes) + transicionValida
      auth.test.tsx                  # isAdminEmail + useAuth sin Firebase
      clientes.test.ts               # upsert/obtener/guardarTelefono (mocks)
      solicitudes.test.ts            # crear/observar/transacciones (mocks)
    components/                       # pruebas React
    rules/
      firestore.rules.test.ts        # reglas reales emulador (positivos + denegados)
  e2e/
    *.spec.ts                         # landing, auth, formulario, portal y admin
  vitest.config.ts
  playwright.config.ts
  tsconfig.test.json
```

## Notas

- Los tests unitarios de `clientes.ts` y `solicitudes.ts` aíslan Firestore con
  `vi.mock` para no tocar servicios reales.
- `completarSolicitud` usa `runTransaction` para atomicidad e idempotencia:
  no duplica visitas recurrentes y no se apoya en objetos obsoletos.
- `proximaFecha` mensual conserva el ancla de fin de mes (31 ene -> 28/29 feb
  -> 31 mar) y usa fechas de calendario UTC; el calendario de reservas usa
  America/New_York.
- Las transiciones de estado se validan con `transicionValida` (pura) y las
  reglas de Firestore son la frontera real.
- El reset/seed REST de E2E está forzado a `127.0.0.1` y
  `demo-goldenshine`; usa únicamente APIs administrativas del emulador. El
  fixture local inicia una sesión real contra Auth Emulator porque el popup
  OAuth del emulador queda en “Connecting…”. El flujo OAuth de producción no
  está verificado por esta suite.
- Un listener de Firestore con error transitorio es reintentado por el SDK; las
  E2E verifican que portal y admin mantienen un estado vacío utilizable mientras
  el transporte se recupera. Los callbacks de error de las suscripciones se
  cubren también en pruebas unitarias.
- No se verifica OAuth Google de producción: el fixture inicia una sesión SDK
  real únicamente contra Auth Emulator. Tampoco hay ejecución en Safari o
  Firefox, ni prueba de entrega real por correo o teléfono. El binding Gen2 se
  prueba unitariamente con SDK mockeado; no es una ejecución del trigger en
  Functions Emulator.

## Pendientes de producto y producción

- Los datos de negocio reales siguen pendientes: se esperan los nombres
  `VITE_CONTACT_PHONE`, `VITE_CONTACT_EMAIL` y las demás variables públicas
  `VITE_*` definidas por la app; esta documentación no lee ni revela valores.
- Functions de correo se prueban con Firestore Emulator real y transporte SMTP
  falso; no validan una entrega SMTP ni el trigger Functions Emulator en runtime.
- No se desplegaron la app ni las reglas. Debe conservarse la allowlist de admin
  y el requisito `email_verified`; queda pendiente un smoke de producción con
  autorización explícita.
