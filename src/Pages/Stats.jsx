import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { getDatabase, ref, onValue } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
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

function convertToMins(s){   // accepts seconds as Number or String. Returns m:ss
  return( s -         // take value s and subtract (will try to convert String to Number)
          ( s %= 60 ) // the new value of s, now holding the remainder of s divided by 60 
                      // (will also try to convert String to Number)
        ) / 60 + (    // and divide the resulting Number by 60 
                      // (can never result in a fractional value = no need for rounding)
                      // to which we concatenate a String (converts the Number to String)
                      // who's reference is chosen by the conditional operator:
          9 < s       // if    seconds is larger than 9
          ? ':'       // then  we don't need to prepend a zero
          : ':0'      // else  we do need to prepend a zero
        ) + s ;       // and we add Number s to the string (converting it to String as well)
}

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
        <div className="MainCenterContainer">

        <div>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>
          <br></br>

          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="statsLeft">Total work cycles</span>
            <span className="statsRight">{statsCycles}</span>
          </div>
          

          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="statsLeft">Total work time  </span>
            <span className="statsRight">{convertToMins(statsWork)}</span>
          </div>

          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span className="statsLeft">Total rest time</span>
            <span className="statsRight">{convertToMins(statsRest)}</span>
          </div>
          <div className="iconContainer" style={{justifyContent:"center"}}>
            {user ? (
              <button onClick={() => { navigate("/dashboard") }} className="iconButton">
                <FontAwesomeIcon
                  icon={faX}
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
