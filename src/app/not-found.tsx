import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for has moved or never existed.</p>
      <Link href="/" className="btn mt-6 bg-ink text-white hover:bg-black">Back to home</Link>
    </div>
  );
}
