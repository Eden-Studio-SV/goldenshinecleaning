# Golden Shine Cleaning Service

Aplicación web (español) para Golden Shine Cleaning Service: landing pública,
formulario de solicitud de agendamiento y panel administrativo. Implementada
según la especificación técnica de Edén Studio.

> **La app real vive en [`app/`](app/).** Vercel construye y sirve esa carpeta
> (ver `vercel.json`). Los archivos estáticos en la raíz (`index.html`,
> imágenes) son del MVP inicial y ya **no se sirven** — se conservan solo como
> referencia y pueden eliminarse.

## Stack

React 18 + Vite + TypeScript · Tailwind CSS · React Router v6 ·
react-hook-form + zod · Firebase (Firestore + Auth) · lucide-react.

## Estructura

| Ruta | Módulo |
|------|--------|
| `/` | Landing — hero, servicios, cómo funciona, por qué elegirnos, testimonios, cobertura, CTA |
| `/solicitar` | Formulario de solicitud (escribe en Firestore `solicitudes`) → confirmación |
| `/admin` | Panel privado (login con Google) — lista en tiempo real + filtro por estado |
| `/admin/solicitud/:id` | Detalle de solicitud + cambio de estado |

Código en [`app/src/`](app/src/): `features/landing`, `features/agendamiento`,
`features/admin`, `components/`, `lib/`, `types/`.

## Desarrollo local

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + build de producción a app/dist
```

La config local de Firebase va en `app/.env` (no se commitea). Ver
`app/.env.example`. La config web de producción está en `app/.env.production`
(la API key web de Firebase es pública por diseño; la seguridad la dan las
reglas + dominios autorizados + lista de administradores).

## Backend (Firebase)

- **Proyecto:** `golden-shine-sv-75c26`.
- **Firestore:** colección `solicitudes`; reglas en `app/firestore.rules`
  (crear público y validado; leer/actualizar solo administradores; sin borrado
  desde el cliente). Índices en `app/firestore.indexes.json`.
- **Auth:** login con Google. Administradores en `VITE_ADMIN_EMAILS` (cliente)
  y en `firestore.rules` (servidor) — mantener ambos en sync. Admin actual:
  `info@edenstudio.dev`.

Desplegar reglas/índices:

```bash
cd app
firebase deploy --only firestore:rules,firestore:indexes
```

## Despliegue (Vercel)

Automático en cada push a `main`. `vercel.json` (en la raíz) instala y construye
`app/`, sirve `app/dist` y reescribe todas las rutas a `index.html` (SPA).
Producción: **https://goldenshine.edenstudio.dev**.
