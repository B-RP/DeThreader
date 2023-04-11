import React from "react";
import Timer from "./timer";

function Popup({ restCountdownTime, longRestCountdownTime, sessions }) {
    // the props are passed down from taskTimer.jsx "called the parent"
  return (
    <div className="popup">
      <div className="popup-inner">
        <p>Enjoy A Break</p>
        <p>Your Break Ends in</p>
        {/* one of the following timers will run conditionally, will impliemnt the logic later */}
        <p>
          <Timer startTime={restCountdownTime} /> 
        </p>
        <p>
          <Timer startTime={longRestCountdownTime} />
        </p>
      </div>
    </div>
  );
}

export default Popup;
