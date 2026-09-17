import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";

export function Brand({
  onDark = false,
  className = "",
  to = "/",
  ariaLabel,
}: {
  onDark?: boolean;
  className?: string;
  to?: string;
  ariaLabel?: string;
}) {
  const { t } = useTranslation();
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label={ariaLabel ?? t("brand.home")}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white shadow-sm">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="text-xl font-extrabold leading-none tracking-tight">
        <span className="text-brand-600">Golden</span>{" "}
        <span className={onDark ? "text-white" : "text-slate-900"}>Shine</span>
      </span>
    </Link>
  );
}
