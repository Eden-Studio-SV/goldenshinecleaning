import { SectionHead } from "./SectionHead";
import { POR_QUE } from "../content";

export function PorQueElegirnos() {
  return (
    <section id="por-que" className="bg-white py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow="Por qué elegirnos"
          titulo="Confianza que se nota en cada detalle"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POR_QUE.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.titulo} className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold-dark">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg">{p.titulo}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{p.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
