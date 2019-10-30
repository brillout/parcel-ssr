import React from 'react';

import ReactDOM from 'react-dom';

if( !window.__parcel_ssr__page_view ){
  throw new Error("Page code is missing.");
};
if( !window.__parcel_ssr__props ){
  throw new Error("Props are missing.");
}

const el = React.createElement(window.__parcel_ssr__page_view, window.__parcel_ssr__props);
const container = window.document.getElementById('page-view');

console.log('rel', el);
console.log('container', container);

ReactDOM.hydrate(el, container);
