import React from 'react';
import Time from './Time';

const LandingPage = ({name}) => {
   return <>
     <div>
       Hello {name} from Parcel SSR!
     </div>
     <Time/>
   </>;
};

export default LandingPage;
