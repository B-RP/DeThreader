import React, { useState, useEffect } from 'react';

function Timer({ startTime, onComplete, startTimer }) {
  const [timeRemaining, setTimeRemaining] = useState(startTime);

  useEffect(() => {
    if (startTimer) {
      const intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime > 0) {
            if((prevTime - 1) == 0){
              onComplete()
            }
            return prevTime - 1
          } else {
            console.log('intervalId', prevTime)
            clearInterval(intervalId)
            return 0
          }
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime, startTimer]);
  useEffect(()=>{
    setTimeRemaining(startTime)
  },[startTime,startTimer])

  return (
    <div style={{ color: "#FFFFFF" }}>
      <p>
        {Math.floor(timeRemaining / 60)}:
        {(timeRemaining % 60).toString().padStart(2, '0')}
      </p>

    </div>
  );
}

export default Timer;