import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Send, Repeat } from "lucide-react";
import { solicitudSchema, hoyISO, type SolicitudFormValues } from "@/lib/validators";
import { crearSolicitud } from "@/lib/solicitudes";
import { obtenerCliente, guardarTelefonoCliente } from "@/lib/clientes";
import { useAuth } from "@/lib/auth";
import {
  FRECUENCIAS,
  TIPOS_SERVICIO,
  type Frecuencia,
  type SolicitudInput,
  type TipoServicio,
  type Ubicacion,
} from "@/types";
import { SERVICIOS } from "@/features/landing/content";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { MapaUbicacion } from "@/components/ui/MapaUbicacion";
import { useTranslation, translateText, tipoServicioLabel, frecuenciaLabelFull } from "@/i18n";

const ICON_BY_TIPO = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.icon])) as Record<
  TipoServicio,
  (typeof SERVICIOS)[number]["icon"]
>;

export default function FormularioSolicitud() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);

  const preset = useMemo<TipoServicio | undefined>(() => {
    const p = params.get("servicio");
    return TIPOS_SERVICIO.find((tt) => tt.value === p)?.value;
  }, [params]);
  const presetFrecuencia = useMemo<Frecuencia>(() => {
    const frecuencia = params.get("frecuencia");
    return FRECUENCIAS.find((item) => item.value === frecuencia)?.value ?? "unica";
  }, [params]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SolicitudFormValues>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      tipoServicio: preset,
      frecuencia: presetFrecuencia,
      direccion: "",
      ubicacion: null,
      fechaDeseada: "",
      horaDeseada: "",
      notas: "",
    },
  });

  // Prefill con los datos de la cuenta y el perfil del cliente.
  useEffect(() => {
    if (!user) return;
    if (user.displayName) setValue("nombre", user.displayName);
    if (user.email) setValue("email", user.email);
    obtenerCliente(user.uid)
      .then((c) => {
        if (c?.telefono) setValue("telefono", c.telefono);
      })
      .catch(() => undefined);
  }, [user, setValue]);

  const tipo = watch("tipoServicio");
  const frecuencia = watch("frecuencia");
  const notas = watch("notas") ?? "";

  const onUbicacion = (u: Ubicacion) => {
    setUbicacion(u);
    setValue("ubicacion", u, { shouldValidate: false });
  };
  const onDireccionDesdeMapa = (texto: string) => {
    if (!getValues("direccion")?.trim()) setValue("direccion", texto, { shouldValidate: true });
  };

  const onSubmit = async (values: SolicitudFormValues) => {
    setServerError(null);
    if (!user) {
      setServerError(t("form.error.session"));
      return;
    }
    const input: SolicitudInput = {
      nombre: values.nombre,
      telefono: values.telefono,
      email: values.email || undefined,
      tipoServicio: values.tipoServicio,
      frecuencia: values.frecuencia,
      direccion: values.direccion,
      ubicacion: ubicacion,
      fechaDeseada: values.fechaDeseada,
      horaDeseada: values.horaDeseada,
      locale,
      notas: values.notas || undefined,
    };

    try {
      const id = await crearSolicitud(input, { uid: user.uid, email: user.email ?? "" });
      guardarTelefonoCliente(user.uid, values.telefono).catch(() => undefined);
      // Navegación durable: incluye el id en la URL para que la confirmación
      // pueda cargarla vía obtenerSolicitud (no depende solo de location.state).
      navigate(`/solicitud-enviada?id=${id}`, {
        state: {
          resumen: {
            nombre: values.nombre,
            tipoServicio: values.tipoServicio,
            frecuencia: values.frecuencia,
            fechaDeseada: values.fechaDeseada,
            horaDeseada: values.horaDeseada,
          },
        },
      });
    } catch {
      setServerError(t("form.error.generic"));
    }
  };

  return (
    <div className="bg-brand-50/50 py-12 lg:py-16">
      <div className="container-app max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-500"
        >
          <ArrowLeft className="h-4 w-4" /> {t("form.backHome")}
        </Link>

        <div className="mt-4 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t("form.title")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">{t("form.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card mt-6 p-6 sm:p-8">
          <div className="grid gap-5">
            {/* Tipo de servicio — radio cards */}
            <fieldset>
              <legend className="label">
                {t("form.tipoServicio")} <span className="text-red-500">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {TIPOS_SERVICIO.map((opt) => {
                  const Icon = ICON_BY_TIPO[opt.value];
                  const selected = tipo === opt.value;
                  const inputId = `tipo-${opt.value}`;
                  return (
                    <label
                      key={opt.value}
                      htmlFor={inputId}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition ${
                        selected
                          ? "border-brand-500 bg-brand-50"
                          : "border-gray-200 hover:border-brand-300"
                      }`}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        value={opt.value}
                        className="sr-only"
                        {...register("tipoServicio")}
                      />
                      <Icon
                        className={`h-7 w-7 ${selected ? "text-brand-500" : "text-gray-400"}`}
                      />
                      <span className="text-sm font-semibold text-navy-800">
                        {tipoServicioLabel(opt.value, locale)}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.tipoServicio && (
                <p className="field-error" role="alert">
                  {translateText(errors.tipoServicio.message ?? "", locale)}
                </p>
              )}
            </fieldset>

            {/* Frecuencia — plan recurrente */}
            <fieldset>
              <legend className="label">
                <Repeat className="mr-1 inline h-4 w-4 text-brand-500" />
                {t("form.frecuencia")} <span className="text-red-500">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FRECUENCIAS.map((opt) => {
                  const selected = frecuencia === opt.value;
                  const inputId = `frec-${opt.value}`;
                  return (
                    <label
                      key={opt.value}
                      htmlFor={inputId}
                      className={`cursor-pointer rounded-lg border-2 px-3 py-2.5 text-center text-sm font-semibold transition ${
                        selected
                          ? "border-brand-500 bg-brand-50 text-brand-600"
                          : "border-gray-200 text-gray-600 hover:border-brand-300"
                      }`}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        value={opt.value}
                        className="sr-only"
                        {...register("frecuencia")}
                      />
                      {frecuenciaLabelFull(opt.value, locale)}
                    </label>
                  );
                })}
              </div>
              {frecuencia && frecuencia !== "unica" && (
                <p className="mt-1.5 text-xs text-gray-500">{t("form.frecuenciaHint")}</p>
              )}
              {errors.frecuencia && (
                <p className="field-error" role="alert">
                  {translateText(errors.frecuencia.message ?? "", locale)}
                </p>
              )}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={t("form.nombre")}
                htmlFor="nombre"
                required
                error={errors.nombre?.message ? translateText(errors.nombre.message, locale) : undefined}
              >
                <input
                  id="nombre"
                  type="text"
                  autoComplete="name"
                  placeholder={t("form.nombre.ph")}
                  className={`input ${errors.nombre ? "input-error" : ""}`}
                  {...register("nombre")}
                />
              </Field>

              <Field
                label={t("form.telefono")}
                htmlFor="telefono"
                required
                error={errors.telefono?.message ? translateText(errors.telefono.message, locale) : undefined}
              >
                <input
                  id="telefono"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("form.telefono.ph")}
                  className={`input ${errors.telefono ? "input-error" : ""}`}
                  {...register("telefono")}
                />
              </Field>
            </div>

            <Field
              label={t("form.email")}
              htmlFor="email"
              required
              error={errors.email?.message ? translateText(errors.email.message, locale) : undefined}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                className={`input ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
            </Field>

            <Field
              label={t("form.direccion")}
              htmlFor="direccion"
              required
              error={errors.direccion?.message ? translateText(errors.direccion.message, locale) : undefined}
            >
              <textarea
                id="direccion"
                rows={2}
                placeholder={t("form.direccion.ph")}
                className={`input ${errors.direccion ? "input-error" : ""}`}
                {...register("direccion")}
              />
            </Field>

            {/* Ubicación en el mapa (Leaflet) */}
            <div>
              <span id="mapa-ubicacion-label" className="label">
                {t("form.ubicacion")} <span className="font-normal text-gray-400">{t("common.optional")}</span>
              </span>
              <MapaUbicacion
                value={ubicacion}
                onChange={onUbicacion}
                onDireccion={onDireccionDesdeMapa}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={t("form.fechaDeseada")}
                htmlFor="fechaDeseada"
                required
                error={errors.fechaDeseada?.message ? translateText(errors.fechaDeseada.message, locale) : undefined}
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
                label={t("form.horaDeseada")}
                htmlFor="horaDeseada"
                required
                error={errors.horaDeseada?.message ? translateText(errors.horaDeseada.message, locale) : undefined}
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
              label={t("form.notas")}
              htmlFor="notas"
              hint={t("common.optional")}
              error={errors.notas?.message ? translateText(errors.notas.message, locale) : undefined}
            >
              <textarea
                id="notas"
                rows={3}
                maxLength={500}
                placeholder={t("form.notas.ph")}
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

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Spinner className="h-5 w-5" /> {t("common.sending")}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" /> {t("form.submit")}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400">{t("form.quoteNote")}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
