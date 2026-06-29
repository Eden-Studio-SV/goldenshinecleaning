import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Brand({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Golden Shine — Inicio"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-navy-900">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="text-lg font-extrabold leading-none">
        <span className="text-gold">Golden</span>{" "}
        <span className={onDark ? "text-white" : "text-navy-800"}>Shine</span>
      </span>
    </Link>
  );
}
