import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import styles from "../styles/pages/Home.module.css";
import ButtonAnimated from "../components/ui/ButtonAnimated";

const features = [
  {
    icon: "⚡",
    title: "Vite Powered",
    desc: "Blazing fast HMR and optimized production builds out of the box.",
    badge: { label: "Fast", variant: "accent" },
  },
  {
    icon: "🧭",
    title: "React Router v6",
    desc: "Nested layouts, index routes, and 404 handling all pre-configured.",
    badge: { label: "Routing", variant: "info" },
  },
  {
    icon: "🎨",
    title: "Design Tokens",
    desc: "Full CSS variable system — colors, radii, shadows, all in one file.",
    badge: { label: "Themeable", variant: "purple" },
  },
  {
    icon: "🧩",
    title: "UI Components",
    desc: "Button, Card, and Badge with clean CSS Modules — extend freely.",
    badge: { label: "Ready", variant: "success" },
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Global gooey filter — place it once here or in your root App/Layout */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="goo-liquid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            />
          </filter>
        </defs>
      </svg>

      <section className={styles.hero}>
        <span className={styles.eyebrow}>✦ Vite + React Starter</span>
        <h1 className={styles.heroTitle}>
          Build faster.
          <br />
          <span>Ship confidently.</span>
        </h1>
        <p className={styles.heroSub}>
          A production-ready React frontend with routing, reusable UI
          components, and a full design token system.
        </p>
        <div className={styles.heroCta}>
          <Link to="/dashboard">
            <Button size="lg">View Dashboard</Button>
          </Link>

          <ButtonAnimated size="lg">Get Started</ButtonAnimated>

          <Link to="/about">
            <Button size="lg" variant="secondary">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>What's included</h2>
        </div>
        <div className={styles.grid} style={{ marginTop: 16 }}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureTop}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <Badge variant={f.badge.variant}>{f.badge.label}</Badge>
              </div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
