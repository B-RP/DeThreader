import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import Timer from "./timer";
import Popup from "./popup";
import "./taskTimer.css";
import LabelTree from "./labelTree";
import { Sessions } from "./Helper/Context";
import relax from "../assets/relax.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png"

function TaskTimer(props) {
  const {
    workCountdownTime,
    setWorkCountdownTime,
    restCountdownTime,
    longRestCountdownTime,
    sessions,
    user,
  } = props;
  const [time, setTime] = useState(workCountdownTime);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [playAudio, setPlayAudio] = useState(false);
  const { sessionsLength } = useContext(Sessions);
  const myAudio = useRef(null);

  const initialWorkCountdownTime = useRef(workCountdownTime);

  const startCountdownTimer = useCallback(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(intervalId);
          if (currentSession <= sessionsLength) {
            setShowPopup(true);
            setCurrentSession((prevSession) => prevSession + 1);
            setTime(initialWorkCountdownTime.current);
            setPlayAudio(false);
          } else {
            if (currentSession > sessionsLength) {
              setTime(initialWorkCountdownTime.current);
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentSession, sessionsLength, initialWorkCountdownTime]);

  useEffect(() => {
    if (playAudio) {
      myAudio.current.play();
    } else {
      myAudio.current.pause();
    }
  }, [playAudio]);

  useEffect(() => {
    if (!showPopup) {
      startCountdownTimer();
    }
  }, [showPopup, startCountdownTimer]);

  const handlePopupClose = () => {
    setShowPopup(false);
    setPlayAudio(true);
    setCurrentSession((prevSession) => prevSession + 1);
    if (currentSession <= sessionsLength) {
      initialWorkCountdownTime.current =
        currentSession % sessions.longRest === 0
          ? longRestCountdownTime
          : restCountdownTime;
      setTime(initialWorkCountdownTime.current);
      // setWorkCountdownTime(initialWorkCountdownTime.current);
    } else {
      setTime(workCountdownTime);
    }
  };

  return (
    <>
      <div className="main-div">
        <div className="headd">
          <p>
            <span style={{ color: "#ffffff" }}>DE</span>THREADER
          </p>
        </div>
        <div className="wor-timer">
          <h1>
            <Timer startTime={time} />
          </h1>
        <h1 className="tsk" style={{color: "#A1CCA5"}}>TASKS</h1>
        </div>
        {showPopup && (
          <Popup
            handlePopupClose={handlePopupClose}
            restCountdownTime={restCountdownTime}
            longRestCountdownTime={longRestCountdownTime}
            sessions={sessions}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            workCountdownTime={workCountdownTime}
            setWorkCountdownTime={setWorkCountdownTime}
            audioRef={myAudio}
          />
        )}
        <div className="tasks">
          <h5>
            <LabelTree user={user} />
          </h5>
        </div>
        <div className="play">
          <button onClick={() => setPlayAudio(!playAudio)}>
            {playAudio ? (
              <span>
                <FontAwesomeIcon icon={faPause} /> Pause
              </span>
            ) : (
              <span>
                <FontAwesomeIcon icon={faPlay} /> Play
              </span>
            )}
          </button>
          <audio src={relax} ref={myAudio}></audio>
        </div>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </div>
    </>
  );
}

export default TaskTimer;
