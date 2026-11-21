import styles from "../../styles/components/Loader.module.css";

/**
 * Loader (overlay only)
 * Covers the whole screen with a soft backdrop and the animation in the center.
 * - size: "sm" | "md" | "lg"  (default "lg")
 * - label: text under the animation (also read by screen readers)
 * - showLabel: set false to hide the visible text
 */
export default function Loader({
  size = "lg",
  label = "Loading",
  showLabel = true,
}) {
  const sq = (name) => [styles.sq, styles[name]].join(" ");

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className={styles.stack}>
        <span
          className={[styles.frame, styles[size]].join(" ")}
          aria-hidden="true"
        >
          <span className={styles.cluster}>
            {/* background layer */}
            <span className={styles.core} />
            <span className={[sq("g1"), styles.grey].join(" ")} />
            <span className={[sq("g2"), styles.grey].join(" ")} />

            {/* colored squares */}
            <span className={sq("blue")} />
            <span className={sq("green")} />
            <span className={sq("yellow")} />
            <span className={sq("red")} />
          </span>
        </span>

        {showLabel ? (
          <span className={styles.label}>{label}</span>
        ) : (
          <span className={styles.srOnly}>{label}</span>
        )}
      </span>
    </div>
  );
}
