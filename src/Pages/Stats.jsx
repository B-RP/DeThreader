import React, { Component, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
const db = getDatabase(); //Initialize database

const fetchAnalytics = (userId, setStatsCycles, setStatsWork, setStatsRest) => {
  const tasksRef = ref(db, `stats/${userId}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
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

const Stats = () => {
  let navigate = useNavigate();
  const storedUser = localStorage.getItem("user"); // get the stored logged in user from localstorage
  const initialUser = storedUser ? JSON.parse(storedUser) : "Guest"; // if the user is logged in set inigialUser to it
  const [user, setUser] = useState(initialUser); // set the state to be the initalUser or null if not available
  const [statsCycles, setStatsCycles] = useState(null);
  const [statsWork, setStatsWork] = useState(null);
  const [statsRest, setStatsRest] = useState(null);
  useEffect(() => {
    if (user) {
      fetchAnalytics(user.uid, setStatsCycles, setStatsWork, setStatsRest)
    }
  }, [user]);
  return (
    <>
      <div className="Background">
        <div className="MainCenterContainer" style={{padding:"1% 5%",width:"30%"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="titleDE">Total work cycles</span>
            <span className="titleTHREADER">{statsCycles}</span>
          </div>

          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="titleDE">Total work time</span>
            <span className="titleTHREADER">{statsWork}</span>
          </div>

          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="titleDE">Total rest time</span>
            <span className="titleTHREADER">{statsRest}</span>
          </div>
          <div className="iconContainer" style={{justifyContent:"center"}}>
            {user ? (
              <button onClick={() => { navigate("/dashboard") }} className="iconButton">
                <FontAwesomeIcon
                  icon={faUser}
                  size={"2xl"}
                  className="fa-Icon"
                />
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
