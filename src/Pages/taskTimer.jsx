import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from 'react'
import Timer from './timer'
import Popup from './popup'
import './taskTimer.css'
import './Style.css'
import LabelTree from './labelTree'
import { GuestSession } from './Helper/Context'
import lofi from '../assets/lofi.mp3'
import { getDatabase, ref, set, onValue } from 'firebase/database'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faX } from '@fortawesome/free-solid-svg-icons'
import DefaultIMG from '../assets/DefaultIMG.png'
import { useNavigate } from 'react-router-dom'
import { encryptTasks, decryptTasks } from '../utils/taskEncryption'
const db = getDatabase() //Initialize database

const fetchTasks = (
  userId,
  setWorkCountdownTime,
  setRestCountdownTime,
  setLongRestCountdownTime,
  setSessions,
  setFields,
  setTime
) => {
  const tasksRef = ref(db, `sessions/${userId}`)
  onValue(tasksRef, snapshot => {
    const data = snapshot.val()
    if (data) {
      console.log('taskTimer 38 data:', data)
      let workTime = data.workTime
      let restTime = data.restTime
      let longRestTime = data.longRestTime
      let workSessionPerCycle = data.workSessionPerCycle
      let tasks = data.tasks
      setWorkCountdownTime(workTime)
      setTime(workTime)
      setRestCountdownTime(restTime)
      setLongRestCountdownTime(longRestTime)
      setSessions(workSessionPerCycle)

      //decryption
      const decryptedTasks = decryptTasks(tasks)

      setFields(decryptedTasks)
    }
  })
}

const fetchAnalytics = (userId, setStatsCycles, setStatsWork, setStatsRest) => {
  const tasksRef = ref(db, `stats/${userId}`)
  onValue(tasksRef, snapshot => {
    const data = snapshot.val()
    if (data) {
      setStatsCycles(data.statsCycles)
      setStatsWork(data.statsWork)
      setStatsRest(data.statsRest)
    } else {
      setStatsCycles(0)
      setStatsWork(0)
      setStatsRest(0)
    }
  })
}

const fetchImageUrl = (userId, setImage) => {
  const tasksRef = ref(db, `profile/${userId}`)
  onValue(tasksRef, snapshot => {
    const data = snapshot.val()
    if (data) {
      setImage(data.url)
    }
  })
}

function TaskTimer(props) {
  const { user } = props
  const { guestSession, setGuestSession } = useContext(GuestSession)
  const navigate = useNavigate()
  const [time, setTime] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [currentSession, setCurrentSession] = useState(1)
  const [workCountdownTime, setWorkCountdownTime] = useState(1)
  const [restCountdownTime, setRestCountdownTime] = useState(1)
  const [longRestCountdownTime, setLongRestCountdownTime] = useState(1)
  const [sessions, setSessions] = useState(1)
  const [statsCycles, setStatsCycles] = useState(null)
  const [statsWork, setStatsWork] = useState(null)
  const [statsRest, setStatsRest] = useState(null)
  const [fields, setFields] = useState([])
  const [playAudio, setPlayAudio] = useState(false)
  const [image, setImage] = useState(null)
  const myAudio = useRef(null)
  useEffect(() => {
    if (user) {
      fetchTasks(
        user.uid,
        setWorkCountdownTime,
        setRestCountdownTime,
        setLongRestCountdownTime,
        setSessions,
        setFields,
        setTime
      )
      fetchAnalytics(user.uid, setStatsCycles, setStatsWork, setStatsRest)
      fetchImageUrl(user.uid, setImage)
    } else {
      setFields(guestSession.tasks)
      setRestCountdownTime(guestSession.restTime)
      setLongRestCountdownTime(guestSession.longRestTime)
      setSessions(guestSession.workSessionPerCycle)
      setWorkCountdownTime(guestSession.workTime)
      setTime(guestSession.workTime)
      setStatsCycles(0)
    }
  }, [user])

  const onComplete = useCallback(() => {
    if (currentSession <= sessions) {
      setPlayAudio(false)
    } else {
      setCurrentSession(1)
    }

    if (!isNaN(parseInt(statsCycles)) && !isNaN(parseInt(statsWork))) {
      setStatsWork(statsWork + workCountdownTime)
    }
    setShowPopup(true)
    setTime(workCountdownTime)
  }, [statsCycles, statsWork, currentSession, sessions, workCountdownTime])

  useEffect(() => {
    if (playAudio) {
      myAudio.current.play()
    } else {
      myAudio.current.pause()
    }
  }, [playAudio])

  const handlePopupClose = useCallback(() => {
    setShowPopup(false)
    setPlayAudio(true)
    if (currentSession < sessions) {
      setCurrentSession(prevSession => prevSession + 1)
      if (!isNaN(parseInt(statsCycles)) && !isNaN(parseInt(statsRest))) {
        setStatsRest(statsRest + restCountdownTime)
      }
    } else {
      if (!isNaN(parseInt(statsCycles)) && !isNaN(parseInt(statsRest))) {
        setStatsCycles(statsCycles + 1)
        setStatsRest(statsRest + longRestCountdownTime)
      }
      setCurrentSession(1)
    }
  }, [
    statsRest,
    statsCycles,
    longRestCountdownTime,
    restCountdownTime,
    sessions,
    currentSession
  ])

  const saveStats = () => {
    if (
      user &&
      user.uid &&
      statsCycles !== null &&
      statsWork !== null &&
      statsRest !== null
    ) {
      const statsRef = ref(db, `stats/${user.uid}`)
      const newStats = {
        statsCycles: statsCycles,
        statsWork: statsWork,
        statsRest: statsRest
      }
      set(statsRef, newStats)
        .then(() => {
          console.log(statsRef)
        })
        .catch(error => {
          console.error(error)
          alert('An Error Occured, Please Try Again!')
        })
    }
  }

  const saveTasksData = updatedFields => {
    const encryptedFields = encryptTasks(updatedFields)
    const newSession = {
      tasks: encryptedFields,
      status: updatedFields.filter(f => !f.checked).length
        ? 'Incomplete'
        : 'Complete',
      workTime: workCountdownTime,
      restTime: restCountdownTime,
      longRestTime: longRestCountdownTime,
      workSessionPerCycle: sessions
    }
    console.log('taskTimer 212, saveTaskData, newSession:', newSession)
    if (user && user.uid) {
      const tasksRef = ref(db, `sessions/${user.uid}`)
      set(tasksRef, newSession)
        .then(() => {
          if (newSession.status === 'Complete') {
            // navigate("/dashboard")
            window.location.href = '#confirmation'
          }
        })
        .catch(error => {
          alert('An Error Occured, Please Try Again!')
        })
    } else {
      setGuestSession(newSession)
      if (newSession.status === 'Complete') {
        // navigate("/dashboard")
        window.location.href = '#confirmation'
      }
    }
  }
  const cancelSession = () => {
    const encryptedFields = encryptTasks(fields)
    const newSession = {
      tasks: encryptedFields,
      status: 'Cancelled',
      workTime: workCountdownTime,
      restTime: restCountdownTime,
      longRestTime: longRestCountdownTime,
      workSessionPerCycle: sessions
    }
    if (user && user.uid) {
      const tasksRef = ref(db, `sessions/${user.uid}`)
      set(tasksRef, newSession)
        .then(() => {
          navigate('/dashboard')
        })
        .catch(error => {
          alert('An Error Occured, Please Try Again!')
        })
    } else {
      setGuestSession(newSession)
      navigate('/dashboard')
    }
  }

  const updateFields = updatedFields => {
    setFields(updatedFields)
    saveTasksData(updatedFields)
  }

  useEffect(() => {
    saveStats()
  }, [statsCycles, statsWork, statsRest])

  return (
    <>
      <div className="Background">
        <div className="MainCenterContainer">
          <div id="confirmation" className="overlay">
            {/*Message shown after completing all tasks */}
            <div className="custom-popup">
              <h2>Nice Dethreading!</h2>
              <a className="close" href="#">
                &times;
              </a>
              <div className="content">
                <div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="confirm-btn"
                  >
                    Complete session and exit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*Site title */}
          <div>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>

          <br></br>

          <div className="SessionContainer">
            <div className="SessionLeft">
              <div className="wor-timer">
                <h1>
                  {time && statsCycles !== null && (
                    <Timer
                      startTime={time}
                      onComplete={onComplete}
                      startTimer={!showPopup}
                    />
                  )}
                </h1>
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
                  <LabelTree
                    user={user}
                    fields={fields}
                    setFields={updateFields}
                  />
                </h5>
              </div>
            </div>

            <div className="SessionRight">
              {!image ? (
                <div>
                  <img
                    className="SessionImg"
                    src={DefaultIMG}
                    alt="Default"
                  />
                </div>
              ) : (
                <div>
                  <img className="SessionImg" src={image} alt="SessionImg" />
                </div>
              )}

              <div className="play">
                {/*
              <button onClick={() => setPlayAudio(!playAudio)}>
                {playAudio ? (
                  <span>
                    <FontAwesomeIcon icon={faPause}/> Pause Audio
                  </span>
                  ) : (
                  <span>
                    <FontAwesomeIcon icon={faPlay} /> Play Audio 
                  </span>
                  )}
              </button>
              <audio src={relax} ref={myAudio}></audio>
                  */}
                <div className="buttonContainer">
                  {/*
                <span onClick={() => cancelSession()} className="textButton">
                End and Delete Session
                </span>
                  

                <span onClick={() => { navigate("/dashboard")}} className="textButton">
                Save and Exit
                </span>
                  */}

                  <button onClick={() => setPlayAudio(!playAudio)}>
                    {playAudio ? (
                      <span>
                        <FontAwesomeIcon icon={faPause} /> Pause Audio
                      </span>
                    ) : (
                      <span>
                        <FontAwesomeIcon icon={faPlay} /> Play Audio
                      </span>
                    )}
                  </button>
                  <audio src={lofi} ref={myAudio}></audio>
                  {user && user.uid ? (
                    <>
                      <button onClick={() => cancelSession()}>
                        <FontAwesomeIcon icon={faX} /> End and Delete Session
                      </button>
                      <button
                        onClick={() => {
                          navigate('/dashboard')
                        }}
                      >
                        <FontAwesomeIcon icon={faX} /> Save and Exit Session
                      </button>
                    </>
                  ) : (
                    <button onClick={() => navigate('/dashboard')}>
                      <FontAwesomeIcon icon={faX} /> End and Delete Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TaskTimer
