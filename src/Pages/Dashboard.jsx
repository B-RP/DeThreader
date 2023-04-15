import React, { Component, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
const db = getDatabase(); //Initialize database

const fetchTasks = (userId, setIncompleteSession, setSessionLoaded) => {
  const tasksRef = ref(db, `sessions/${userId}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      let status = data.status
      setIncompleteSession(status === "Incomplete" ? data : null);
    }
    setSessionLoaded(true)
  });
};


const Dashboard = () => {
  let navigate = useNavigate();
  const storedUser = localStorage.getItem("user"); // get the stored logged in user from localstorage
  const initialUser = storedUser ? JSON.parse(storedUser) : "Guest"; // if the user is logged in set inigialUser to it
  const [user, setUser] = useState(initialUser); // set the state to be the initalUser or null if not available
  const [incompleteSessions, setIncompleteSession] = useState(null); // set the state to be the initalUser or null if not available
  const [sessionLoaded, setSessionLoaded] = useState(false); // set the state to be the initalUser or null if not available
  useEffect(() => {
    if (user) {
      fetchTasks(user.uid, setIncompleteSession, setSessionLoaded);
    }
  }, [user]);
  console.log('incompleteSessions,sessionLoaded,user', incompleteSessions,sessionLoaded,user)
  return (
    <>
      <div className="Background">
        <div className="MainCenterContainer">
          <div>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>
          <div className="messageContainer">
            {" "}
            <span className="white">Welcome, </span>{" "}
            <span className="green">{initialUser.displayName || 'Guest'}</span>
          </div>
          <div className="iconContainer">
            <button onClick={() => { }} className="iconButton">
              <FontAwesomeIcon icon={faGear} size={"2xl"} className="fa-Icon" />
            </button>
            {/* Added by Lis
             *conditionally render the button, show only if logged in
             */}
            {user!=="Guest" ? (
              <button onClick={() => { navigate("/stats") }} className="iconButton">
                <FontAwesomeIcon
                  icon={faUser}
                  size={"2xl"}
                  className="fa-Icon"
                />
              </button>
            ) : (
              ""
            )}

            <button onClick={() => { }} className="iconButton">
              <FontAwesomeIcon
                icon={faQuestion}
                size={"2xl"}
                className="fa-Icon"
              />
            </button>
            {(sessionLoaded|| user=="Guest") &&<>
              {!incompleteSessions ? <button
                onClick={() => {
                  navigate("/newsessiontasks");
                }}
                className="iconButton"
              >
                <FontAwesomeIcon icon={faPlus} size={"2xl"} className="fa-Icon" />
              </button>
                :
                <button onClick={() => {
                  navigate("/taskTimer")
                }} className="iconButton">
                  <FontAwesomeIcon icon={faPlay} size={"2xl"} className="fa-Icon" />
                </button>}
            </>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
