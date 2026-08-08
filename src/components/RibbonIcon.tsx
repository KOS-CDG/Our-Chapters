export function RibbonIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 12c-1.5 0-3.5-.5-3.5-3.5C2 5.5 5 4.5 7.5 7c2 2 3.5 4 4.5 5 1-1 2.5-3 4.5-5 2.5-2.5 5.5-1.5 5.5 1.5 0 3-2 3.5-3.5 3.5-2.5 0-4.5 1-5.5 2-1-1-3-2-5.5-2z" />
      <path d="M12 14c-1 3-3 7-5 7l2-4-3-2 3-1" />
      <path d="M12 14c1 3 3 7 5 7l-2-4 3-2-3-1" />
    </svg>
  );
}
