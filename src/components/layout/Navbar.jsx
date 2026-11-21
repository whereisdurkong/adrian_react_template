import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CaretDown,
  List,
  Moon,
  SignOut,
  Sun,
  User,
} from "@phosphor-icons/react";
import useTheme from "../../hooks/useTheme";
import styles from "../../styles/layout/Navbar.module.css";

export default function Navbar({ onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Close on outside click or Escape
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    // TODO: clear your auth token/session here
    navigate("/login");
  }

  return (
    <header className={styles.navbar}>
      <button
        className={styles.menuBtn}
        onClick={onToggleSidebar}
        aria-label="Menu"
      >
        <List size={20} />
      </button>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className={styles.knob} />
          <Sun size={16} weight="fill" className={styles.sunIcon} />
          <Moon size={16} weight="fill" className={styles.moonIcon} />
        </button>
        <div className={styles.profileWrap} ref={wrapRef}>
          <button
            type="button"
            className={styles.profile}
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className={styles.avatar}>LB</div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Lucas Bennett</span>
              <span className={styles.profileEmail}>bennet02@gmail.com</span>
            </div>
            <CaretDown
              size={14}
              weight="bold"
              className={[
                styles.chevron,
                menuOpen ? styles.chevronOpen : "",
              ].join(" ")}
            />
          </button>

          {menuOpen && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownHeader}>
                <span className={styles.profileName}>Lucas Bennett</span>
                <span className={styles.profileEmail}>bennet02@gmail.com</span>
              </div>

              <Link
                to="/profile"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>

              <button
                type="button"
                className={[styles.dropdownItem, styles.danger].join(" ")}
                role="menuitem"
                onClick={handleLogout}
              >
                <SignOut size={18} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
