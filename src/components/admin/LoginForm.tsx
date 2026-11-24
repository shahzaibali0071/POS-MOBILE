"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="max-w-sm space-y-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Admin password</span>
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button className="btn w-full bg-ink text-white hover:bg-black" disabled={pending}>
        {pending ? "Checking..." : "Log in"}
      </button>
    </form>
  );
}
