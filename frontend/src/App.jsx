import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ShieldX,
  TrendingUp,
  BarChart3,
  Users,
  Info,
  LayoutDashboard
} from "lucide-react";

import MetricCard from "./components/MetricCard";
import EndpointTable from "./components/EndpointTable";
import ClientTable from "./components/ClientTable";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redisStatus, setRedisStatus] = useState("checking");
  const [activePage, setActivePage] = useState("dashboard");

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

        <div>
          <div className="brand">
            <div className="brand-icon">
              <Activity size={20} />
            </div>

            <div>
              <h2>Custom Rate Limiter</h2>
              <p>API Protection System</p>
            </div>
          </div>

          <nav className="nav">

            <button
              className={`nav-item ${
                activePage === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-item ${
                activePage === "about" ? "active" : ""
              }`}
              onClick={() => setActivePage("about")}
            >
              <Info size={18} />
              <span>About</span>
            </button>

          </nav>
        </div>

        <div className="sidebar-status">

          <span
            className={`status-dot ${
              redisStatus !== "connected" ? "status-error" : ""
            }`}
          ></span>

          <span>
            {redisStatus === "checking"
              ? "Checking Redis..."
              : redisStatus === "connected"
                ? "Redis Connected"
                : "Redis Disconnected"}
          </span>

        </div>

      </aside>

      <main className="main">

        {activePage === "dashboard" ? (
          <>
            <header className="header">

              <div>
                <h1>Rate Limiter Dashboard</h1>
                <p>
                  Real-time overview of your protected APIs
                </p>
              </div>

              <div className="header-actions">

                <div className="live">
                  <span className="live-dot"></span>
                  Live
                </div>

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
                icon={<Activity size={21} />}
              />

              <MetricCard
                title="Allowed Requests"
                value={metrics.allowed}
                icon={<CheckCircle2 size={21} />}
              />

              <MetricCard
                title="Rejected Requests"
                value={metrics.rejected}
                icon={<ShieldX size={21} />}
              />

              <MetricCard
                title="Rejection Rate"
                value={`${metrics.rejectionRate}%`}
                icon={<TrendingUp size={21} />}
              />

            </section>

            <section className="tables-grid">

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <BarChart3 size={19} />
                    <h2>Endpoint Statistics</h2>
                  </div>
                </div>

                <div className="table-scroll">
                  <EndpointTable endpoints={metrics.endpoints} />
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Users size={19} />
                    <h2>Client Statistics</h2>
                  </div>
                </div>

                <div className="table-scroll">
                  <ClientTable clients={metrics.clients} />
                </div>
              </div>

            </section>

            {lastUpdated && (
              <p className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}

          </>
        ) : (

          <section className="about-page">

            <h1>About Custom Rate Limiter</h1>

            <p className="about-description">
              A distributed API rate limiting system built to protect
              APIs from excessive traffic while maintaining shared
              rate-limit state across multiple backend instances.
            </p>

            <div className="about-grid">

              <div className="about-card">
                <ShieldX size={22} />
                <h3>Token Bucket</h3>
                <p>
                  Controls request rates using a token bucket algorithm
                  with configurable capacity and refill rate.
                </p>
              </div>

              <div className="about-card">
                <Activity size={22} />
                <h3>Redis + Lua</h3>
                <p>
                  Uses Redis and atomic Lua scripts to safely manage
                  shared rate-limit state across backend instances.
                </p>
              </div>

              <div className="about-card">
                <Users size={22} />
                <h3>Distributed</h3>
                <p>
                  Multiple backend containers can enforce the same
                  rate limit using shared Redis state.
                </p>
              </div>

              <div className="about-card">
                <BarChart3 size={22} />
                <h3>Monitoring</h3>
                <p>
                  Provides request metrics, endpoint statistics,
                  client statistics and Redis health monitoring.
                </p>
              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;