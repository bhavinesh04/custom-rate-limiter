import { useCallback, useEffect, useState } from "react";
import MetricCard from "./components/MetricCard";
import EndpointTable from "./components/EndpointTable";
import ClientTable from "./components/ClientTable";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redisStatus, setRedisStatus] = useState("checking");

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/metrics");

      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const data = await response.json();

      setMetrics(data);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/health");

      if (!response.ok) {
        throw new Error("Redis unavailable");
      }

      const data = await response.json();

      setRedisStatus(data.redis);
    } catch (error) {
      setRedisStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchHealth();

    const interval = setInterval(() => {
      fetchMetrics();
      fetchHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchMetrics, fetchHealth]);

  if (error && !metrics) {
    return <h2>{error}</h2>;
  }

  if (!metrics) {
    return <h2>Loading metrics...</h2>;
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <h2>Custom Rate Limiter</h2>
          <p>API Protection System</p>
        </div>

        <nav className="nav">
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">About</div>
        </nav>

        <div className="sidebar-status">
  <span
    className={`status-dot ${
      redisStatus !== "connected" ? "status-error" : ""
    }`}
  ></span>

  {redisStatus === "checking"
    ? "Checking Redis..."
    : redisStatus === "connected"
      ? "Redis Connected"
      : "Redis Disconnected"}
</div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>Rate Limiter Dashboard</h1>
            <p>Real-time overview of your protected APIs</p>
          </div>

          <div className="header-actions">
            <div className="live">● Live</div>

            <button
              className="refresh-button"
              onClick={fetchMetrics}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <section className="metrics-grid">
          <MetricCard
            title="Total Requests"
            value={metrics.totalRequests}
          />

          <MetricCard
            title="Allowed Requests"
            value={metrics.allowed}
          />

          <MetricCard
            title="Rejected Requests"
            value={metrics.rejected}
          />

          <MetricCard
            title="Rejection Rate"
            value={`${metrics.rejectionRate}%`}
          />
        </section>

        <section className="tables-grid">
          <EndpointTable endpoints={metrics.endpoints} />
          <ClientTable clients={metrics.clients} />
        </section>

        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </main>
    </div>
  );
}

export default App;