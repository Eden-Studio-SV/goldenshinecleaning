import { Helmet } from "react-helmet-async";
import { useTranslation } from "@/i18n";

export function SEO() {
  const { locale } = useTranslation();

  const title =
    locale === "es"
      ? "Golden Shine — Servicio Profesional de Limpieza"
      : "Golden Shine — Professional Cleaning Service";

  const description =
    locale === "es"
      ? "Limpieza residencial, post-construcción, profunda, recurrente, mudanza y Airbnb en Boston, MA. Solicita tu servicio en línea."
      : "Residential, post-construction, deep, recurring, move-in/out and Airbnb cleaning in Boston, MA. Request your cleaning online.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Golden Shine Cleaning",
    image: "https://goldenshine.edenstudio.dev/hero-bg.jpg",
    description: description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boston",
      addressRegion: "MA",
      addressCountry: "US",
    },
    openingHours: "Mo,Tu,We,Th,Fr,Sa 08:00-19:00",
    url: "https://goldenshine.edenstudio.dev",
    priceRange: "$$",
    servesCuisine: "Cleaning Service",
  };

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://goldenshine.edenstudio.dev" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://goldenshine.edenstudio.dev/hero-bg.jpg" />
      <meta property="og:locale" content={locale === "es" ? "es_ES" : "en_US"} />
      <meta property="og:locale:alternate" content={locale === "es" ? "en_US" : "es_ES"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://goldenshine.edenstudio.dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://goldenshine.edenstudio.dev/hero-bg.jpg" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
