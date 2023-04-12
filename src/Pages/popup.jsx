import React, { useEffect } from "react";
import Timer from "./timer";

function Popup({
  restCountdownTime,
  longRestCountdownTime,
  sessions,
  showPopup,
  setShowPopup,
  currentSession,
  setCurrentSession,
  workCountdownTime,
  setWorkCountdownTime,
  audioRef,
  handlePopupClose
}) {
  // close the popup and reset the timer to the initial value when it's closed
  // const handlePopupClose = () => {
  //   setShowPopup(false);
  //   setCurrentSession((prevSession) => prevSession + 1);
  //   if (currentSession < sessions) {
  //     setWorkCountdownTime(workCountdownTime);
  //   }
  // };

  useEffect(() => {
    if (showPopup) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [showPopup, audioRef, currentSession, restCountdownTime, longRestCountdownTime, sessions, setShowPopup, setWorkCountdownTime]);


  return (
    <div className={`popup ${showPopup ? "open" : ""}`}>
      <div className="popup-inner">
        <h2>Time for a break!</h2>
        <p>
          {currentSession % 4 === 0 ? "Take a long rest" : "Take a short rest"}
        </p>
        <Timer
          startTime={
            currentSession % 4 === 0
              ? longRestCountdownTime
              : restCountdownTime
          }
        />
        <button onClick={handlePopupClose}>Close</button>
      </div>
    </div>
  );
}

export default Popup;
