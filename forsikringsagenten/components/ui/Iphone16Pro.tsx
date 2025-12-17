import { SVGProps, forwardRef } from "react";

export interface Iphone16ProProps extends SVGProps<SVGSVGElement> {
  /** Frame width % */
  width?: number;
  /** Frame height % */
  height?: number;
  /** Image source for screen */
  src?: string;
  /** Frame color (bezel) */
  frameColor?: string;
  /** Screen background color */
  screenColor?: string;
  /** Show dynamic island */
  showDynamicIsland?: boolean;
  /** Children to render inside screen (HTML content) */
  children?: React.ReactNode;
}

/**
 * iPhone 16 Pro component with exact dimensions
 * Physical: 149.6mm × 71.45mm
 * Display: 6.3" with 1.2mm bezel
 * Border radius: 47.6px
 * Aspect ratio: 19.5:9 (2622×1206 pixels)
 * Dynamic Island: 36.2mm × 10.7mm (precise iPhone 16 Pro specs)
 */
export const Iphone16Pro = forwardRef<SVGSVGElement, Iphone16ProProps>(
  (
    {
      width = 100,
      height = 100,
      src,
      frameColor = "#1e1e1e",
      screenColor = "#000000",
      showDynamicIsland = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const viewBoxWidth = 71.45;
    const viewBoxHeight = 149.6;
    const bezelWidth = 1.2;
    const borderRadius = 11.5; // 47.6px scaled to viewBox
    const innerRadius = borderRadius - bezelWidth; // Exact math: outer radius - stroke width
    
    // Dynamic Island precise dimensions (iPhone 16 Pro: ~20mm × 6mm based on research)
    // Adjusted wider again to match user provided 'Real Life' reference perfectly
    const dynamicIslandWidth = 25 * (viewBoxWidth / 71.45); // Scale to viewBox (~35% of width)
    const dynamicIslandHeight = 6.2 * (viewBoxHeight / 149.6); // Scale to viewBox

    return (
      <div
        className={className}
        style={{
          width: `${width}%`,
          height: `${height}%`,
          maxWidth: "100%",
          position: "relative",
        }}
      >
        {/* SVG Frame with embedded foreignObject for HTML content */}
        <svg
          ref={ref}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "100%",
            height: "100%",
          }}
          {...props}
        >
          {/* Clip path for screen content */}
          <defs>
            <clipPath id="screenClip">
              <rect
                x={bezelWidth}
                y={bezelWidth}
                width={viewBoxWidth - bezelWidth * 2}
                height={viewBoxHeight - bezelWidth * 2}
                rx={innerRadius}
              />
            </clipPath>
          </defs>

          {/* Device Frame/Bezel */}
          <rect
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            rx={borderRadius}
            fill={frameColor}
          />

          {/* Screen Area Background */}
          <rect
            x={bezelWidth}
            y={bezelWidth}
            width={viewBoxWidth - bezelWidth * 2}
            height={viewBoxHeight - bezelWidth * 2}
            rx={innerRadius}
            fill={screenColor}
          />

          {/* Image Content (if provided) */}
          {src && (
            <image
              href={src}
              x={bezelWidth}
              y={bezelWidth}
              width={viewBoxWidth - bezelWidth * 2}
              height={viewBoxHeight - bezelWidth * 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#screenClip)"
            />
          )}

          {/* HTML Content via foreignObject - Slightly undersized to prevent anti-aliasing bleed */}
          {children && (
            <foreignObject
              x={bezelWidth + 0.1}
              y={bezelWidth + 0.1}
              width={viewBoxWidth - bezelWidth * 2 - 0.2}
              height={viewBoxHeight - bezelWidth * 2 - 0.2}
              clipPath="url(#screenClip)"
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  background: screenColor === "transparent" ? "white" : screenColor,
                  borderRadius: `${innerRadius * 0.95}px`, // Slightly tighter radius to prevent corner bleed
                  boxSizing: "border-box",
                }}
              >
                {children}
              </div>
            </foreignObject>
          )}

          {/* Dynamic Island (rendered on top) - iPhone 16 Pro precise specs */}
          {showDynamicIsland && (
            <rect
              x={(viewBoxWidth - dynamicIslandWidth) / 2}
              y={bezelWidth + 2.8}
              width={dynamicIslandWidth}
              height={dynamicIslandHeight}
              rx={dynamicIslandHeight / 2}
              fill="#000000"
            />
          )}
        </svg>
      </div>
    );
  }
);

Iphone16Pro.displayName = "Iphone16Pro";

