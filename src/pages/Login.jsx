import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkle } from "@phosphor-icons/react";
import Loader from "../components/ui/Loader";
import styles from "../styles/pages/Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your real auth call, e.g.
      // await api.post("/auth/login", { email, password });
      await new Promise((r) => setTimeout(r, 600));
      navigate("/dashboard");
    } catch {
      setError("Email or password is incorrect. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Brand panel */}
      <aside className={styles.brand}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <Sparkle size={18} weight="fill" />
          </span>
          <span className={styles.logoText}>Adrian Templates</span>
        </div>
        <div className={styles.art} aria-hidden="true">
          <span className={styles.circlePurple} />
          <span className={styles.circleDark} />
          <span className={styles.circleLime} />
        </div>

        <p className={styles.tagline}>
          Take control of your health, one day at a time.
        </p>
      </aside>

      {/* Form panel */}
      <main className={styles.formPanel}>
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to open your dashboard.</p>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className={styles.row}>
            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Keep me signed in</span>
            </label>
            <a href="/forgot-password" className={styles.link}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {loading && <Loader label="Signing in" />}

          <p className={styles.footer}>
            Don’t have an account?{" "}
            <a href="/register" className={styles.link}>
              Create one
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
