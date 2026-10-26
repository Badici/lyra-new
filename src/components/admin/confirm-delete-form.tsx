"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAdminBusy } from "@/components/admin/admin-busy";
import { SubmitButton } from "@/components/admin/submit-button";
import type { FormResult } from "@/server/forms/result";

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => Promise<FormResult>;
  confirmMessage: string;
  hiddenFields?: Record<string, string>;
  label?: string;
  returnTo?: string;
};

export function ConfirmDeleteForm({
  action,
  confirmMessage,
  hiddenFields = {},
  label = "Șterge",
  returnTo,
}: ConfirmDeleteFormProps) {
  const router = useRouter();
  const busy = useAdminBusy();
  const formRef = useRef<HTMLFormElement>(null);
  const lock = useRef(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!pending) return;
    busy.begin();
    return () => busy.end();
  }, [pending, busy]);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        if (lock.current) return;
        if (!window.confirm(confirmMessage)) return;
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
          toast.error("Nu am putut șterge.");
        } finally {
          lock.current = false;
          setPending(false);
        }
      }}
      onSubmit={(event) => {
        if (lock.current || pending) event.preventDefault();
      }}
    >
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <SubmitButton
        label={label}
        pendingLabel="Se șterge…"
        variant="danger"
        className="inline-flex items-center gap-1.5"
      />
    </form>
  );
}
