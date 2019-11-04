import React from 'react';
import ReactDOM from 'react-dom';
import Time from './Time';

console.log('bla for node/browser -- dirname:'+__dirname);

const LandingPage = ({name}) => {
   return <>
     <div>
       Hello {name} from Parcel SSR!
     </div>
     <Time/>
   </>;
};

if( typeof window !== "undefined" ){
  window.__parcel_ssr__page_view = LandingPage;
  window.React = React;
  window.ReactDOM = ReactDOM;
}

export default LandingPage;
