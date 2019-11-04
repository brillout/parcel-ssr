import React from 'react';
import ReactDOM from 'react-dom';

export default hydratePage;

function hydratePage(page) {
  if( !page ){
    throw new Error("Page code is missing.");
  }
  const props = window.__parcel_ssr__props;
  if( !props ){
    throw new Error("Props are missing.");
  }

  const el = React.createElement(page, props);
  const container = window.document.getElementById('page-view');

  console.log('rel', el);
  console.log('container', container);

  ReactDOM.hydrate(el, container);
}
