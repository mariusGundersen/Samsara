import React from 'react';
import Icon from '../../components/icon';
import nth from '../../private/nthLife';

export default ({name, lives}) => (
  <div className="pane content">
    <h2><Icon of="history" />{name} lives</h2>
    <div>
      <table className="pure-table pure-table-striped table-fixed">
        <thead>
          <tr>
            <th>Life</th>
            <th>Status</th>
            <th>Uptime</th>
          </tr>
        </thead>
        <tbody>
          {lives.map(life => (
            <tr key={life.life}>
              <td><a href={`/spirit/${name}/life/${life.life}`}>{nth(life.life)} life</a></td>
              <td>{life.status}</td>
              <td>{life.uptime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
