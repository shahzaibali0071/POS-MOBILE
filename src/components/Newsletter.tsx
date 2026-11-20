"use client";

import { useState } from "react";

// ponytail: frontend only; wire to the mailing list API when the backend lands.
export function Newsletter() {
  const [done, setDone] = useState(false);
  if (done) return <p className="mt-5 text-sm font-semibold text-white">Thanks, you are on the list.</p>;
  return (
    <form
      className="mt-5 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input type="email" required placeholder="Your email" className="field border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white" />
      </label>
      <button className="btn bg-white text-ink hover:bg-white/90">Join</button>
    </form>
  );
}
