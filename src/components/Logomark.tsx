/** An "N" drawn as a short tensor chain: four ring nodes joined by bonds. Sits on black. */
export default function Logomark({ size = 22 }: { size?: number }) {
  return (
    <svg className="logomark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M9 23V9l14 14V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <g fill="#000" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="23" r="2.9" />
        <circle cx="9" cy="9" r="2.9" />
        <circle cx="23" cy="23" r="2.9" />
        <circle cx="23" cy="9" r="2.9" />
      </g>
    </svg>
  )
}
