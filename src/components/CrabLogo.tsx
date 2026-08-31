export default function CrabLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="crab-logo"
      width={size}
      height={size}
      viewBox="0 0 64 56"
      aria-hidden="true"
      fill="none"
    >
      <g className="crab-rock">
        {/* legs */}
        <g stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 36 L8 40" />
          <path d="M19 40 L7 46" />
          <path d="M21 44 L10 51" />
          <path d="M44 36 L56 40" />
          <path d="M45 40 L57 46" />
          <path d="M43 44 L54 51" />
        </g>

        {/* left claw */}
        <path
          d="M20 28 C13 28 10 23 9 17"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="6" cy="14" rx="5.5" ry="4.2" fill="var(--color-primary)" transform="rotate(-25 6 14)" />
        <g className="crab-pincer-left">
          <path
            d="M6 13 C2 12 -3 9 -7 10 C-3 13 1 16 6 16 Z"
            fill="var(--color-primary)"
          />
        </g>

        {/* right claw (mirrored) */}
        <path
          d="M44 28 C51 28 54 23 55 17"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="58" cy="14" rx="5.5" ry="4.2" fill="var(--color-primary)" transform="rotate(25 58 14)" />
        <g className="crab-pincer-right">
          <path
            d="M58 13 C62 12 67 9 71 10 C67 13 63 16 58 16 Z"
            fill="var(--color-primary)"
          />
        </g>

        {/* eye stalks */}
        <g stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
          <path d="M27 24 L25 16" />
          <path d="M37 24 L39 16" />
        </g>
        <circle cx="25" cy="14" r="2" fill="var(--color-primary)" />
        <circle cx="39" cy="14" r="2" fill="var(--color-primary)" />

        {/* body */}
        <ellipse cx="32" cy="34" rx="15" ry="11" fill="var(--color-primary)" />
      </g>
    </svg>
  );
}
