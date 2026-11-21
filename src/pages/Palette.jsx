import { useEffect, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import styles from "../styles/pages/Palette.module.css";

const groups = [
  {
    title: "Brand",
    description: "The lime accent used for badges, buttons, and highlights.",
    colors: ["--accent", "--accent-dim", "--accent-soft"],
  },
  {
    title: "Surfaces",
    description: "Backgrounds for the frame, panel, and cards.",
    colors: [
      "--bg",
      "--panel-bg",
      "--surface",
      "--surface-dark",
      "--surface-dark-2",
    ],
  },
  {
    title: "Sidebar",
    description: "The dark navigation area. Stays dark in both themes.",
    colors: [
      "--sidebar-bg",
      "--sidebar-text",
      "--sidebar-text-active",
      "--sidebar-active-bg",
      "--sidebar-border",
    ],
  },
  {
    title: "Text",
    description: "Text colors for light and dark backgrounds.",
    colors: [
      "--text-primary",
      "--text-secondary",
      "--text-muted",
      "--text-on-dark",
      "--text-on-dark-secondary",
    ],
  },
  {
    title: "Borders",
    description: "Dividers and outlines.",
    colors: ["--border", "--border-dark"],
  },
  {
    title: "Data colors",
    description: "Used in charts, status labels, and soft backgrounds.",
    colors: [
      "--purple-soft",
      "--purple",
      "--purple-dark",
      "--green-soft",
      "--green",
      "--red-soft",
      "--red",
      "--blue-soft",
      "--blue",
    ],
  },
];

// Reads the live value of a CSS variable from :root
function readVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Swatch({ name, value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(`var(${name})`);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      className={styles.swatch}
      onClick={handleCopy}
      aria-label={`Copy var(${name})`}
    >
      <span className={styles.color}>
        <span className={styles.fill} style={{ background: `var(${name})` }} />
      </span>

      <span className={styles.meta}>
        <span className={styles.name}>{name}</span>
        <span className={styles.value}>{value || "—"}</span>
      </span>

      <span className={styles.copyIcon} aria-hidden="true">
        {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
      </span>
    </button>
  );
}

export default function Palette() {
  const [values, setValues] = useState({});

  // Read all values, and again whenever the theme changes
  useEffect(() => {
    function readAll() {
      const next = {};
      groups.forEach((g) =>
        g.colors.forEach((name) => {
          next[name] = readVar(name);
        }),
      );
      setValues(next);
    }

    readAll();

    const observer = new MutationObserver(() => {
      // wait for the theme fade to finish so values are final
      window.setTimeout(readAll, 50);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Color Palette</h1>
        <p className={styles.subtitle}>
          Every color in the template. Click a swatch to copy its CSS variable.
          Switch between light and dark mode to see values update.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.title} className={styles.group}>
          <div className={styles.groupHead}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            <p className={styles.groupDesc}>{group.description}</p>
          </div>

          <div className={styles.grid}>
            {group.colors.map((name) => (
              <Swatch key={name} name={name} value={values[name]} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
