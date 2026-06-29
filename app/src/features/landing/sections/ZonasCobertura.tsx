import { MapPin } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { ZONAS, CONTACTO } from "../content";

export function ZonasCobertura() {
  return (
    <section id="cobertura" className="bg-white py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow="Cobertura"
          titulo="Zonas donde trabajamos"
          sub={`Atendemos ${CONTACTO.ciudad}. ¿No ves tu zona? Escríbenos y lo confirmamos.`}
        />

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {ZONAS.map((z) => (
            <span
              key={z}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-brand-50 px-4 py-2 text-sm font-medium text-navy-800"
            >
              <MapPin className="h-4 w-4 text-brand-500" /> {z}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
