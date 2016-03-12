import React from 'react';

export default ({message, error={}}) => (
  <div className="pane content">
    <h2>{message}</h2>
    <pre>{error.stack}</pre>
  </div>
);