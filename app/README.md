# Golden Shine — Aplicación (React + Vite + Firebase)

Implementación real del sistema (fase 2) según la especificación técnica de Edén Studio:

1. **Landing pública** (`/`)
2. **Formulario de solicitud** (`/solicitar`) → escribe en Firestore
3. **Panel administrativo** (`/admin/*`) → login + gestión de solicitudes en tiempo real

> El sitio ofrece contenido en **inglés y español**. Stack: React 18 + Vite + TypeScript, Tailwind CSS,
> React Router v6, react-hook-form + zod, Firebase (Firestore + Auth + Hosting),
> lucide-react.

El backend SMTP transaccional Gen2 vive fuera del bundle Vite en
[`functions/`](./functions/). Consulta su configuración segura, eventos y
operación manual en [`EMAIL.md`](./EMAIL.md).

La QA independiente final completó 420 pruebas únicas: 308 SPA, 41 de reglas,
20 de Functions y 51 E2E. No se desplegó ni se envió correo real.

## Requisitos

- Node.js 18+ y npm.
- Un proyecto de Firebase (Firestore + Authentication habilitados).

## Puesta en marcha

```bash
cd app
npm install
cp .env.example .env     # rellena las credenciales de Firebase
npm run dev              # http://localhost:5173
```

Sin un `.env` válido la app arranca en **modo demostración**: la UI y la
validación funcionan, pero no se guardan solicitudes ni hay login real.

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Servidor de desarrollo (Vite). |
| `npm run build` | Type-check (`tsc -p tsconfig.json --noEmit`) + build de producción a `dist/`. |
| `npm run preview` | Sirve el build de `dist/` localmente. |
| `npm run lint` | Solo type-check. |
| `npm run functions:build` | Compila el backend Functions Node 22. |
| `npm run functions:test` | Pruebas unitarias aisladas del backend de correo. |
| `npm run functions:test:coverage` | Cobertura v8 de todo `functions/src`. |
| `npm run functions:test:integration` | Firestore Emulator + transporte SMTP falso; no envía correo real. |
| `npm run deploy:functions` | Despliegue manual exclusivo del codebase `mail` (no ejecutar sin aprobación). |
| `npm run lint:tests` | Type-check de la infraestructura de pruebas. |
| `npm run test` | Suite Vitest de unitarias y componentes. |
| `npm run test:unit` | Pruebas unitarias de librerías y servicios. |
| `npm run test:rules` | Reglas reales contra Firestore Emulator local. |
| `npm run test:e2e` | Playwright Chromium contra Auth y Firestore Emulator locales. |
| `npm run deploy` | Build + `firebase deploy` (hosting + reglas + índices). |

`lint` y `lint:tests` ejecutan TypeScript; no hay ESLint configurado. Consulta
[`TESTING.md`](./TESTING.md) para los prerrequisitos (Java para reglas, Chromium
si Playwright lo solicita), comandos reproducibles, cobertura y límites de QA.

## Configuración de Firebase

1. **Crear proyecto** en <https://console.firebase.google.com>.
2. **Firestore Database** → crear en modo producción.
3. **Authentication** → habilitar proveedor **Correo/Contraseña**.
4. **Usuarios del personal**: crear manualmente en Authentication → Users
   (v1 no tiene auto-registro).
5. **App web**: Project settings → Tus apps → Web → copiar el config a `.env`.
6. **`.firebaserc`**: reemplazar `REEMPLAZAR_CON_FIREBASE_PROJECT_ID` por el ID real.
7. **Desplegar reglas e índices**:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
    ```

Para Functions de correo se requieren además Blaze, un remitente SMTP verificado
por el proveedor, parámetros y secretos configurados manualmente. El remitente
permitido por código es `goldenshinecleaning@edenstudio.dev`; esta documentación
no confirma que el dominio esté verificado. Mantener `MAIL_ENABLED=false` hasta
la autorización operativa; los avisos al negocio permanecen deshabilitados.

## Modelo de datos

Colección `solicitudes` (ver `src/types/index.ts`). El formulario público solo
puede **crear** con `estado: "pendiente"`; leer/actualizar requiere sesión; no se
permite borrar desde el cliente (ver `firestore.rules`).

## Estructura

```
src/
├── firebase.ts            init de Firebase (config por env)
├── lib/                   solicitudes (CRUD), validators (zod), format
├── types/                 tipos del dominio
├── components/ui|layout/  primitivos y layout
└── features/
    ├── landing/           LandingPage + sections + content.ts
    ├── agendamiento/      FormularioSolicitud + Confirmacion
    └── admin/             Login, PanelLayout, Lista, Detalle, useAuth, RutaPrivada
```

## Pendiente de contenido real (placeholders marcados con `TODO`)

- Datos de contacto (teléfono, WhatsApp, correo, horario, ciudad) en
  `src/features/landing/content.ts`.
- Testimonios y zonas de cobertura reales (mismo archivo).
- Foto del hero (hoy es un visual decorativo).
