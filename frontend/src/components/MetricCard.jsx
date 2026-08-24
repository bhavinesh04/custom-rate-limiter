 function MetricCard({ title, value, subtitle }) {
  return (
    <div className="metric-card">
      <p className="metric-title">{title}</p>
      <h2>{value}</h2>
      {subtitle && <p className="metric-subtitle">{subtitle}</p>}
    </div>
  );
}

export default MetricCard;