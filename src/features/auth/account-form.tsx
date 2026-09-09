"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type Mode = "login" | "register";

export function AccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "");
    const phone = String(fd.get("phone") ?? "") || undefined;

    try {
      if (mode === "login") {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) {
          toast.error(error.message ?? "Autentificare eșuată");
          setPending(false);
          return;
        }
        toast.success("Bine ai revenit!");
        router.refresh();
        router.push("/");
      } else {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          ...(phone ? { phone } : {}),
        });
        if (error) {
          toast.error(error.message ?? "Înregistrare eșuată");
          setPending(false);
          return;
        }
        toast.success("Cont creat cu succes");
        router.refresh();
        router.push("/");
      }
    } catch {
      toast.error("A apărut o eroare. Încearcă din nou.");
      setPending(false);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Te-ai deconectat");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex gap-2 rounded-xl bg-fog/50 p-1">
        <button
          type="button"
          className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
            mode === "login" ? "bg-surface shadow-sm" : "text-muted hover:text-foreground"
          }`}
          onClick={() => setMode("login")}
        >
          Autentificare
        </button>
        <button
          type="button"
          className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
            mode === "register" ? "bg-surface shadow-sm" : "text-muted hover:text-foreground"
          }`}
          onClick={() => setMode("register")}
        >
          Înregistrare
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" ? (
          <>
            <div>
              <Label htmlFor="name">Nume</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
            <div>
              <Label htmlFor="phone">Telefon (opțional)</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
          </>
        ) : null}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Parolă (min. 10 caractere)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={10}
            required
          />
        </div>
        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Se procesează…" : mode === "login" ? "Intră în cont" : "Creează cont"}
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-4">
        <Button type="button" variant="ghost" className="w-full" onClick={handleSignOut}>
          Deconectare
        </Button>
      </div>
    </div>
  );
}
