"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/admin/submit-button";

type ConfirmDeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  hiddenFields?: Record<string, string>;
  label?: string;
};

export function ConfirmDeleteForm({
  action,
  confirmMessage,
  hiddenFields = {},
  label = "Șterge",
}: ConfirmDeleteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        if (!window.confirm(confirmMessage)) return;
        await action(formData);
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
