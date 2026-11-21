import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bell,
  CheckCircle,
  Info,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import styles from "../../styles/components/Toast.module.css";

/**
 * Toast
 *
 * 1. Wrap your app once:   <ToastProvider>...</ToastProvider>
 * 2. In any component:     const toast = useToast();
 *
 *    toast("Saved");                                  // default
 *    toast.success("Changes saved", { description: "Your profile is up to date." });
 *    toast.error("Upload failed");
 *    toast.info("New version available");
 *    toast.show({
 *      title: "Item deleted",
 *      action: { label: "Undo", onClick: () => {} },
 *      duration: 6000,                                // ms, 0 = stays until dismissed
 *    });
 *    toast.dismiss(id);                               // every call returns an id
 *
 * Hover or focus a toast to pause its timer.
 */

const ToastContext = createContext(null);

const ICONS = {
  default: Bell,
  success: CheckCircle,
  error: WarningCircle,
  info: Info,
};

const MAX_TOASTS = 4;
const DEFAULT_DURATION = 4000;
const EXIT_MS = 200; // keep in sync with toast-out in Toast.module.css

let nextId = 0;

/* ── Presentational card (also used by the showcase page) ── */
export function ToastCard({
  type = "default",
  title,
  description,
  action,
  onClose,
  progress,
}) {
  const Icon = ICONS[type] ?? ICONS.default;

  return (
    <div
      className={[styles.toast, styles[type]].filter(Boolean).join(" ")}
      role={type === "error" ? "alert" : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={20} weight="fill" />
      </span>

      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
        {action && (
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              action.onClick?.();
              onClose?.();
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={16} weight="bold" aria-hidden="true" />
        </button>
      )}

      {progress}
    </div>
  );
}

/* ── One live toast: timer, pause on hover/focus, exit animation ── */
function ToastItem({ toast, onDismiss, onRemove }) {
  const { id, duration, closing, ...cardProps } = toast;
  const timer = useRef(null);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  const start = useCallback(() => {
    if (duration <= 0 || timer.current != null) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(
      () => {
        timer.current = null;
        onDismiss(id);
      },
      Math.max(remaining.current, Math.min(duration, 1000)),
    );
  }, [duration, id, onDismiss]);

  const pause = useCallback(() => {
    if (timer.current == null) return;
    clearTimeout(timer.current);
    timer.current = null;
    remaining.current -= Date.now() - startedAt.current;
  }, []);

  useEffect(() => {
    if (closing) return;
    start();
    return () => {
      clearTimeout(timer.current);
      timer.current = null;
    };
  }, [start, closing]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => onRemove(id), EXIT_MS);
    return () => clearTimeout(t);
  }, [closing, id, onRemove]);

  return (
    <div
      className={[styles.item, closing ? styles.leaving : ""]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={pause}
      onMouseLeave={start}
      onFocus={pause}
      onBlur={start}
    >
      <ToastCard
        {...cardProps}
        onClose={() => onDismiss(id)}
        progress={
          duration > 0 ? (
            <span
              className={styles.progress}
              style={{ animationDuration: `${duration}ms` }}
              aria-hidden="true"
            />
          ) : null
        }
      />
    </div>
  );
}

/* ── Provider ── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((list) =>
      list.map((t) => (t.id === id ? { ...t, closing: true } : t)),
    );
  }, []);

  const show = useCallback((options) => {
    const opts = typeof options === "string" ? { title: options } : options;
    const id = ++nextId;
    setToasts((list) =>
      [
        ...list,
        { type: "default", duration: DEFAULT_DURATION, ...opts, id },
      ].slice(-MAX_TOASTS),
    );
    return id;
  }, []);

  const api = useMemo(() => {
    const toast = (options) => show(options);
    toast.show = show;
    toast.dismiss = dismiss;
    toast.success = (title, opts) => show({ ...opts, title, type: "success" });
    toast.error = (title, opts) => show({ ...opts, title, type: "error" });
    toast.info = (title, opts) => show({ ...opts, title, type: "info" });
    return toast;
  }, [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className={styles.region}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onDismiss={dismiss}
            onRemove={remove}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
