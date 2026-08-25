function MetricCard({ title, value, subtitle, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-card-top">
        <p className="metric-title">{title}</p>
        <div className="metric-icon">
          {icon}
        </div>
      </div>

      <h2>{value}</h2>

      {subtitle && <p className="metric-subtitle">{subtitle}</p>}
    </div>
  );
}

export default MetricCard;