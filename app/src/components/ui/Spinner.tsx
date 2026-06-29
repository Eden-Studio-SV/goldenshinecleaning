import { Loader2 } from "lucide-react";

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden />;
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50/40">
      <Spinner className="h-8 w-8 text-brand-500" />
    </div>
  );
}
