import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata: Metadata = { title: "Track Your Order" };

export default function TrackOrderPage() {
  return (
    <div className="wrap max-w-xl pt-12">
      <h1 className="font-display text-4xl font-bold tracking-tight">Track your order</h1>
      <p className="mt-2 text-muted">Enter the order number from your confirmation and the mobile number you ordered with.</p>
      <TrackOrderForm />
    </div>
  );
}
