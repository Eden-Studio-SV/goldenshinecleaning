import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Send, Info } from "lucide-react";
import { solicitudSchema, hoyISO, type SolicitudFormValues } from "@/lib/validators";
import { crearSolicitud } from "@/lib/solicitudes";
import { isFirebaseConfigured } from "@/firebase";
import { TIPOS_SERVICIO, type SolicitudInput, type TipoServicio } from "@/types";
import { SERVICIOS, CONTACTO } from "@/features/landing/content";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";

const ICON_BY_TIPO = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.icon])) as Record<
  TipoServicio,
  (typeof SERVICIOS)[number]["icon"]
>;

export default function FormularioSolicitud() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const preset = useMemo<TipoServicio | undefined>(() => {
    const p = params.get("servicio");
    return TIPOS_SERVICIO.find((t) => t.value === p)?.value;
  }, [params]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SolicitudFormValues>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      tipoServicio: preset,
      direccion: "",
      fechaDeseada: "",
      horaDeseada: "",
      notas: "",
    },
  });

  const tipo = watch("tipoServicio");
  const notas = watch("notas") ?? "";

  const onSubmit = async (values: SolicitudFormValues) => {
    setServerError(null);
    const input: SolicitudInput = {
      nombre: values.nombre,
      telefono: values.telefono,
      email: values.email || undefined,
      tipoServicio: values.tipoServicio,
      direccion: values.direccion,
      fechaDeseada: values.fechaDeseada,
      horaDeseada: values.horaDeseada,
      notas: values.notas || undefined,
    };

    try {
      if (isFirebaseConfigured) {
        await crearSolicitud(input);
      } else {
        // Modo demo: sin backend todavía. Simula el envío para poder probar el flujo.
        await new Promise((r) => setTimeout(r, 600));
      }
      navigate("/solicitud-enviada", {
        state: {
          resumen: {
            nombre: values.nombre,
            tipoServicio: values.tipoServicio,
            fechaDeseada: values.fechaDeseada,
            horaDeseada: values.horaDeseada,
          },
          demo: !isFirebaseConfigured,
        },
      });
    } catch {
      setServerError(
        `No pudimos enviar tu solicitud. Intenta de nuevo o llámanos al ${CONTACTO.telefono}.`,
      );
    }
  };

  return (
    <div className="bg-brand-50/50 py-12 lg:py-16">
      <div className="container-app max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>

        <div className="mt-4 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Solicita tu limpieza</h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Completa el formulario y te contactaremos para confirmar la fecha y hora. Toma menos de
            un minuto.
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              <strong>Modo demostración.</strong> El backend (Firebase) aún no está conectado, por lo
              que las solicitudes no se guardan. El flujo y la validación funcionan para que puedas
              probarlos.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card mt-6 p-6 sm:p-8">
          <div className="grid gap-5">
            {/* Tipo de servicio — radio cards */}
            <div>
              <span className="label">
                Tipo de servicio <span className="text-red-500">*</span>
              </span>
              <div className="grid gap-3 sm:grid-cols-3">
                {TIPOS_SERVICIO.map((opt) => {
                  const Icon = ICON_BY_TIPO[opt.value];
                  const selected = tipo === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition ${
                        selected
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 hover:border-brand-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        className="sr-only"
                        {...register("tipoServicio")}
                      />
                      <Icon
                        className={`h-7 w-7 ${selected ? "text-brand-500" : "text-gray-400"}`}
                      />
                      <span className="text-sm font-semibold text-navy-800">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.tipoServicio && (
                <p className="field-error" role="alert">
                  {errors.tipoServicio.message}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" htmlFor="nombre" required error={errors.nombre?.message}>
                <input
                  id="nombre"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className={`input ${errors.nombre ? "input-error" : ""}`}
                  {...register("nombre")}
                />
              </Field>

              <Field label="Teléfono" htmlFor="telefono" required error={errors.telefono?.message}>
                <input
                  id="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(555) 123-4567"
                  className={`input ${errors.telefono ? "input-error" : ""}`}
                  {...register("telefono")}
                />
              </Field>
            </div>

            <Field
              label="Correo"
              htmlFor="email"
              hint="(opcional)"
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                className={`input ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
            </Field>

            <Field label="Dirección" htmlFor="direccion" required error={errors.direccion?.message}>
              <textarea
                id="direccion"
                rows={2}
                placeholder="Calle, número, colonia, referencias…"
                className={`input ${errors.direccion ? "input-error" : ""}`}
                {...register("direccion")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Fecha deseada"
                htmlFor="fechaDeseada"
                required
                error={errors.fechaDeseada?.message}
              >
                <input
                  id="fechaDeseada"
                  type="date"
                  min={hoyISO()}
                  className={`input ${errors.fechaDeseada ? "input-error" : ""}`}
                  {...register("fechaDeseada")}
                />
              </Field>

              <Field
                label="Hora deseada"
                htmlFor="horaDeseada"
                required
                error={errors.horaDeseada?.message}
              >
                <input
                  id="horaDeseada"
                  type="time"
                  className={`input ${errors.horaDeseada ? "input-error" : ""}`}
                  {...register("horaDeseada")}
                />
              </Field>
            </div>

            <Field
              label="Notas adicionales"
              htmlFor="notas"
              hint="(opcional)"
              error={errors.notas?.message}
            >
              <textarea
                id="notas"
                rows={3}
                maxLength={500}
                placeholder="Cuéntanos cualquier detalle (mascotas, accesos, áreas prioritarias…)"
                className={`input ${errors.notas ? "input-error" : ""}`}
                {...register("notas")}
              />
              <p className="mt-1 text-right text-xs text-gray-400">{notas.length}/500</p>
            </Field>

            {serverError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {serverError}
              </p>
            )}

            <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Spinner className="h-5 w-5" /> Enviando…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" /> Solicitar limpieza
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400">
              Al enviar aceptas que te contactemos para coordinar tu servicio.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
