import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./setTimer.css";
import { useNavigate } from "react-router-dom";

function SetTimer(props) {
  // Set A different state for different counters eg. wor, rest, log rest, sessions
  const [workCountdownTime, setWorkCountdownTime] = useState(60); // 25 minutes in seconds
  const [restCountdownTime, setrestCountdownTime] = useState(60); // 5 minutes in seconds
  const [longRestCountdownTime, setlongRestkCountdownTime] = useState(60); // 20 minutes in seconds
  const [sessions, setSessions] = useState(4);
    const navigate = useNavigate(); // to be able to navigate to other screen

  // const startCountdown = () => {
  //   setTimeout(() => {
  //     setWorkCountdownTime(workCountdownTime - 1);
  //   }, 1000);

  //   setTimeout(() => {
  //     setrestCountdownTime(restCountdownTime - 1);
  //   }, 1000);

  //   setTimeout(() => {
  //     setlongRestkCountdownTime(longRestCountdownTime - 1);
  //   }, 1000);
  // };

  // the coming functions take 2 parameteres, counters and their setters, and change the timesers' value on clicking
  // this is better than making separate functions for each timer
  const increaseMinutes = (counter, setCounter) => {
    setCounter(counter + 60);
  };

  // For decreasing minutes and seconds we need to check first if the counter value will go to negative number after deduction or not, we should deduct only if it doesn't go to negative value
  const decreaseMinutes = (counter, setCounter) => {
    if (counter >= 60) {
      setCounter(counter - 60);
    }
  };

  const increaseSeconds = (counter, setCounter) => {
    setCounter(counter + 1);
  };

  const decreaseSeconds = (counter, setCounter) => {
    if (counter >= 1) {
      setCounter(counter - 1);
    }
  };

  const increaseSessions = () => {
    setSessions(sessions + 1);
  };

  const decreaseSessions = () => {
    setSessions(sessions - 1);
  };


  // on Clicking on next button, this function will call an other function from App.js, It will update the timer's starting value then navigate the next page whhere the timer start to work on page load, a start on button will be implemented later
  const handleNextButtonClick = () => {
    props.updateTimers(workCountdownTime, restCountdownTime, longRestCountdownTime, sessions);
    navigate("/taskTimer");
  };

  return (
    <>
      <div className="timer-container">
        <div className="work-outer">
          <div className="work">
            <p>Work</p>
            {/* <h1>{Math.floor(countdownTime / 60)}:{(countdownTime % 60).toString().padStart(2, '0')}</h1> */}
            <div className="times">
              <div className="minutes">
                <button
                  onClick={() =>
                    increaseMinutes(workCountdownTime, setWorkCountdownTime)
                  }
                >
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    style={{ color: "#FFFFFF" }}
                  />
                </button>
                <h1>{Math.floor(workCountdownTime / 60)} : </h1>
                <button
                  onClick={() =>
                    decreaseMinutes(workCountdownTime, setWorkCountdownTime)
                  }
                >
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    style={{ color: "#FFFFFF" }}
                  />
                </button>
              </div>
              {/* .work .minutes */}
              <div className="seconds">
                <button
                  onClick={() =>
                    increaseSeconds(workCountdownTime, setWorkCountdownTime)
                  }
                >
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    style={{ color: "#FFFFFF" }}
                  />
                </button>
                <h1>{(workCountdownTime % 60).toString().padStart(2, "0")}</h1>
                <button
                  onClick={() =>
                    decreaseSeconds(workCountdownTime, setWorkCountdownTime)
                  }
                >
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    style={{ color: "#FFFFFF" }}
                  />
                </button>
              </div>
              {/* .work .seconds */}
            </div>
            {/* .times */}
          </div>
          {/* .work */}
        </div>
        {/* .work-outer */}

        <div className="rest">
          <p>Rest</p>
          <div className="times">
            <div className="minutes">
              <button
                onClick={() =>
                  increaseMinutes(restCountdownTime, setrestCountdownTime)
                }
              >
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
              <h1>{Math.floor(restCountdownTime / 60)} : </h1>
              <button
                onClick={() =>
                  decreaseMinutes(restCountdownTime, setrestCountdownTime)
                }
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
            </div>
            {/* .rest .minutes */}
            <div className="seconds">
              <button
                onClick={() =>
                  increaseSeconds(restCountdownTime, setrestCountdownTime)
                }
              >
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
              <h1> {(restCountdownTime % 60).toString().padStart(2, "0")}</h1>
              <button
                onClick={() =>
                  decreaseSeconds(restCountdownTime, setrestCountdownTime)
                }
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
            </div>
            {/* .rest .seconds */}
          </div>
          {/* .rest .times */}
        </div>
        {/* .rest */}
        <div className="long-rest">
          <p>Long Rest</p>
          <div className="times">
            <div className="minutes">
              <button
                onClick={() =>
                  increaseMinutes(
                    longRestCountdownTime,
                    setlongRestkCountdownTime
                  )
                }
              >
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
              <h1>{Math.floor(longRestCountdownTime / 60)} : </h1>
              <button
                onClick={() =>
                  decreaseMinutes(
                    longRestCountdownTime,
                    setlongRestkCountdownTime
                  )
                }
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
            </div>
            {/* .long-rest .minutes */}
            <div className="seconds">
              <button
                onClick={() =>
                  increaseSeconds(
                    longRestCountdownTime,
                    setlongRestkCountdownTime
                  )
                }
              >
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
              <h1>
                {" "}
                {(longRestCountdownTime % 60).toString().padStart(2, "0")}
              </h1>
              <button
                onClick={() =>
                  decreaseSeconds(
                    longRestCountdownTime,
                    setlongRestkCountdownTime
                  )
                }
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
            </div>
            {/* .long-rest .seconds */}
          </div>
          {/* .long-rest .times */}
        </div>
        {/* .long-rest */}
        <div className="long-break">
          <p>Long Break After:</p>
          <div className="times">
            <div className="minutes">
              <button onClick={increaseSessions}>
                <FontAwesomeIcon
                  icon={faChevronUp}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
              <h1>{sessions}</h1>
              <button onClick={decreaseSessions}>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ color: "#FFFFFF" }}
                />
              </button>
            </div>
            {/* .long-rest .minutes */}
          </div>
          {/* .long-rest .times */}
        </div>
        <button
          className="next-btn"
          style={{ color: "#FFFFFF" }}
          onClick={handleNextButtonClick}
        >
          Next
        </button>
      </div>
      {/* .timer-container */}
    </>
  );
}

export default SetTimer;
