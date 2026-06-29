interface SectionHeadProps {
  eyebrow?: string;
  titulo: string;
  sub?: string;
  dark?: boolean;
  className?: string;
}

export function SectionHead({ eyebrow, titulo, sub, dark = false, className = "" }: SectionHeadProps) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-500">{eyebrow}</span>
      )}
      <h2 className={`mt-2 text-3xl font-extrabold sm:text-4xl ${dark ? "text-white" : "text-navy-800"}`}>
        {titulo}
      </h2>
      {sub && <p className={`mt-4 text-lg ${dark ? "text-white/70" : "text-gray-600"}`}>{sub}</p>}
    </div>
  );
}
