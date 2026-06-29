import { Star } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { TESTIMONIOS } from "../content";

export function Testimonios() {
  return (
    <section id="testimonios" className="bg-brand-50 py-20 lg:py-24">
      <div className="container-app">
        <SectionHead eyebrow="Testimonios" titulo="Lo que dicen nuestros clientes" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIOS.map((t) => (
            <figure key={t.nombre} className="card flex flex-col p-7">
              <div className="flex" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-gray-700">“{t.texto}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-800 font-bold text-white">
                  {t.inicial}
                </span>
                <span>
                  <span className="block font-semibold text-navy-800">{t.nombre}</span>
                  <span className="block text-sm text-gray-500">{t.ciudad}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
