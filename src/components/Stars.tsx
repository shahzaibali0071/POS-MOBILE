export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="flex items-center gap-1.5 text-sm" aria-label={`Rated ${rating} out of 5`}>
      <span className="relative inline-block leading-none tracking-[2px] text-black/15" aria-hidden>
        ★★★★★
        <span className="absolute inset-0 overflow-hidden text-amber-500" style={{ width: `${pct}%` }}>★★★★★</span>
      </span>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span className="text-muted">({reviews})</span>}
    </div>
  );
}
