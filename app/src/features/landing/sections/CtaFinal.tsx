import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CtaFinal() {
  return (
    <section className="bg-navy-900 py-16 lg:py-20">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-navy-800 px-8 py-12 text-center shadow-xl sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          />
          <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
            ¿Listo para un espacio impecable?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">
            Solicita tu limpieza en menos de un minuto. Te contactamos para confirmar fecha y hora.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link to="/solicitar">
              <Button variant="gold" size="lg">
                Solicitar limpieza <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
