"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitContactAction,
  type ContactActionState,
} from "@/features/contact/actions";

const initialState: ContactActionState = { ok: false, message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);
  const fieldErrors = state.ok ? undefined : state.fieldErrors;

  return (
    <form action={formAction} className="space-y-4">
      {state.message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            state.ok ? "bg-moss/10 text-forest" : "bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nume</Label>
          <Input id="name" name="name" autoComplete="name" required />
          {fieldErrors?.name?.[0] ? (
            <p className="mt-1 text-xs text-red-700">{fieldErrors.name[0]}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
          {fieldErrors?.email?.[0] ? (
            <p className="mt-1 text-xs text-red-700">{fieldErrors.email[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Telefon (opțional)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div>
          <Label htmlFor="subject">Subiect (opțional)</Label>
          <Input id="subject" name="subject" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Mesaj</Label>
        <Textarea id="message" name="message" rows={6} required />
        {fieldErrors?.message?.[0] ? (
          <p className="mt-1 text-xs text-red-700">{fieldErrors.message[0]}</p>
        ) : null}
      </div>

      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Se trimite…" : "Trimite mesajul"}
      </Button>
    </form>
  );
}
