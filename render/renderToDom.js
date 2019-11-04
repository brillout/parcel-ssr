import React from 'react';
import ReactDOM from 'react-dom';

export default renderToDom;

function renderToDom({page, props, CONTAINER_ID}) {
  const el = React.createElement(page, props);
  const container = window.document.getElementById(CONTAINER_ID);

  ReactDOM.hydrate(el, container);
}
