import { AlertTriangle } from "lucide-react";

export function DevBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-sand/30 bg-sand/10 px-4 py-3 text-sm text-sand">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
