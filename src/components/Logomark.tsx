interface LogomarkProps {
  size?: number
  className?: string
}

/** The sculptural ribbon "N" logomark on black. */
export default function Logomark({ size = 24, className = 'logomark' }: LogomarkProps) {
  return (
    <img
      src="/logo.png"
      srcSet="/logo-128.png 128w, /logo.png 512w"
      sizes={`${size}px`}
      width={size}
      height={size}
      className={className}
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
  )
}
