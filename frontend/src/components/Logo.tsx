interface Props {
  size?: number;
  className?: string;
}

export default function Logo({ size = 24, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M3 8V4.5C3 3.67 3.67 3 4.5 3H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 3H19.5C20.33 3 21 3.67 21 4.5V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 16V19.5C21 20.33 20.33 21 19.5 21H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 21H4.5C3.67 21 3 20.33 3 19.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.4" fill="#3b82f6" />
    </svg>
  );
}
