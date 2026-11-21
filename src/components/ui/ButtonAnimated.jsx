import { useRef, useLayoutEffect } from "react";

export default function ButtonAnimated({
  children,
  variant = "solid",
  size = "md",
  fill, // optional override, defaults to theme accent
  onFill, // optional override, defaults to theme text
  icon: Icon,
  iconPosition = "left",
  as: Tag = "button",
  disabled = false,
  className = "",
  style,
  ...rest
}) {
  const btnRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const btn = btnRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return;

    // Read fill color from CSS variable if not passed as prop
    const resolvedFill =
      fill ||
      getComputedStyle(btn).getPropertyValue("--accent").trim() ||
      "#c8f135";

    const ctx = canvas.getContext("2d");
    let w = 0,
      h = 0,
      prog = 0,
      going = false,
      raf = null;

    const ws = [
      { f: 0.035, a: 8, p: 0, s: 0.06 },
      { f: 0.055, a: 5, p: 2.5, s: -0.05 },
      { f: 0.022, a: 10, p: 5.0, s: 0.04 },
    ];

    function size() {
      w = btn.offsetWidth;
      h = btn.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function paint() {
      ctx.clearRect(0, 0, w, h);
      if (prog < 0.002) return;
      const waterY = h - prog * (h + 20);
      const wobble = Math.sin(prog * Math.PI) * 0.9 + 0.1;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x++) {
        let y = waterY;
        ws.forEach((wv) => {
          y += Math.sin(x * wv.f + wv.p) * wv.a * wobble;
        });
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = resolvedFill;
      ctx.fill();
    }

    function tick() {
      ws.forEach((wv) => {
        wv.p += wv.s;
      });
      const target = going ? 1 : 0;
      prog += (target - prog) * (going ? 0.025 : 0.035);
      paint();
      if (Math.abs(target - prog) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        prog = target;
        paint();
      }
    }

    function start() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    function go() {
      going = true;
      start();
    }
    function stop() {
      going = false;
      start();
    }

    size();
    new ResizeObserver(size).observe(btn);
    btn.addEventListener("mouseenter", go);
    btn.addEventListener("mouseleave", stop);

    return () => {
      cancelAnimationFrame(raf);
      btn.removeEventListener("mouseenter", go);
      btn.removeEventListener("mouseleave", stop);
    };
  }, [fill]);

  // Match Button.module.css: sm 32 / md 40 / lg 48
  const heights = { sm: 32, md: 40, lg: 48 };
  const paddings = { sm: "0 14px", md: "0 18px", lg: "0 24px" };
  const fontSizes = { sm: 12, md: 13, lg: 15 };
  const radii = { sm: 8, md: "var(--radius-sm)", lg: 14 };

  // Theme-aware colors from your variables.css
  const bgColor =
    variant === "outline" ? "var(--surface)" : "var(--text-primary)";

  const textColor = variant === "outline" ? "var(--text-primary)" : "var(--bg)";

  // Text color once water fills — dark text on accent yellow-green looks best
  const resolvedOnFill = onFill || "#111111";

  const icon = Icon ? (
    <Icon size={18} weight="bold" aria-hidden="true" />
  ) : null;

  return (
    <Tag
      {...rest}
      ref={btnRef}
      disabled={Tag === "button" ? disabled : undefined}
      aria-disabled={Tag !== "button" ? disabled || undefined : undefined}
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        height: heights[size] ?? 40,
        padding: paddings[size],
        border:
          "1.5px solid " +
          (variant === "outline" ? "var(--border)" : "transparent"),
        borderRadius: radii[size] ?? "var(--radius-sm)",
        overflow: "hidden",
        fontFamily: "var(--font)",
        fontSize: fontSizes[size] ?? 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        WebkitAppearance: "none",
        background: "transparent",
        color: textColor,
        transition: "transform var(--duration, 200ms) var(--ease, ease)",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.querySelector("span.lbl").style.color = resolvedOnFill;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelector("span.lbl").style.color = "";
      }}
    >
      {/* Button background */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: bgColor,
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />

      {/* Canvas — draws the liquid water */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* Label */}
      <span
        className="lbl"
        style={{
          position: "relative",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          color: "inherit",
          transition: "color 300ms ease 150ms",
          pointerEvents: "none",
        }}
      >
        {iconPosition === "left" && icon}
        {children}
        {iconPosition === "right" && icon}
      </span>
    </Tag>
  );
}
