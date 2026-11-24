import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "vx_admin";
const WEEK = 60 * 60 * 24 * 7;

const password = () => process.env.ADMIN_PASSWORD ?? "";

export const adminConfigured = () => password().length >= 12;

// Derived from the password, so changing ADMIN_PASSWORD signs every device out.
const sessionToken = () => createHmac("sha256", password()).update("voltix-admin-session-v1").digest("hex");

// Hashing first gives equal-length buffers, so timingSafeEqual never throws and leaks no length.
const safeEqual = (a: string, b: string) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

export const checkPassword = (input: string) => adminConfigured() && safeEqual(input, password());

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return !!value && safeEqual(value, sessionToken());
}

export async function startSession() {
  (await cookies()).set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: WEEK,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
