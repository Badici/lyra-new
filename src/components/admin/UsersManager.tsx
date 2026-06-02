"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER";
  active: boolean;
  createdAt: string | Date;
};

export function UsersManager({ initialRows }: { initialRows: UserRow[] }) {
  const [rows, setRows] = useState<UserRow[]>(initialRows);
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/users");
    if (!response.ok) {
      setError("Nu am putut încărca utilizatorii.");
      return;
    }
    setRows((await response.json()) as UserRow[]);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
      <h2 className="text-xl font-semibold text-[var(--cream)]">Gestiune utilizatori</h2>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
      <ul className="mt-4 space-y-2">
        {rows.map((user) => (
          <li key={user.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-[var(--cream)]">{user.name}</p>
                <p className="text-sm text-[var(--muted)]">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  onChange={async (event) => {
                    await fetch("/api/admin/users", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: user.id,
                        data: { role: event.target.value },
                      }),
                    });
                    await load();
                  }}
                  className="rounded-lg border border-white/20 bg-[var(--background)] px-2 py-1 text-xs text-[var(--cream)]"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch("/api/admin/users", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: user.id,
                        data: { active: !user.active },
                      }),
                    });
                    await load();
                  }}
                  className="rounded-lg border border-white/20 px-3 py-1 text-xs text-[var(--cream)] hover:bg-white/5"
                >
                  {user.active ? "Dezactivează" : "Activează"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
