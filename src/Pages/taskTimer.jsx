import React from "react";
import { useState, useEffect } from "react";
import Timer from "./timer";
import Popup from "./popup";
import "./taskTimer.css"

function TaskTimer(props) {
  // define the state variables
  const { // these are the timer's state variables passed down from "setTimer.jsx"
    workCountdownTime,
    restCountdownTime,
    longRestCountdownTime,
    sessions,
  } = props;
  const [time, setTime] = useState(workCountdownTime); // set initial time for count down
  const [showPopup, setShowPopup] = useState(false); // to render Popup conditionally

  // Impliemnt the logic for the count-down Timer
  // useEffect hook accepts a callback function which impliment the logic, and an array of dependencies which cause it to trigger whenever they change, in this case dependencies are empty, so it will be triggered on pageload
useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) { // this condition is to make sure that the counter don't count negative values afther reaching 0
          return prevTime - 1;
        } else {
          clearInterval(intervalId); // stop the timer 
          setShowPopup(true); // set showPopup to true when time reaches 0
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <>
      <div className="wor-timer">
        <Timer startTime={time} />
      </div>
      {/* Conditional rendering of Popup component based on the value of `showPopup` */}
      {showPopup && <Popup restCountdownTime={restCountdownTime} longRestCountdownTime={longRestCountdownTime} />}

    </>
  );
}

export default TaskTimer;
