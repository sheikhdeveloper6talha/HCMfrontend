import styles from "./BarChart.module.css";

// data: [{ label, values: [n, n] }]; series: [{ name, color }]
const BarChart = ({ data, series, height = 160 }) => {
  if (!data?.length) return <p className="muted">No data for this range</p>;
  const max = Math.max(1, ...data.flatMap((d) => d.values));
  return (
    <div>
      <div className={styles.legend}>
        {series.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}</span>)}
      </div>
      <div className={styles.scroll}>
        <div className={styles.chart} style={{ height, minWidth: data.length * 34 }} role="img" aria-label="Bar chart">
          {data.map((d) => (
            <div key={d.label} className={styles.group}>
              <div className={styles.bars}>
                {d.values.map((v, i) => (
                  <div key={i} className={styles.bar} title={`${series[i].name}: ${v}`} style={{ height: `${(v / max) * 100}%`, background: series[i].color }} />
                ))}
              </div>
              <span className={styles.label}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BarChart;
