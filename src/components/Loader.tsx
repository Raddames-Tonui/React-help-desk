
export default function Loader({
  size = "3.75em",
  speed = 1.5,
  className = "",
  ariaLabel = "Loading",
}) {
  const svgSize = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`inline-block align-middle ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 50 50"
        style={{ width: svgSize, height: svgSize, animation: `spin ${speed}s linear infinite` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="ring" cx="25" cy="25" r="20"></circle>
        <circle className="ball" cx="25" cy="5" r="3.5"></circle>
      </svg>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .ring {
          fill: none;
          stroke: hsla(192, 97%, 59%, 0.30);
          stroke-width: 2;
        }

        .ball {
          fill: #2f81fcff;
          stroke: none;
        }
      `}</style>
    </div>
  );
}