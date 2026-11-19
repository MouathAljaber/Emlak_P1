const paths = {
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  sliders: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  heart: <><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /></>,
  hotel: <><path d="M3 21V7l9-4 9 4v14" /><path d="M9 21v-6h6v6M3 21h18" /></>,
  pitch: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M12 5v14" /><circle cx="12" cy="12" r="3" /></>,
  trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></>,
  bus: <><path d="M5 17h14M6 17V9l2-4h8l2 4v8" /><circle cx="8" cy="17" r="2" /><circle cx="16" cy="17" r="2" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  external: <><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>
};

export default function Icon({ name, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Logo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width="34" height="34">
      <circle cx="20" cy="20" r="18" fill="#1f6247" />
      <path d="M8.5 15a13.5 13.5 0 0 1 23 0" stroke="#e3a92f" strokeWidth="2.6" strokeLinecap="round" />
      <path d="m20 13 4.2 3.1v5.2L20 24.4l-4.2-3.1v-5.2L20 13Z" fill="#fff" />
      <path d="m15.8 16.6-4.3 2m12.7-2 4.3 2M20 24.4v5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
