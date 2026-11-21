import styles from '../styles/pages/Dashboard.module.css';

const months = ['Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
const sleepBars = [55, 40, 65, 50, 100, 75, 30];
const sleepBars2 = [40, 60, 45, 80, 85, 55, 20];

const dots = Array.from({ length: 40 }, (_, i) => i < 31 ? 'filled' : i < 36 ? 'dimmed' : 'empty');

const activity = [
  { label: 'Running', pct: 45, color: '#c8f135' },
  { label: 'Workouts', pct: 30, color: '#c8f135' },
  { label: 'Walking', pct: 25, color: '#c8f135' },
];

export default function Dashboard() {
  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Health Overview</h1>
          <p className={styles.subheading}>Take control of your health today!</p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.dateLabel}>12 July, 2024</span>
          <button className={styles.todayBtn}>Today ▾</button>
        </div>
      </div>

      {/* Stat cards row */}
      <div className={styles.statsRow}>

        {/* Energy */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}><span className={styles.statIcon}>⚡</span> Energy Used</span>
            <span className={styles.statMore}>···</span>
          </div>
          <div className={styles.statValue}>
            4,3<span className={styles.statUnit}>k</span>
            <span className={[styles.chip, styles.chipGreen].join(' ')} style={{ fontSize: 11, marginLeft: 10 }}>+5%</span>
          </div>
          <div className={styles.statMeta}><span>kcal today</span></div>
        </div>

        {/* Heart Rate */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}><span className={styles.statIcon}>♡</span> Heart Rate</span>
            <span className={styles.statMore}>···</span>
          </div>
          <div className={styles.statValue}>62 <span className={styles.statUnit}>bpm</span></div>
          <div className={styles.statMeta}><span>Avg</span><span>78 Bpm</span></div>
        </div>

        {/* Wellness Index */}
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}><span className={styles.statIcon}>%</span> Wellness Index</span>
            <span className={styles.statMore}>···</span>
          </div>
          <div className={styles.statValue}>
            78 <span className={styles.statUnit}>%</span>
            <span className={[styles.chip, styles.chipGreen].join(' ')} style={{ fontSize: 11, marginLeft: 10 }}>+10%</span>
          </div>
          <div className={styles.dotGrid}>
            {dots.map((d, i) => (
              <div key={i} className={[styles.dot, d === 'filled' ? styles.filled : d === 'dimmed' ? styles.dimmed : ''].join(' ')} />
            ))}
          </div>
        </div>
      </div>

      {/* Middle row */}
      <div className={styles.midRow}>

        {/* Left: Energy card + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Bubbles */}
          <div className={styles.energyCard}>
            <div className={styles.statTop} style={{ marginBottom: 0 }}>
              <span className={styles.statLabel}><span className={styles.statIcon}>⚡</span> Energy Used</span>
              <span className={styles.statMore}>···</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '8px 0 4px' }}>
              <span style={{ fontSize: 28, fontWeight: 800 }}>4,3k</span>
              <span className={[styles.chip, styles.chipGreen].join(' ')}>+5%</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 2 }}>kcal today</span>
            </div>
            <div className={styles.bubbleWrap}>
              <div className={[styles.bubble, styles.bubblePurple].join(' ')}>
                <span className={styles.bubbleVal}>2,6k</span>
                <span className={styles.bubbleUnit}>kcal</span>
              </div>
              <div className={[styles.bubble, styles.bubbleDark].join(' ')}>
                <span className={styles.bubbleVal}>1,2k</span>
                <span className={styles.bubbleUnit}>kcal</span>
              </div>
              <div className={[styles.bubble, styles.bubbleAccent].join(' ')}>
                <span className={styles.bubbleVal}>500</span>
                <span className={styles.bubbleUnit}>kcal</span>
              </div>
            </div>

            {/* Activity bars */}
            <div className={styles.bars}>
              {activity.map(a => (
                <div key={a.label} className={styles.barRow}>
                  <div className={styles.barLabel}>
                    <span className={styles.barPct}>{a.pct} %</span>
                    <span className={styles.barName}>{a.label} ●</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity + Sleep */}
        <div className={styles.rightCol}>

          {/* Activity mini */}
          <div className={styles.miniCard}>
            <div className={styles.miniHead}>
              <span className={styles.miniLabel}>🏃 Activity</span>
              <span className={styles.statMore}>···</span>
            </div>
            <div className={styles.miniValue}>5,8 <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)' }}>km</span></div>
            <div className={styles.miniSub}>Active · 75 Min</div>
          </div>

          {/* Sleep */}
          <div className={styles.sleepCard}>
            <div className={styles.sleepHead}>
              <span className={styles.sleepLabel}>🌙 Sleep Analysis</span>
              <button className={styles.sleepPill}>Monthly ▾</button>
            </div>
            <div className={styles.sleepStats}>
              <div className={styles.sleepStat}>
                <div className={[styles.sleepStatVal, styles.accent].join(' ')}>85 <span style={{ fontSize: 14 }}>%</span></div>
                <div className={styles.sleepStatDesc}>Sleep Efficiency</div>
              </div>
              <div className={styles.sleepStat}>
                <div className={[styles.sleepStatVal, styles.purple].join(' ')}>7h 15m</div>
                <div className={styles.sleepStatDesc}>Sleep Duration</div>
              </div>
            </div>

            <div className={styles.barChart}>
              {months.map((m, i) => {
                const isCurrent = m === 'Sept';
                return (
                  <div key={m} className={styles.barChartItem}>
                    {isCurrent ? (
                      <>
                        <div className={[styles.barChartBar, styles.accent].join(' ')} style={{ height: `${sleepBars[i]}%` }} />
                        <div className={[styles.barChartBar, styles.purple].join(' ')} style={{ height: `${sleepBars2[i]}%`, marginTop: 2 }} />
                      </>
                    ) : (
                      <div className={[styles.barChartBar, styles.dimBg].join(' ')} style={{ height: `${sleepBars[i]}%` }} />
                    )}
                    <span className={[styles.barChartLabel, isCurrent ? styles.active : ''].join(' ')}>
                      {m}{isCurrent ? ' ↗' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
