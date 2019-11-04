import React from 'react';
import ReactDOM from 'react-dom';

const CONTAINER_ID = 'page-view';

export default hydratePage;

function hydratePage({page, renderToDom}) {
  if( !page ){
    throw new Error("Page code is missing.");
  }
  if( !renderToDom ){
    throw new Error("`renderToDom` code is missing.");
  }
  const props = window.__parcel_ssr__props;
  if( !props ){
    throw new Error("Props are missing.");
  }

  return renderToDom({page, props, CONTAINER_ID});
}
