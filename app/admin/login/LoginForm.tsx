"use client";

import { useActionState } from "react";
import { login } from "../actions";

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-3">
      <input name="login" required placeholder="Login" autoComplete="username" className={input} />
      <input name="password" type="password" required placeholder="Parol" autoComplete="current-password" className={input} />
      {state?.error && (
        <p className="rounded-lg bg-red-100 p-3 text-red-800">{state.error}</p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Kirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}
