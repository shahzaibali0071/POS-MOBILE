import type { ArtKind } from "@/lib/catalog";

// Placeholder product renders drawn in SVG so the site ships without stock photos.
// Swap for <Image> with real product photography once it exists.

type Props = { kind: ArtKind; color: string; className?: string; label?: string };

/** Picks a readable highlight for light vs dark product colours. */
const shine = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const lum = ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return lum > 160 ? "#ffffff" : "rgba(255,255,255,.28)";
};

export function ProductArt({ kind, color, className, label }: Props) {
  const hi = shine(color);
  const dark = "#0e0e10";
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={label ?? kind}>
      <ellipse cx="100" cy="178" rx="62" ry="7" fill="#000" opacity=".12" />
      {draw(kind, color, hi, dark)}
    </svg>
  );
}

function draw(kind: ArtKind, c: string, hi: string, dark: string) {
  switch (kind) {
    case "earbuds":
      return (
        <g>
          <rect x="48" y="96" width="104" height="72" rx="30" fill={c} />
          <rect x="48" y="96" width="104" height="18" rx="9" fill={hi} opacity=".5" />
          <line x1="50" y1="122" x2="150" y2="122" stroke={dark} strokeOpacity=".25" strokeWidth="2" />
          <circle cx="100" cy="146" r="3" fill="#4ade80" />
          <g transform="rotate(-18 72 70)">
            <ellipse cx="72" cy="66" rx="17" ry="20" fill={c} />
            <rect x="66" y="74" width="12" height="34" rx="6" fill={c} />
            <ellipse cx="68" cy="60" rx="6" ry="7" fill={hi} opacity=".7" />
          </g>
          <g transform="rotate(18 128 70)">
            <ellipse cx="128" cy="66" rx="17" ry="20" fill={c} />
            <rect x="122" y="74" width="12" height="34" rx="6" fill={c} />
            <ellipse cx="132" cy="60" rx="6" ry="7" fill={hi} opacity=".7" />
          </g>
        </g>
      );
    case "headphones":
      return (
        <g>
          <path d="M44 112 C44 46 156 46 156 112" fill="none" stroke={c} strokeWidth="14" strokeLinecap="round" />
          <path d="M52 100 C56 58 144 58 148 100" fill="none" stroke={hi} strokeOpacity=".45" strokeWidth="3" />
          <rect x="28" y="104" width="38" height="62" rx="18" fill={c} />
          <rect x="134" y="104" width="38" height="62" rx="18" fill={c} />
          <rect x="54" y="112" width="14" height="46" rx="7" fill={dark} opacity=".55" />
          <rect x="132" y="112" width="14" height="46" rx="7" fill={dark} opacity=".55" />
          <rect x="34" y="110" width="8" height="30" rx="4" fill={hi} opacity=".55" />
        </g>
      );
    case "watch":
      return (
        <g>
          <rect x="74" y="20" width="52" height="56" rx="12" fill={c} />
          <rect x="74" y="124" width="52" height="54" rx="12" fill={c} />
          <rect x="54" y="58" width="92" height="86" rx="24" fill={c} />
          <rect x="62" y="66" width="76" height="70" rx="17" fill={dark} />
          <circle cx="100" cy="101" r="22" fill="none" stroke="#4ade80" strokeWidth="5" strokeDasharray="100 140" strokeLinecap="round" />
          <text x="100" y="106" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="sans-serif">10:08</text>
          <rect x="146" y="88" width="6" height="22" rx="3" fill={c} />
        </g>
      );
    case "powerbank":
      return (
        <g>
          <rect x="56" y="30" width="88" height="140" rx="18" fill={c} />
          <rect x="62" y="36" width="20" height="128" rx="10" fill={hi} opacity=".35" />
          <rect x="84" y="62" width="32" height="18" rx="4" fill={dark} />
          <text x="100" y="75" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4ade80" fontFamily="sans-serif">98%</text>
          <rect x="88" y="150" width="24" height="7" rx="3.5" fill={dark} opacity=".6" />
        </g>
      );
    case "charger":
      return (
        <g>
          <rect x="88" y="26" width="7" height="26" rx="2" fill="#a1a1aa" />
          <rect x="105" y="26" width="7" height="26" rx="2" fill="#a1a1aa" />
          <rect x="58" y="50" width="84" height="110" rx="20" fill={c} />
          <rect x="64" y="56" width="18" height="98" rx="9" fill={hi} opacity=".4" />
          <rect x="88" y="120" width="24" height="8" rx="4" fill={dark} opacity=".7" />
          <rect x="88" y="136" width="24" height="8" rx="4" fill={dark} opacity=".7" />
          <path d="M104 74 L92 96 H102 L96 112 L110 88 H100 Z" fill={dark} opacity=".55" />
        </g>
      );
    case "cable":
      return (
        <g>
          <path
            d="M40 150 C40 60 160 60 150 110 C140 160 70 150 80 100 C88 66 140 70 150 40"
            fill="none"
            stroke={c}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M40 150 C40 60 160 60 150 110 C140 160 70 150 80 100 C88 66 140 70 150 40"
            fill="none"
            stroke={hi}
            strokeOpacity=".35"
            strokeWidth="10"
            strokeDasharray="3 5"
          />
          <rect x="30" y="148" width="20" height="28" rx="5" fill={c} />
          <rect x="35" y="174" width="10" height="8" rx="2" fill="#a1a1aa" />
          <rect x="140" y="16" width="20" height="28" rx="5" fill={c} transform="rotate(12 150 30)" />
        </g>
      );
    case "speaker":
      return (
        <g>
          <rect x="22" y="70" width="156" height="92" rx="44" fill={c} />
          <rect x="34" y="78" width="132" height="76" rx="36" fill={dark} opacity=".35" />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={52 + i * 12} y1="88" x2={52 + i * 12} y2="144" stroke={hi} strokeOpacity=".35" strokeWidth="2" />
          ))}
          <rect x="70" y="62" width="60" height="10" rx="5" fill={c} />
          <circle cx="100" cy="116" r="9" fill={hi} opacity=".7" />
        </g>
      );
    case "neckband":
      return (
        <g>
          <path d="M40 72 C40 160 160 160 160 72" fill="none" stroke={c} strokeWidth="12" strokeLinecap="round" />
          <rect x="30" y="52" width="22" height="48" rx="11" fill={c} />
          <rect x="148" y="52" width="22" height="48" rx="11" fill={c} />
          <path d="M41 52 C38 30 70 34 74 50" fill="none" stroke={dark} strokeWidth="3" />
          <path d="M159 52 C162 30 130 34 126 50" fill="none" stroke={dark} strokeWidth="3" />
          <circle cx="76" cy="54" r="10" fill={c} />
          <circle cx="124" cy="54" r="10" fill={c} />
        </g>
      );
    case "handsfree":
      return (
        <g>
          <path d="M70 60 C70 130 100 120 100 150 M130 60 C130 130 100 120 100 150 M100 150 L100 176" fill="none" stroke={c} strokeWidth="4" />
          <circle cx="70" cy="46" r="16" fill={c} />
          <circle cx="130" cy="46" r="16" fill={c} />
          <circle cx="66" cy="42" r="5" fill={hi} opacity=".7" />
          <circle cx="126" cy="42" r="5" fill={hi} opacity=".7" />
          <rect x="108" y="100" width="12" height="26" rx="6" fill={c} />
          <rect x="95" y="172" width="10" height="16" rx="2" fill="#a1a1aa" />
        </g>
      );
  }
}
