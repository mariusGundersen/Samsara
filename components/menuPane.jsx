import React from 'react';
import Icon from './icon';

export default ({icon, href, title, children}) => (
  <div className="pane menu">
    <h2><a href="#"><Icon of={icon} /></a><a href={href}>{title}</a></h2>
    {children}
  </div>
);