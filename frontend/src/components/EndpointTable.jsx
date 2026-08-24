function EndpointTable({ endpoints }) {
  const entries = Object.entries(endpoints);

  return (
    <div className="panel">
      <h2>Endpoint Statistics</h2>

      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Allowed</th>
            <th>Rejected</th>
            <th>Rejection Rate</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(([endpoint, data]) => {
            const total = data.allowed + data.rejected;

            const rejectionRate =
              total === 0
                ? 0
                : ((data.rejected / total) * 100).toFixed(1);

            return (
              <tr key={endpoint}>
                <td>{endpoint}</td>
                <td>{data.allowed}</td>
                <td>{data.rejected}</td>
                <td>{rejectionRate}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EndpointTable;