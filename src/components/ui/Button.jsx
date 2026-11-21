import styles from '../../styles/components/Button.module.css';

export default function Button({
  children, variant = 'primary', size = 'md',
  disabled = false, fullWidth = false,
  onClick, type = 'button', className = '', ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        styles.btn, styles[variant], styles[size],
        fullWidth ? styles.fullWidth : '', className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
