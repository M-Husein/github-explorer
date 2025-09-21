type LoadingProps = {
  size?: number | string
  stroke?: string
  strokeWidth?: number | string
  className?: string
}

export const Loading = ({
  size = 87,
  stroke = "#18181b",
  strokeWidth = 2, 
  className,
}: LoadingProps) => (
  <svg 
    role="status" 
    aria-label="Loading" 
    viewBox="0 0 32 32" 
    fill="none" 
    strokeWidth={strokeWidth} 
    width={size} 
    height={size} 
    stroke={stroke}
    className={className}
  >
    <circle 
      strokeWidth="2" 
      r="12" 
      cx="16" 
      cy="16" 
      fill="none" 
      opacity="0.125" 
    />
    <circle 
      strokeWidth="2" 
      r="12" 
      cx="16" 
      cy="16" 
      fill="none" 
      strokeDasharray="20 110"
    >
      <animateTransform 
        attributeName="transform" 
        attributeType="XML" 
        type="rotate" 
        from="0 16 16" 
        to="360 16 16" 
        dur="750ms" 
        repeatCount="indefinite"
      />
    </circle>
	</svg>
);
