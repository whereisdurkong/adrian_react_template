import { useEffect, useId, useRef } from "react";
import { CircleNotch, File, Trash, X } from "@phosphor-icons/react";
import styles from "../../styles/components/DeleteModal.module.css";

/**
 * DeleteModal
 *
 * <DeleteModal
 *   open={open}
 *   title="Delete this project?"
 *   description="All tasks and files will be removed permanently."
 *   itemName="Website redesign"      // optional chip showing what is deleted
 *   itemIcon={Folder}                // optional Phosphor icon for the chip
 *   loading={deleting}               // disables everything, shows a spinner
 *   onConfirm={() => {}}
 *   onCancel={() => setOpen(false)}  // Cancel, X, Esc and backdrop click
 * />
 *
 * Built on the native <dialog>: the page behind is inert, focus stays inside,
 * Esc works, and focus returns to the trigger when it closes.
 * Focus starts on Cancel so Enter can't delete by accident.
 */

/* Presentational panel (also used by the showcase page) */
export function DeleteModalPanel({
  title = "Delete this item?",
  description = "This action can't be undone.",
  itemName,
  itemIcon: ItemIcon = File,
  confirmLabel = "Delete",
  loadingLabel = "Deleting…",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  titleId,
  descriptionId,
}) {
  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.close}
        onClick={onCancel}
        disabled={loading}
        aria-label="Close"
      >
        <X size={16} weight="bold" aria-hidden="true" />
      </button>

      <span className={styles.icon} aria-hidden="true">
        <Trash size={26} weight="fill" />
      </span>

      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p id={descriptionId} className={styles.description}>
        {description}
      </p>

      {itemName && (
        <span className={styles.item}>
          <ItemIcon size={16} weight="bold" aria-hidden="true" />
          <span className={styles.itemName}>{itemName}</span>
        </span>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.cancel}`}
          onClick={onCancel}
          disabled={loading}
          data-autofocus
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.confirm}`}
          onClick={onConfirm}
          disabled={loading}
          aria-busy={loading || undefined}
        >
          {loading ? (
            <CircleNotch
              size={18}
              weight="bold"
              className={styles.spin}
              aria-hidden="true"
            />
          ) : (
            <Trash size={18} weight="bold" aria-hidden="true" />
          )}
          {loading ? loadingLabel : confirmLabel}
        </button>
      </div>
    </div>
  );
}

export default function DeleteModal({
  open,
  loading = false,
  onCancel,
  ...panel
}) {
  const ref = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(e) => {
        // Esc: let React state decide, don't let the browser close it
        e.preventDefault();
        if (!loading) onCancel?.();
      }}
      onClick={(e) => {
        // Click on the dim area around the panel
        if (e.target === e.currentTarget && !loading) onCancel?.();
      }}
    >
      <DeleteModalPanel
        {...panel}
        loading={loading}
        onCancel={onCancel}
        titleId={titleId}
        descriptionId={descriptionId}
      />
    </dialog>
  );
}
