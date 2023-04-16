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
import { GuestSession, Sessions } from "./Helper/Context";
import relax from "../assets/relax.mp3";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";

const db = getDatabase(); //Initialize database

const fetchTasks = (userId, setWorkCountdownTime, setRestCountdownTime, setLongRestCountdownTime, setSessions, setFields, setTime) => {
  const tasksRef = ref(db, `sessions/${userId}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      let workTime = data.workTime
      let restTime = data.restTime
      let longRestTime = data.longRestTime
      let workSessionPerCycle = data.workSessionPerCycle
      let tasks = data.tasks
      setWorkCountdownTime(workTime);
      setTime(workTime);
      setRestCountdownTime(restTime);
      setLongRestCountdownTime(longRestTime);
      setSessions(workSessionPerCycle);
      setFields(tasks);
      console.log(data)
    }
  });
};

const fetchAnalytics = (userId, setStatsCycles, setStatsWork, setStatsRest) => {
  const tasksRef = ref(db, `stats/${userId}`);
  onValue(tasksRef, (snapshot) => {
    console.log("new user",snapshot.exists())
    const data = snapshot.val();
    console.log("new user",data)
    if (data) {
      setStatsCycles(data.statsCycles)
      setStatsWork(data.statsWork)
      setStatsRest(data.statsRest)
    } else {
      setStatsCycles(0)
      setStatsWork(0)
      setStatsRest(0)
    }
  });
};

const fetchImageUrl = (userId, setImage) => {
  const tasksRef = ref(db, `profile/${userId}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setImage(data.url)
    }
  });
};

function TaskTimer(props) {
  const {
    user,
  } = props;
  const { guestSession, setGuestSession } = useContext(GuestSession);
  const navigate = useNavigate()
  const [time, setTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [workCountdownTime, setWorkCountdownTime] = useState(1);
  const [restCountdownTime, setRestCountdownTime] = useState(1);
  const [longRestCountdownTime, setLongRestCountdownTime] = useState(1);
  const [sessions, setSessions] = useState(1);
  const [statsCycles, setStatsCycles] = useState(null);
  const [statsWork, setStatsWork] = useState(null);
  const [statsRest, setStatsRest] = useState(null);
  const [fields, setFields] = useState([]);
  const [playAudio, setPlayAudio] = useState(false);
  const [image, setImage] = useState(null);
  const myAudio = useRef(null);
  useEffect(() => {
    if (user) {
      fetchTasks(user.uid, setWorkCountdownTime, setRestCountdownTime, setLongRestCountdownTime, setSessions, setFields, setTime);
      fetchAnalytics(user.uid, setStatsCycles, setStatsWork, setStatsRest)
      fetchImageUrl(user.uid, setImage)
    } else {
      setFields(guestSession.tasks)
      setRestCountdownTime(guestSession.restCountdownTime)
      setLongRestCountdownTime(guestSession.longRestCountdownTime)
      setSessions(guestSession.sessions)
      setWorkCountdownTime(guestSession.workTime)
      setTime(guestSession.workTime)
      setStatsCycles(0)
    }
  }, [user]);
  
  console.log('@@@@@@@@@@statsCycles,statsWork,statsRest', statsCycles,statsWork,statsRest)

  const onComplete = useCallback(() => {
    if (currentSession <= sessions) {
      setPlayAudio(false);
    } else {
      setCurrentSession(1)
    }
    console.log('statsCycles,statsWork,statsRest', statsCycles,statsWork,statsRest)
    if (!isNaN(parseInt(statsCycles)) && !isNaN(parseInt(statsWork))) {
      setStatsWork(statsWork + workCountdownTime)
    }
    setShowPopup(true);
    setTime(workCountdownTime);
  },[statsCycles,statsWork,currentSession,sessions,workCountdownTime])

  useEffect(() => {
    if (playAudio) {
      myAudio.current.play();
    } else {
      myAudio.current.pause();
    }
  }, [playAudio]);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
    setPlayAudio(true);
    if (currentSession < sessions) {
      setCurrentSession((prevSession) => prevSession + 1);
      if (!isNaN(parseInt(statsCycles)) && !isNaN(parseInt(statsRest))) {
        setStatsRest(statsRest + restCountdownTime)
      }
    } else {
      if (!isNaN(parseInt(statsCycles)) && !isNaN(parseInt(statsRest))) {
        setStatsCycles(statsCycles + 1)
        setStatsRest(statsRest + longRestCountdownTime)
      }
      setCurrentSession(1);
    }
  },[statsRest,statsCycles,longRestCountdownTime,restCountdownTime,sessions,currentSession]);

  const saveStats = () => {
    if (user && user.uid && (statsCycles !== null) && (statsWork !== null) && (statsRest !== null)) {
      const statsRef = ref(db, `stats/${user.uid}`);
      const newStats = {
        statsCycles: statsCycles,
        statsWork: statsWork,
        statsRest: statsRest,
      };
      set(statsRef, newStats)
        .then(() => {
          console.log(statsRef)
        })
        .catch((error) => {
          alert("An Error Occured, Please Try Again!")
        });
    }
  };

  const saveTasksData = (updatedFields) => {
    const newSession = {
      tasks: updatedFields,
      status: updatedFields.filter(f => !f.checked).length ? "Incomplete" : "Complete",
      workTime: workCountdownTime,
      restTime: restCountdownTime,
      longRestTime: longRestCountdownTime,
      workSessionPerCycle: sessions,
    };
    if (user && user.uid) {
      const tasksRef = ref(db, `sessions/${user.uid}`);
      set(tasksRef, newSession)
        .then(() => {
          if (newSession.status === "Complete") {
            navigate("/dashboard")
          }
        })
        .catch((error) => {
          alert("An Error Occured, Please Try Again!")
        });
    } else {
      setGuestSession(newSession)
    }
  };
  const cancelSession = () => {
    const newSession = {
      tasks: fields,
      status: "Cancelled",
      workTime: workCountdownTime,
      restTime: restCountdownTime,
      longRestTime: longRestCountdownTime,
      workSessionPerCycle: sessions,
    };
    if (user && user.uid) {
      const tasksRef = ref(db, `sessions/${user.uid}`);
      set(tasksRef, newSession)
        .then(() => {
          navigate("/dashboard")
        })
        .catch((error) => {
          alert("An Error Occured, Please Try Again!")
        });
    } else {
      setGuestSession(newSession)
      navigate("/dashboard")
    }
  };

  const updateFields = (updatedFields) => {
    setFields(updatedFields)
    saveTasksData(updatedFields)
  }

  useEffect(() => {
    saveStats()
  }, [statsCycles, statsWork, statsRest])

  return (
    <>
      <div className="main-div">
        <div className="headd" style={{ display: "flex" }}>
          <p onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            <span style={{ color: "#ffffff" }}>DE</span>THREADER
          </p>
          <p onClick={() => cancelSession()} style={{ cursor: "pointer" }}>
            Cancel session
          </p>
        </div>
        <div className="wor-timer">
          <h1>
            {time && (statsCycles!==null) && <Timer startTime={time} onComplete={onComplete} startTimer={!showPopup} />}
          </h1>
          <h1 className="tsk" style={{ color: "#A1CCA5" }}>TASKS</h1>
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
            <LabelTree user={user} fields={fields} setFields={updateFields} />
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
        {!image ?
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          : <div>
            <img className="avatar-profile" src={image} />
          </div>}
      </div>
    </>
  );
}

export default TaskTimer;
