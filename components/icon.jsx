import React from 'react';

export default props => <i className={[...classFrom(props)].join(' ')}></i>;

function *classFrom({
  of,
  rotate,
  fixedWidth = true
}){
  yield 'fa';
  yield `fa-${of}`;
  if(fixedWidth)  yield 'fa-fw';
  if(rotate) yield `fa-rotate-${rotate}`;
}
