/** Fechas de calendario para E2E, independientes de la zona horaria del host. */
export function fechaFuturaDiaUTC(dia: number, ahora = new Date()): string {
  if (!Number.isInteger(dia) || dia < 0 || dia > 6) {
    throw new Error("El día de semana debe estar entre 0 y 6.");
  }

  const fecha = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate()));
  const diasHastaSiguiente = (dia - fecha.getUTCDay() + 7) % 7 || 7;
  fecha.setUTCDate(fecha.getUTCDate() + diasHastaSiguiente + 7);
  return fecha.toISOString().slice(0, 10);
}
