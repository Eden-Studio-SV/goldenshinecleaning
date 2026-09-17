import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO } from "../content";
import { useTranslation } from "@/i18n";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="inicio" className="relative min-h-[90vh] bg-slate-50 flex flex-col justify-end">
      {/* Background Image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/hero-bg.jpg"
          alt="Professional home cleaning"
          className="w-full h-full object-cover object-center"
        />
        {/* Very light overlay to ensure some text contrast if it overflows, though we use a card */}
        <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply" />
      </div>

      <div className="container-app relative z-10 pb-24 lg:pb-32 pt-32 xl:pt-40">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Card Overlay */}
          <div className="lg:col-span-7 xl:col-span-7 bg-brand-500 text-white rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-100 mb-6">
              <ShieldCheck className="h-5 w-5" /> {t("hero.badge")}
            </span>

            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              {t(HERO.tituloKey)}
            </h1>

            <p className="text-lg md:text-xl text-brand-50 mb-8 max-w-lg leading-relaxed">
              {t(HERO.subtituloKey)}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link to="/solicitar" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-brand-600 hover:bg-brand-50 rounded-full px-8 py-6 text-lg font-semibold shadow-xl">
                  {t(HERO.ctaPrimarioKey)} <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-brand-400/50">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-brand-500 object-cover"
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Customer"
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center text-brand-100">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                    <span className="ml-1 text-sm text-white font-bold">5.0</span>
                  </div>
                  <span className="text-xs text-brand-200">Rated Best Over 2k Reviews</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Special Price Box (Now visible on mobile too) */}
          <div className="flex lg:col-span-5 xl:col-span-5 flex-col justify-end items-end pb-0 lg:pb-8">
             <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[1.5rem] shadow-xl w-full max-w-md lg:max-w-sm mx-auto lg:mx-0 lg:ml-auto border border-white/50">
                <div className="bg-brand-100 text-brand-700 text-sm font-bold text-center py-2 rounded-t-[1rem] -mt-6 -mx-6 mb-4">
                  Special Offer This Month
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-slate-800 font-bold text-lg">Deep Clean</h4>
                    <p className="text-sm text-slate-500">Thorough and detailed</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-extrabold text-brand-600">Get 15%</span>
                    <span className="text-xs text-slate-400">Off first booking</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-slate-800 font-bold text-lg">Regular</h4>
                    <p className="text-sm text-slate-500">Weekly or Bi-weekly</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-extrabold text-brand-600">Save 20%</span>
                    <span className="text-xs text-slate-400">Recurring plans</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}