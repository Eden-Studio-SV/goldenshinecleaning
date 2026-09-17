import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Send, Repeat, CheckCircle2, Calendar, Clock } from "lucide-react";
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
  const fechaDeseada = watch("fechaDeseada");
  const horaDeseada = watch("horaDeseada");
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
    <div className="bg-gradient-to-br from-slate-50 to-brand-50 py-12 lg:py-16 min-h-screen">
      <div className="container-app max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {t("form.backHome")}
        </Link>

        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{t("form.title")}</h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl leading-relaxed">{t("form.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Forms */}
          <div className="lg:col-span-8 animate-fade-in-up">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              
              {/* SECTION 1: Service */}
              <div className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-8 mb-8 border border-slate-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm">1</span>
                  <h2 className="text-2xl font-bold text-slate-900">Cleaning Needs</h2>
                </div>
                
                <div className="grid gap-6">
                  <fieldset>
                    <legend className="label mb-3">
                      {t("form.tipoServicio")} <span className="text-red-500">*</span>
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {TIPOS_SERVICIO.map((opt) => {
                        const Icon = ICON_BY_TIPO[opt.value];
                        const selected = tipo === opt.value;
                        const inputId = `tipo-${opt.value}`;
                        return (
                          <label
                            key={opt.value}
                            htmlFor={inputId}
                            className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
                              selected
                                ? "border-brand-500 bg-brand-50 shadow-md transform -translate-y-1"
                                : "border-slate-100 hover:border-brand-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              id={inputId}
                              type="radio"
                              value={opt.value}
                              className="sr-only"
                              {...register("tipoServicio")}
                            />
                            <div className={`p-3 rounded-xl ${selected ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-100 text-slate-500'}`}>
                               <Icon className="h-6 w-6" />
                            </div>
                            <span className={`text-sm font-bold ${selected ? 'text-brand-700' : 'text-slate-600'}`}>
                              {tipoServicioLabel(opt.value, locale)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.tipoServicio && (
                      <p className="mt-2 text-sm font-medium text-red-500 flex items-center gap-1" role="alert">
                        {translateText(errors.tipoServicio.message ?? "", locale)}
                      </p>
                    )}
                  </fieldset>

                  <fieldset>
                    <legend className="label mb-3">
                      <Repeat className="mr-2 inline h-4 w-4 text-brand-500" />
                      {t("form.frecuencia")} <span className="text-red-500">*</span>
                    </legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {FRECUENCIAS.map((opt) => {
                        const selected = frecuencia === opt.value;
                        const inputId = `frec-${opt.value}`;
                        return (
                          <label
                            key={opt.value}
                            htmlFor={inputId}
                            className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center text-sm font-bold transition-all ${
                              selected
                                ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                                : "border-slate-100 text-slate-500 hover:border-brand-300 hover:bg-slate-50"
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
                      <p className="mt-3 text-sm font-medium text-brand-600 bg-brand-50 p-3 rounded-xl">{t("form.frecuenciaHint")}</p>
                    )}
                    {errors.frecuencia && (
                      <p className="mt-2 text-sm font-medium text-red-500" role="alert">
                        {translateText(errors.frecuencia.message ?? "", locale)}
                      </p>
                    )}
                  </fieldset>
                </div>
              </div>

              {/* SECTION 2: Location & Time */}
              <div className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-8 mb-8 border border-slate-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm">2</span>
                  <h2 className="text-2xl font-bold text-slate-900">Time & Location</h2>
                </div>
                
                <div className="grid gap-6">
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
                        className={`input w-full h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-brand-500 focus:border-brand-500 font-medium ${errors.fechaDeseada ? "border-red-300 bg-red-50" : ""}`}
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
                        className={`input w-full h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-brand-500 focus:border-brand-500 font-medium ${errors.horaDeseada ? "border-red-300 bg-red-50" : ""}`}
                        {...register("horaDeseada")}
                      />
                    </Field>
                  </div>

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
                      className={`input w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-brand-500 focus:border-brand-500 font-medium resize-none ${errors.direccion ? "border-red-300 bg-red-50" : ""}`}
                      {...register("direccion")}
                    />
                  </Field>

                  <div>
                    <span id="mapa-ubicacion-label" className="label mb-3 block">
                      {t("form.ubicacion")} <span className="font-normal text-slate-400">{t("common.optional")}</span>
                    </span>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                       <MapaUbicacion
                         value={ubicacion}
                         onChange={onUbicacion}
                         onDireccion={onDireccionDesdeMapa}
                       />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Contact */}
              <div className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-8 mb-8 border border-slate-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm">3</span>
                  <h2 className="text-2xl font-bold text-slate-900">Contact Details</h2>
                </div>
                
                <div className="grid gap-6">
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
                        className={`input w-full h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-brand-500 focus:border-brand-500 font-medium ${errors.nombre ? "border-red-300 bg-red-50" : ""}`}
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
                        className={`input w-full h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-brand-500 focus:border-brand-500 font-medium ${errors.telefono ? "border-red-300 bg-red-50" : ""}`}
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
                      className={`input w-full h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-brand-500 focus:border-brand-500 font-medium ${errors.email ? "border-red-300 bg-red-50" : ""}`}
                      {...register("email")}
                    />
                  </Field>

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
                      className={`input w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-brand-500 focus:border-brand-500 font-medium resize-none ${errors.notas ? "border-red-300 bg-red-50" : ""}`}
                      {...register("notas")}
                    />
                    <p className="mt-2 text-right text-xs font-medium text-slate-400">{notas.length}/500</p>
                  </Field>

                  {serverError && (
                    <div className="rounded-2xl bg-red-50 p-4 border border-red-100 shadow-sm" role="alert">
                      <p className="text-sm font-medium text-red-700 text-center">{serverError}</p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button type="submit" className="w-full h-14 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-lg font-extrabold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Spinner className="h-6 w-6 text-white" /> <span className="ml-2">{t("common.sending")}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" /> {t("form.submit")}
                        </>
                      )}
                    </Button>
                    <p className="text-center text-sm font-medium text-slate-400 mt-4 leading-relaxed max-w-sm mx-auto">
                       {t("form.quoteNote")}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Sticky Summary (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
             <div className="bg-brand-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden animate-fade-in-up">
                <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] opacity-10 bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/95 to-brand-900/80" />
                
                <div className="relative z-10">
                   <h3 className="text-2xl font-extrabold text-white mb-8 border-b border-white/10 pb-4">Booking Summary</h3>
                   
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <div className="bg-white/10 p-3 rounded-xl h-12 w-12 flex items-center justify-center shrink-0">
                           {tipo ? (
                              (()=>{
                                const SelIcon = ICON_BY_TIPO[tipo];
                                return <SelIcon className="w-6 h-6 text-brand-300" />;
                              })()
                           ) : (
                              <CheckCircle2 className="w-6 h-6 text-white/40" />
                           )}
                         </div>
                         <div>
                            <p className="text-sm font-medium text-brand-200">Service Type</p>
                            <p className="text-lg font-bold text-white">
                              {tipo ? tipoServicioLabel(tipo, locale) : <span className="text-white/40">Select a service</span>}
                            </p>
                            {frecuencia && frecuencia !== "unica" && (
                               <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-brand-500/40 border border-brand-400/30 text-xs font-bold text-brand-100">
                                  {frecuenciaLabelFull(frecuencia, locale)}
                               </span>
                            )}
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <div className="bg-white/10 p-3 rounded-xl h-12 w-12 flex items-center justify-center shrink-0">
                           <Calendar className="w-6 h-6 text-brand-300" />
                         </div>
                         <div>
                            <p className="text-sm font-medium text-brand-200">Date</p>
                            <p className="text-lg font-bold text-white">
                              {fechaDeseada ? new Date(fechaDeseada).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", { weekday: 'long', month: 'long', day: 'numeric'}) : <span className="text-white/40">Select a date</span>}
                            </p>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <div className="bg-white/10 p-3 rounded-xl h-12 w-12 flex items-center justify-center shrink-0">
                           <Clock className="w-6 h-6 text-brand-300" />
                         </div>
                         <div>
                            <p className="text-sm font-medium text-brand-200">Time</p>
                            <p className="text-lg font-bold text-white">
                              {horaDeseada ? horaDeseada : <span className="text-white/40">Select a time</span>}
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-sm text-brand-100 leading-relaxed">
                        No payment required now. We will confirm your request and coordinate final details shortly.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
