function ClientTable({ clients }) {
  const entries = Object.entries(clients);

  return (
    <div className="panel">
      <h2>Client Statistics</h2>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Allowed</th>
            <th>Rejected</th>
            <th>Rejection Rate</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(([client, data]) => {
            const total = data.allowed + data.rejected;

            const rejectionRate =
              total === 0
                ? 0
                : ((data.rejected / total) * 100).toFixed(1);

            return (
              <tr key={client}>
                <td>{client}</td>
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

export default ClientTable;