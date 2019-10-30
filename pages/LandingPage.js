import React from 'react';

console.log('bla for node/browser -- dirname:'+__dirname);

const LandingPage = () => {
   return (
     <div>
       Hello from Parcel SSR!
     </div>
   );
};

if( typeof window !== "undefined" ){
  window.__parcel_ssr__page_view = LandingPage;
}

export default LandingPage;
