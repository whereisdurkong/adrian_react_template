import styles from '../../styles/components/Card.module.css';

export function Card({ children, className = '', padding = 'md', dark = false, style, ...props }) {
  return (
    <div
      className={[styles.card, styles[padding], dark ? styles.dark : '', className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={[styles.header, className].join(' ')}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={[styles.title, className].join(' ')}>{children}</h3>;
}
