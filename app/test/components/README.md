# Pruebas de componentes

Estas pruebas se ejecutan con Vitest y Testing Library, sin Firebase ni red. Los dobles de `auth`, `solicitudes`, `clientes`, Leaflet y geolocalización viven en `mocks.ts` o se declaran en el archivo que los necesita.

## Mapa de cobertura

| Área | Casos cubiertos |
| --- | --- |
| UI base | `Button`, `Spinner`, `Badge` y `Field`: variantes, accesibilidad, mensajes de error y controles junto a contenido auxiliar. |
| Layout público | `App`, `Brand`, `Navbar`, `Footer`, `PublicLayout` y `ScrollToTop`: navegación, idioma, menú móvil/teclado, persistencia, ausencia de contactos configurados, scroll por ruta y router raíz. |
| Landing | `LandingPage`, `SectionHead` y secciones: contenido de servicios, tarjeta recurrente con frecuencia semanal, CTAs y textos EN/ES sin testimonios, métricas ni coberturas no confirmadas. |
| Autenticación | `Login`, guards y `AuthArea`: Firebase no configurado, carga, errores de Google, rutas protegidas y retorno con `pathname`, `search` y `hash`. |
| Solicitudes | Formulario, confirmación, resumen y acciones: validaciones, presets válidos de servicio/frecuencia, carga/error, recarga con `id`, pertenencia, roles, estados y diálogos; el formulario compone `Field` real. |
| Portal y panel | Apps, layouts, listas y detalles: navegación, filtros, carga, vacío, error y detalle inexistente, con rutas dinámicas reales para validar `useParams`. |
| Mapa | `MapaUbicacion`: estado sin punto, geolocalización, alternativa manual de dirección y errores de geolocalización/geocodificación. |

## Criterios

- Usar `user-event` para interacción cuando sea práctico; no basarse exclusivamente en snapshots.
- Restaurar mocks, temporizadores y `window.confirm` al terminar cada caso.
- Llamar `resetComponentMocks()` en `beforeEach` de suites que cambien auth, Firebase o solicitudes; cada callback de suscripción se declara explícitamente en el caso.
- Mantener Firestore/Firebase completamente mockeados: las pruebas de componentes no escriben datos reales.
- Las pruebas de reglas y E2E están fuera de este directorio.
