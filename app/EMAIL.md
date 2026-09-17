# Correo transaccional (Functions Gen2)

`functions/` contiene el backend separado de la SPA. El trigger Gen2
`enviarCorreoSolicitud` observa `solicitudes/{id}`; no hay endpoint HTTP ni el
cliente puede seleccionar destinatarios. Usa la identidad administrada de
Firebase Admin, no una cuenta de servicio descargada.

## Alcance y seguridad

- Solo envía desde `goldenshinecleaning@edenstudio.dev`. No hay avisos al negocio
  en esta fase; estos continúan deshabilitados.
- El destinatario se resuelve por `clienteId` con Admin Auth. Debe estar
  verificado y coincidir, sin distinguir mayúsculas, con `clienteEmail` del
  documento. Documentos heredados o inválidos se suprimen. `data.email` del
  formulario nunca se utiliza como destinatario.
- El trigger clasifica exclusivamente las transiciones del ciclo de vida. Las
  actualizaciones de timestamps o campos no semánticos se ignoran. `locale` es
  opcional (`en` por defecto, `es` cuando vale exactamente `es`).
- SMTP solo acepta 465 (TLS implícito) o 587 (STARTTLS obligatorio), valida
  direcciones/CRLF y aplica timeouts. El usuario SMTP es independiente del
  remitente.
- Nunca se registran cuerpo, dirección, credenciales ni configuración SMTP. Los
  errores guardados son códigos sin PII.

## Configuración de producción (manual, no ejecutada)

Se requiere proyecto Firebase con **Blaze**, Firestore, Functions Gen2 y que el
remitente SMTP esté verificado por el proveedor. Antes de desplegar, un operador
autorizado debe crear/rotar los secretos y configurar los parámetros con el CLI
de Firebase según su procedimiento seguro:

| Nombre runtime | Uso | Valor por defecto |
| --- | --- | --- |
| `SMTP_HOST` | host SMTP | sin valor |
| `SMTP_PORT` | `465` o `587` | `587` |
| `SMTP_EMAIL` | secreto: usuario SMTP | sin valor |
| `SMTP_PASSWORD` | secreto: contraseña SMTP | sin valor |
| `MAIL_FROM` | remitente fijo | `goldenshinecleaning@edenstudio.dev` |
| `MAIL_ENABLED` | habilita entrega explícitamente | `false` |
| `APP_BASE_URL` | base HTTPS opcional para enlace al portal | vacío |
| `MAIL_MAX_ATTEMPTS` | máximo de intentos, 1–10 | `4` |
| `MAIL_PER_USER_HOUR` | tope horario por cliente | `10` |
| `MAIL_GLOBAL_HOUR` | tope horario global | `100` |

`SMTP_EMAIL` y `SMTP_PASSWORD` son secretos declarados con `defineSecret`; no
se guardan en `.credentials`, `.env`, el repositorio ni la configuración web.
`.credentials` está ignorado y no se lee, copia ni imprime. Si una credencial fue
expuesta fuera de este repositorio, debe rotarse sin registrar su valor. Al
rotarla, actualice el secreto y despliegue deliberadamente la función con las
aprobaciones correspondientes. `MAIL_ENABLED` debe mantenerse en `false` hasta
que se confirme la configuración y la prueba controlada.

El proyecto usa Node 22 en `functions/package.json`; Node 20 no debe usarse para
este backend. El bloque `functions` de `firebase.json` compila antes de un
despliegue manual. No se modificó el script de despliegue habitual de la SPA.

## Entrega, idempotencia y límites

Cada evento se reclama en `mailDeliveries/{sha256(eventId:documento:type)}` mediante una
transacción, con estados `pending`, `sending`, `sent`, `failed` y `suppressed`.
La lease expirada vuelve a lanzar un error reintentable, para que el reintento
de la plataforma no pierda el evento después de un crash. Errores SMTP 4xx/de
red usan `retry: true`; configuración, destinatario o SMTP permanente se
suprimen. Los límites por uid y global reducen abuso/coste.

Los contadores viven en `mailRateLimits/{hora}:global` y
`mailRateLimits/{hora}:uid:{sha256(uid)}`. La transacción lee el delivery y los
dos contadores antes de escribir, por lo que el coste por mensaje es O(1) y no
escanea entregas históricas. Solo almacena hashes y metadatos operativos: nunca
cuerpo ni destinatario. Ambos tipos incluyen `expiresAt`; se puede habilitar una
política TTL de Firestore sobre ese campo como limpieza operativa opcional.

Esto reduce duplicados, pero no promete entrega *exactly once*: un crash después
de que SMTP acepte el mensaje y antes de escribir `sent` puede entregar un
duplicado. El `messageId` estable facilita que proveedores/clientes lo detecten,
sin ser una garantía.

Las reglas actuales no conceden acceso cliente a `mailDeliveries` ni
`mailRateLimits`; Firebase Admin las omite. No añada permisos de cliente a esas
colecciones.

## Pruebas locales

```bash
cd app
npm run functions:build
npm run functions:test
npm run functions:test:coverage
npm run functions:test:integration
```

La integración inicia y detiene Firestore Emulator (8081) mediante
`emulators:exec`; usa `demo-goldenshine`, Admin SDK y un transporte SMTP falso,
por lo que no conecta a SMTP Internet ni entrega correos. Requiere Java para el
emulador. Si se interrumpe, termine el proceso hijo con `Ctrl+C`.

La QA independiente final ejecutó todas las verificaciones con resultado exit 0:
lint/build SPA, `functions:build`, 308 pruebas SPA con cobertura, 41 de reglas,
20 de Functions (12 unitarias y 8 de integración con Firestore real y SMTP
falso) y 51 E2E. No se envió correo real. El binding Gen2 se verifica con SDK
mockeado; no sustituye una ejecución runtime en Functions Emulator.

## Despliegue manual

El único script dedicado es `npm run deploy:functions`, equivalente a
`firebase deploy --only functions:mail`: `mail` es el codebase declarado en
`firebase.json`. No forma parte de `npm run deploy`, no se ejecutó aquí y exige
confirmación explícita del operador antes de usarlo.
