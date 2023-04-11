import React, { useState, useEffect } from 'react';

function Timer({ startTime }) {
  const [timeRemaining, setTimeRemaining] = useState(startTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime > 0 ? prevTime - 1  : 0);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div style={{color: "#FFFFFF"}}>
      <p>
      {Math.floor(timeRemaining / 60)}:
      {(timeRemaining % 60).toString().padStart(2, '0')}
      </p>

    </div>
  );
}

export default Timer;