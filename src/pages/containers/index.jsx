
export default ({containers}) => (
  <div className="pane content">
    <h2>Containers</h2>
    <table className="pure-table pure-table-striped table-fixed">
      <thead>
        <tr>
          <th>Name</th>
          <th>Image</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {containers.map(container => (
          <tr key={container.id}>
            <td><a href={`/container/${container.id}`} title={container.id}>{container.name}</a></td>
            <td>{container.image}</td>
            <td>{container.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
