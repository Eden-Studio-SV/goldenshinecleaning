import { Hero } from "./sections/Hero";
import { Servicios } from "./sections/Servicios";
import { ComoFunciona } from "./sections/ComoFunciona";
import { PorQueElegirnos } from "./sections/PorQueElegirnos";
import { Testimonios } from "./sections/Testimonios";
import { ZonasCobertura } from "./sections/ZonasCobertura";
import { CtaFinal } from "./sections/CtaFinal";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Servicios />
      <ComoFunciona />
      <PorQueElegirnos />
      <Testimonios />
      <ZonasCobertura />
      <CtaFinal />
    </>
  );
}
