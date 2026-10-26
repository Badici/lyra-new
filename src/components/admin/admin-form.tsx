"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminBusy } from "@/components/admin/admin-busy";
import type { FormResult } from "@/server/forms/result";

type AdminFormProps = {
  action: (formData: FormData) => Promise<FormResult>;
  returnTo?: string;
  className?: string;
  children: React.ReactNode;
};

export function AdminForm({ action, returnTo, className, children }: AdminFormProps) {
  const router = useRouter();
  const busy = useAdminBusy();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!pending) return;
    busy.begin();
    return () => busy.end();
  }, [pending, busy]);

  async function onSubmit(formData: FormData) {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    try {
      const result = await action(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      await new Promise((resolve) => setTimeout(resolve, 450));
      if (returnTo) router.push(returnTo);
      else router.refresh();
    } catch {
      toast.error("Nu am putut salva. Încearcă din nou.");
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  return (
    <form
      action={onSubmit}
      data-pending={pending ? "true" : "false"}
      className={className}
      onSubmit={(event) => {
        if (lock.current) event.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
