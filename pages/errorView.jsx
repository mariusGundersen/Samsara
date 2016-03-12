import React from 'react';

export default ({message, error}) => (
  <div className="pane content">
    <h2>{message}</h2>
    <h3>{error.status}</h3>
    <pre>{error.stack}</pre>
  </div>
);