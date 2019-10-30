import React from 'react';

import ReactDOM from 'react-dom';

if( !window.__parcel_ssr__page_view ){
  throw new Error("Page code is missing.");
};

ReactDOM.render(
  React.createElement(window.__parcel_ssr__page_view),
  document.getElementById('page-view-root')
);
