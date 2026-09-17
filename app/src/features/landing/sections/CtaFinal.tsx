import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n";

export function CtaFinal() {
  const { t } = useTranslation();

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-brand-500 -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="container-app">
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white mb-8">
            <Sparkles className="h-8 w-8" />
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            {t("cta.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-brand-100 mb-10 leading-relaxed">
            {t("cta.sub")}
          </p>
          <div className="flex justify-center">
            <Link to="/solicitar">
              <Button className="bg-white text-brand-600 hover:bg-brand-50 rounded-full px-10 py-7 text-xl font-bold shadow-2xl transition-transform hover:scale-105">
                {t("cta.button")} <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}