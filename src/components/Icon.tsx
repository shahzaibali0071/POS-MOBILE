export const ICON_PATHS = {
  menu: "M4 7h16M4 12h16M4 17h16",
  search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35",
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  shield: "M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Zm-3 9 2 2 4-4",
  refresh: "M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0 0 12.5 2M19 9A7 7 0 0 0 6.5 7",
  cash: "M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13",
  check: "M5 12.5l4.5 4.5L19 7.5",
  bolt: "M13 3 5 14h6l-1 7 8-11h-6l1-7Z",
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
