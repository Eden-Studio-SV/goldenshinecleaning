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
| `/ingresar` | Login con Google (clientes y admin; el rol se resuelve por la lista blanca) |
| `/solicitar` | Formulario (requiere sesión): tipo, **frecuencia**, **ubicación en mapa**, fecha/hora → confirmación |
| `/portal` | Portal del cliente — próximas e historial; cancelar, pedir reprogramación, aceptar/rechazar propuestas |
| `/admin` | Panel privado — lista en tiempo real + filtro por estado |
| `/admin/solicitud/:id` | Detalle + acciones (confirmar, rechazar, proponer fecha, completar) |

Código en [`app/src/`](app/src/): `features/landing`, `features/agendamiento`
(formulario + vistas/acciones compartidas), `features/portal`, `features/admin`,
`features/auth` (login + guards + `AuthArea`), `components/`, `lib/`, `types/`.

### Ciclo de vida de una solicitud

`pendiente → agendada → completada`, más `reprogramacion` (propuesta de nueva
fecha/hora **con confirmación** de la otra parte), `rechazada` y `cancelada`.
La máquina de estados vive en [`app/src/lib/lifecycle.ts`](app/src/lib/lifecycle.ts)
y la comparten el portal y el panel. Las limpiezas recurrentes (frecuencia ≠
única) agendan la siguiente visita automáticamente al completar la actual.

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
- **Firestore:** `solicitudes` (cada una con dueño `clienteId`) y `clientes`
  (perfil por `uid`). Reglas en `app/firestore.rules`: el cliente crea y gestiona
  solo lo suyo (transiciones acotadas), el admin tiene control total, nadie borra
  desde el cliente. Índices en `app/firestore.indexes.json`.
- **Auth:** login con Google para todos. El **admin** se distingue por la lista
  blanca en `VITE_ADMIN_EMAILS` (cliente) y en `firestore.rules` (servidor) —
  mantener ambos en sync. Admin actual: `info@edenstudio.dev`. Cualquier otra
  cuenta de Google entra como **cliente**.
- **Mapa:** Leaflet + OpenStreetMap (tiles gratis) y geocodificación inversa
  best-effort con Nominatim. No requiere API key.

Desplegar reglas/índices:

```bash
cd app
firebase deploy --only firestore:rules,firestore:indexes
```

## Despliegue (Vercel)

Automático en cada push a `main`. `vercel.json` (en la raíz) instala y construye
`app/`, sirve `app/dist` y reescribe todas las rutas a `index.html` (SPA).
Producción: **https://goldenshine.edenstudio.dev**.
