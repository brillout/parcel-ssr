import React, {useEffect, useState} from 'react';

export default Time;

function Time() {
  const [displayedTime, setDisplayedTime] = useState(getTime());
  useEffect(effect, []);

  return (
    <div>
      The time is: <span>{displayedTime}</span>
    </div>
  );

  function update() {
    const now = getTime();
    if( now!==displayedTime ){
      setDisplayedTime(now);
    }
  }

  function effect() {
    const interval = setInterval(update, 1000/60);
    return () => clearTimeout(interval);
  }
}

function getTime() {
  return new Date().toLocaleTimeString();
}
