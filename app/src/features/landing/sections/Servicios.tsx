import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { SERVICIOS } from "../content";
import { SectionHead } from "./SectionHead";

export function Servicios() {
  return (
    <section id="servicios" className="bg-white py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow="Nuestros servicios"
          titulo="Limpieza para cada espacio"
          sub="Elige el servicio que necesitas. Todos con la misma atención al detalle."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICIOS.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.id}
                className="card flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand-50 text-brand-500">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl">{s.titulo}</h3>
                <p className="mt-2 text-gray-600">{s.descripcion}</p>

                <ul className="mt-5 space-y-2 text-sm text-gray-600">
                  {s.incluye.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {i}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-2">
                  <Link
                    to={`/solicitar?servicio=${s.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 transition-all hover:gap-2"
                  >
                    Solicitar este servicio <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
