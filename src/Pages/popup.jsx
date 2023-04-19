import React, { useEffect } from "react";
import Timer from "./timer";
import "./Style.css"

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
  }, [showPopup]);
  console.log("current popup session",currentSession,longRestCountdownTime,restCountdownTime)
  return (
    <div className={`popup ${showPopup ? "open" : ""}`}>
      <div className="popup-inner">
        <h2>Time for a break!</h2>
        <p>
          {currentSession % sessions === 0 ? "Take a long rest" : "Take a short rest"}
        </p>
        <Timer
          startTime={
            currentSession % sessions === 0
              ? longRestCountdownTime
              : restCountdownTime
          }
          onComplete={()=>{
            console.log('this is closing')
            handlePopupClose()
          }}
          startTimer={true}
        />
        {/* <button onClick={handlePopupClose}>Close</button> */}
      </div>
    </div>
  );
}

export default Popup;
