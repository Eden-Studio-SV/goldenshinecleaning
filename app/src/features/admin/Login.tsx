import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, Info } from "lucide-react";
import { useAuth } from "./useAuth";
import { isFirebaseConfigured } from "@/firebase";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { Brand } from "@/components/layout/Brand";

interface LoginForm {
  email: string;
  password: string;
}

const ERRORES: Record<string, string> = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/invalid-email": "Correo inválido.",
  "auth/user-not-found": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
  "auth/network-request-failed": "Error de red. Verifica tu conexión.",
};

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: "", password: "" } });

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/admin";

  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }: LoginForm) => {
    setError(null);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (e) {
      const code = (e as { code?: string })?.code;
      setError((code && ERRORES[code]) || "No se pudo iniciar sesión. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Brand onDark />
        </div>

        <div className="card mt-6 p-7">
          <h1 className="text-center text-xl font-bold text-navy-800">Acceso del personal</h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Ingresa con tu cuenta para ver las solicitudes.
          </p>

          {!isFirebaseConfigured && (
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Firebase no está conectado todavía. El login estará disponible cuando se configuren
                las credenciales.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-4">
            <Field label="Correo" htmlFor="email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`input ${errors.email ? "input-error" : ""}`}
                placeholder="personal@goldenshine.com"
                {...register("email", { required: "Ingresa tu correo" })}
              />
            </Field>

            <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                {...register("password", { required: "Ingresa tu contraseña" })}
              />
            </Field>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Spinner className="h-5 w-5" /> Ingresando…
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" /> Ingresar
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <Link to="/" className="text-sm text-white/60 hover:text-white">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
