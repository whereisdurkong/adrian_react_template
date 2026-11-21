import styles from '../styles/pages/About.module.css';

const stack = [
  { name: 'Vite', role: 'Build tool', version: '5.x' },
  { name: 'React', role: 'UI library', version: '18.x' },
  { name: 'React Router', role: 'Routing', version: '6.x' },
  { name: 'CSS Modules', role: 'Styling', version: 'native' },
];

export default function About() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>About this template</h1>
      <p className={styles.lead}>
        A minimal, production-ready React frontend starter built to get out of your way.
        No unnecessary abstraction — just the essentials to ship fast.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tech stack</h2>
        <div className={styles.stackGrid}>
          {stack.map(s => (
            <div key={s.name} className={styles.stackCard}>
              <div className={styles.stackName}>{s.name}</div>
              <div className={styles.stackRole}>{s.role}</div>
              <div className={styles.stackVer}>v{s.version}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Folder structure</h2>
        <div className={styles.codeCard}>
          <pre className={styles.pre}>{`src/
├── components/
│   ├── layout/         → AppLayout, Navbar, Sidebar
│   └── ui/             → Button, Card, Badge
├── hooks/
│   └── useTheme.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── About.jsx
│   └── NotFound.jsx
├── styles/
│   ├── global.css
│   ├── variables.css   ← all design tokens
│   ├── components/     ← Button, Card, Badge CSS
│   ├── layout/         ← Sidebar, Navbar, AppLayout CSS
│   └── pages/          ← per-page CSS modules
└── main.jsx            ← router setup`}</pre>
        </div>
      </section>
    </div>
  );
}
