import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./setTimer.css";
import { useNavigate } from "react-router-dom";
import { GuestSession, Sessions } from "./Helper/Context";

const db = getDatabase(); //Initialize database

// Fetch the tasks associated with logged in user from database
// Define a function that fetches tasks from the database and updates the state
const fetchTasks = (userId, setFields) => {
  const tasksRef = ref(db, `sessions/${userId}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      let fields = [];
      fields = data.tasks
      setFields(fields);
    }
  });
};

function SetTimer(props) {
  // Set A different state for different counters eg. wor, rest, log rest, sessions
  const {guestSession, setGuestSession} = useContext(GuestSession);
  const [workCountdownTime, setWorkCountdownTime] = useState(60); // 25 minutes in seconds
  const [restCountdownTime, setrestCountdownTime] = useState(60); // 5 minutes in seconds
  const [longRestCountdownTime, setlongRestkCountdownTime] = useState(60); // 20 minutes in seconds
  const [sessions, setSessions] = useState(1);
  const [fields, setFields] = useState([]);
  const navigate = useNavigate(); // to be able to navigate to other screen
  const user = props.user;
  // const { sessionsLength } = useContext(Sessions);

  useEffect(() => {
    if (user) {
      fetchTasks(user.uid, setFields);
    }else{
      setFields(guestSession&&guestSession.tasks?guestSession.tasks:[])
    }
  }, [user]);
  // the coming functions take 2 parameteres, counters and their setters, and change the timesers' value on clicking
  // this is better that making separate functions for each timer
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
    if (sessions + 1 <= fields.length) {
      setSessions(sessions + 1);
    } else alert("number of sessions can't exceed the number of tasks!");
  };

  const decreaseSessions = () => {
    if (sessions >= 1) {
      setSessions(sessions - 1);
    }
  };


  // on Clicking on next button, this function will call an other function from App.js, It will update the timer's starting value then navigate the next page whhere the timer start to work on page load, a start on button will be implemented later
  const handleNextButtonClick = () => {
    props.updateTimers(workCountdownTime, restCountdownTime, longRestCountdownTime, sessions);
    saveTasksData()
    sessions !== 0 ? console.log("updated") : alert("number of Long Breaks can't be 0!");
  };

  console.log(workCountdownTime, restCountdownTime, longRestCountdownTime, sessions, fields)

  const saveTasksData = () => {

    const newTasks = {
      tasks: fields,
      status: "Incomplete",
      workTime: workCountdownTime,
      restTime: restCountdownTime,
      longRestTime: longRestCountdownTime,
      workSessionPerCycle: sessions,
    };
    // Check if the user is logged in and has a UID
    if (user && user.uid) {

      // Get a reference to the `tasks` table in the database for the current user
      const tasksRef = ref(db, `sessions/${user.uid}`);

      // Create a new object to store the updated task data

      // Update the `tasks` table in the database with the new task data using the `set` function from the Firebase SDK
      set(tasksRef, newTasks)
        .then(() => {
          // Navigate to a new page
          console.log(tasksRef)
          navigate("/taskTimer");
          // alert("Data Added Successfuly")
        })
        .catch((error) => {
          // Display an error message if the update fails
          alert("An Error Occured, Please Try Again!")
        });
    }else{
      setGuestSession(newTasks)
      navigate("/taskTimer");
    }
  };

  return (
    <>
      {/* 
      <div className="headd">
        <p style={{ color: "rgb(186, 186, 247);" }}><span style={{ color: "#ffffff" }}>DE</span>THREADER</p>
      </div>
      */}
      <div className="Background">
      <div className="MainCenterContainer">
      <div>
          <span className="titleDE">[DE]</span>
          <span className="titleTHREADER">THREADER</span>
        </div>
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
      </div>
      <div className="buttonContainer">

        {/*
        < div className="buttonContainer-child">
            <button className="textButton" onClick={() => navigate(-1)}>
                Cancel
            </button>
        </div>
              */}
      
          <div className="buttonContainer-child">
            <button className="textButton" onClick={saveTasksData}>
              Next
            </button>
          </div>


          </div>
      </div>
      </div>
      {/* .timer-container */}
    </>
  );
}

export default SetTimer;
