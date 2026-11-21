import { useEffect, useId, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  CaretDown,
  Carrot,
  ChartBar,
  House,
  Palette as PaletteIcon,
  PlaceholderIcon,
  SignIn,
  Sparkle,
  SquaresFour,
  Stack,
  Users,
} from "@phosphor-icons/react";
import styles from "../../styles/layout/Sidebar.module.css";

/*
  Items with `children` become a dropdown group.
  Items with `to` are normal links. Child links don't need an icon.
*/
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: SquaresFour, badge: 3 },
  { to: "/", label: "Home", icon: House },
  {
    label: "Pages",
    icon: Stack,
    children: [
      { to: "/nutrition", label: "Nutrition" },
      { to: "/reports", label: "Reports", badge: 1 },
      { to: "/users", label: "Users" },
    ],
  },
  {
    label: "Development Components",
    icon: Stack,
    children: [
      { to: "/palette", label: "Palette", icon: PaletteIcon },
      {
        to: "/components",
        label: "Components",
        icon: PlaceholderIcon,
        badge: 1,
      },
      { to: "/users", label: "Users" },
    ],
  },

  { to: "/login", label: "Login", icon: SignIn },
];

function isInside(pathname, to) {
  return pathname === to || pathname.startsWith(to + "/");
}

function NavGroup({ item }) {
  const { pathname } = useLocation();
  const panelId = useId();
  const Icon = item.icon;

  const hasActiveChild = item.children.some((c) => isInside(pathname, c.to));
  const [open, setOpen] = useState(hasActiveChild);

  // Open the group when the user lands on one of its pages
  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={[
          styles.link,
          styles.groupBtn,
          hasActiveChild ? styles.groupActive : "",
        ].join(" ")}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className={styles.linkIcon}>
          <Icon size={20} weight={hasActiveChild ? "fill" : "regular"} />
        </span>
        <span>{item.label}</span>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
        <CaretDown
          size={14}
          weight="bold"
          className={[styles.caret, open ? styles.caretOpen : ""].join(" ")}
        />
      </button>

      {/* `inert` keeps hidden links out of the tab order */}
      <div
        id={panelId}
        className={[styles.sub, open ? styles.subOpen : ""].join(" ")}
        inert={!open}
      >
        <div className={styles.subInner}>
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                [styles.subLink, isActive ? styles.subActive : ""].join(" ")
              }
            >
              <span>{child.label}</span>
              {child.badge && (
                <span className={styles.badge}>{child.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open }) {
  return (
    <aside className={[styles.sidebar, open ? styles.open : ""].join(" ")}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <Sparkle size={18} weight="fill" />
        </span>
        <span className={styles.logoText}>Adrian Templates</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          if (item.children) {
            return <NavGroup key={item.label} item={item} />;
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [styles.link, isActive ? styles.active : ""].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span className={styles.linkIcon}>
                    <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
