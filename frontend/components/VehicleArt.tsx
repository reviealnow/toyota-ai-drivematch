import { useId } from "react";
export default function VehicleArt({
  color = "#6b7e89",
  sedan = false,
}: {
  color?: string;
  sedan?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 420 180"
      className="vehicle-art"
      role="img"
      aria-label="車型示意插畫，非實車外觀"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f8fafb" />
          <stop offset=".48" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <ellipse cx="215" cy="151" rx="174" ry="9" fill="#172633" opacity=".10" />
      <path
        d={
          sedan
            ? "M30 120 49 99 112 91 159 61 253 60 305 96 371 106 389 129 374 144 42 144Z"
            : "M31 120 49 88 106 84 137 43 263 43 304 83 370 96 387 126 376 144 39 144Z"
        }
        fill={`url(#${id})`}
        stroke="#33424a"
        strokeWidth="2"
      />
      <path
        d={
          sedan
            ? "M125 91 164 66 246 66 285 94Z"
            : "M119 82 144 49 256 49 288 83Z"
        }
        fill="#263e4b"
      />
      <path
        d="M199 50 201 94 M114 91 109 129 M209 92 213 132 M296 95 302 125"
        stroke="#71818b"
        strokeWidth="2"
      />
      <path
        d="M45 102 l49 4 -5 8 -49 -4 Z M331 101 l43 12 -2 7 -39 -5 Z"
        fill="#eef5ee"
      />
      <path
        d="M155 104h14 M254 104h14"
        stroke="#273c46"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M129 137h159" stroke="#253a45" strokeWidth="5" />
      {[101, 310].map((x) => (
        <g key={x}>
          <circle cx={x} cy="138" r="27" fill="#18242c" />
          <circle cx={x} cy="138" r="18" fill="#c1c8cb" />
          <circle cx={x} cy="138" r="11" fill="#596973" />
          <path
            d={`M${x - 16} 138h32 M${x} 122v32`}
            stroke="#dae0e3"
            strokeWidth="3"
          />
          <circle cx={x} cy="138" r="4" fill="#263640" />
        </g>
      ))}
    </svg>
  );
}
