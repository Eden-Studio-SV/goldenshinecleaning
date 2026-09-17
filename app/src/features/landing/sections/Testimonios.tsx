import { Users, Building2, Briefcase, Home } from "lucide-react";
import { SectionHead } from "./SectionHead";
import { useTranslation } from "@/i18n";

export function Testimonios() {
  const { t } = useTranslation();

  const audiencias = [
    {
      icon: Home,
      tituloKey: "audiencias.familias.title",
      descKey: "audiencias.familias.desc",
    },
    {
      icon: Building2,
      tituloKey: "audiencias.negocios.title",
      descKey: "audiencias.negocios.desc",
    },
    {
      icon: Briefcase,
      tituloKey: "audiencias.administradores.title",
      descKey: "audiencias.administradores.desc",
    },
    {
      icon: Users,
      tituloKey: "audiencias.hosts.title",
      descKey: "audiencias.hosts.desc",
    },
  ];

  return (
    <section id="audiencias" className="bg-brand-50 py-20 lg:py-24">
      <div className="container-app">
        <SectionHead
          eyebrow={t("audiencias.eyebrow")}
          titulo={t("audiencias.title")}
          sub={t("audiencias.sub")}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiencias.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.tituloKey} className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-500">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg">{t(a.tituloKey)}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{t(a.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}