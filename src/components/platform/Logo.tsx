export function MyaiCompanyLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rounded hexagon */}
      <rect width="32" height="32" rx="9" fill="url(#logo-gradient)" />
      {/* Neural net style dots + connections */}
      <circle cx="16" cy="8" r="2.5" fill="white" fillOpacity="0.95" />
      <circle cx="8" cy="18" r="2.5" fill="white" fillOpacity="0.85" />
      <circle cx="24" cy="18" r="2.5" fill="white" fillOpacity="0.85" />
      <circle cx="11" cy="27" r="2" fill="white" fillOpacity="0.7" />
      <circle cx="21" cy="27" r="2" fill="white" fillOpacity="0.7" />
      {/* Connection lines */}
      <line x1="16" y1="8" x2="8" y2="18" stroke="white" strokeOpacity="0.45" strokeWidth="1.2" />
      <line x1="16" y1="8" x2="24" y2="18" stroke="white" strokeOpacity="0.45" strokeWidth="1.2" />
      <line x1="8" y1="18" x2="24" y2="18" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
      <line x1="8" y1="18" x2="11" y2="27" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="24" y1="18" x2="21" y2="27" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="11" y1="27" x2="21" y2="27" stroke="white" strokeOpacity="0.25" strokeWidth="1.2" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MyaiCompanyWordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>myai</span>
      <span style={{ fontWeight: 300, letterSpacing: "-0.01em", opacity: 0.7 }}>company</span>
    </span>
  );
}
