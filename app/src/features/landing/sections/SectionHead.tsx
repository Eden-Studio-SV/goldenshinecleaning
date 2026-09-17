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
        <span className="text-sm font-bold uppercase tracking-wider text-brand-600">{eyebrow}</span>
      )}
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
        {titulo}
      </h2>
      {sub && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-brand-100" : "text-slate-600"}`}>{sub}</p>}
    </div>
  );
}
