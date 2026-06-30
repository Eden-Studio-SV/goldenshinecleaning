import { z } from "zod";

/** Fecha local de hoy en formato YYYY-MM-DD (para comparar con input date). */
export function hoyISO(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export const solicitudSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre"),
  telefono: z
    .string()
    .trim()
    .min(8, "Teléfono inválido")
    .refine((v) => v.replace(/\D/g, "").length >= 8, "El teléfono debe tener al menos 8 dígitos"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  tipoServicio: z.enum(["residencial", "comercial", "profunda"], {
    errorMap: () => ({ message: "Selecciona un tipo de servicio" }),
  }),
  frecuencia: z.enum(["unica", "semanal", "quincenal", "mensual"], {
    errorMap: () => ({ message: "Selecciona una frecuencia" }),
  }),
  direccion: z.string().trim().min(5, "Ingresa la dirección"),
  ubicacion: z
    .object({ lat: z.number(), lng: z.number() })
    .nullable()
    .optional(),
  fechaDeseada: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine((v) => v >= hoyISO(), "La fecha no puede ser anterior a hoy"),
  horaDeseada: z.string().min(1, "Selecciona una hora"),
  notas: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type SolicitudFormValues = z.infer<typeof solicitudSchema>;

/** Validación de una propuesta de nueva fecha/hora (reprogramación). */
export const reprogramarSchema = z.object({
  fecha: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine((v) => v >= hoyISO(), "La fecha no puede ser anterior a hoy"),
  hora: z.string().min(1, "Selecciona una hora"),
  motivo: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type ReprogramarFormValues = z.infer<typeof reprogramarSchema>;
