import { useEffect, useId, useRef } from "react";
import { X } from "@phosphor-icons/react";
import styles from "../../styles/components/Modal.module.css";

/**
 * Modal: a general container for tables, images, video, forms, anything.
 *
 * <Modal
 *   open={open}
 *   onClose={() => setOpen(false)}   // X button, Esc, backdrop click
 *   title="Recent invoices"
 *   description="Last 30 days"       // optional
 *   icon={Table}                     // optional Phosphor icon, shown in a dark badge
 *   size="lg"                        // "sm" | "md" | "lg" | "xl"  (default "md")
 *   footer={<>...buttons...</>}      // optional bar pinned to the bottom
 * >
 *   ...content...
 * </Modal>
 *
 * Helpers for common content:
 *   <ModalTable><table>...</table></ModalTable>      scrolls sideways when wide
 *   <ModalMedia ratio="16 / 9" caption="...">         image / video / iframe frame
 *     <img src="..." alt="..." />   or   <video controls src="..." />
 *   </ModalMedia>
 *
 * Notes
 * - Built on the native <dialog>: page behind is inert, focus stays inside, Esc works.
 * - Content is only mounted while open, so a video stops playing when it closes
 *   and state inside the modal resets next time.
 * - The body scrolls on its own, the header and footer stay put.
 * - On screens 900px and below it becomes a bottom sheet.
 */

/* Presentational panel (also used by the showcase page) */
export function ModalPanel({
  title,
  description,
  icon: Icon,
  size = "md",
  footer,
  onClose,
  titleId,
  descriptionId,
  children,
}) {
  return (
    <div className={[styles.panel, styles[size]].filter(Boolean).join(" ")}>
      <span className={styles.accentTab} aria-hidden="true" />

      <header className={styles.header}>
        {Icon && (
          <span className={styles.badge} aria-hidden="true">
            <Icon size={22} weight="fill" />
          </span>
        )}

        <div className={styles.heading}>
          {title && (
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
          )}
          {description && (
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={16} weight="bold" aria-hidden="true" />
        </button>
      </header>

      <div className={styles.body}>{children}</div>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
}

/* Frame for an image, video or iframe */
export function ModalMedia({ ratio = "16 / 9", caption, children }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.media} style={{ aspectRatio: ratio }}>
        {children}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

/* Styled table with its own horizontal scroll */
export function ModalTable({ children }) {
  return <div className={styles.tableWrap}>{children}</div>;
}

export default function Modal({
  open,
  onClose,
  closeOnBackdrop = true,
  label, // use when there is no title
  ...panel
}) {
  const ref = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={panel.title ? undefined : label}
      aria-labelledby={panel.title ? titleId : undefined}
      aria-describedby={panel.description ? descriptionId : undefined}
      onCancel={(e) => {
        // Esc: let React state decide
        e.preventDefault();
        onClose?.();
      }}
      onClick={(e) => {
        // Click on the dim area around the panel
        if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
      }}
    >
      {open && (
        <ModalPanel
          {...panel}
          onClose={onClose}
          titleId={titleId}
          descriptionId={descriptionId}
        />
      )}
    </dialog>
  );
}
