import React, { Component, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    let navigate = useNavigate();
  const storedUser = localStorage.getItem("user"); // get the stored logged in user from localstorage
  const initialUser = storedUser ? JSON.parse(storedUser) : "Guest"; // if the user is logged in set inigialUser to it
  const [user, setUser] = useState(initialUser); // set the state to be the initalUser or null if not available

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
            <button onClick={() => {}} className="iconButton">
              <FontAwesomeIcon icon={faGear} size={"2xl"} className="fa-Icon" />
            </button>
            {/* Added by Lis
             *conditionally render the button, show only if logged in
             */}
            { user ? (
              <button onClick={() => {}} className="iconButton">
                <FontAwesomeIcon
                  icon={faUser}
                  size={"2xl"}
                  className="fa-Icon"
                />
              </button>
            ) : (
              ""
            )}

            <button onClick={() => {}} className="iconButton">
              <FontAwesomeIcon
                icon={faQuestion}
                size={"2xl"}
                className="fa-Icon"
              />
            </button>

            <button
              onClick={() => {
                navigate("/newsessiontasks");
              }}
              className="iconButton"
            >
              <FontAwesomeIcon icon={faPlus} size={"2xl"} className="fa-Icon" />
            </button>

            <button onClick={() => {
              navigate("/taskTimer")
            }} className="iconButton">
              <FontAwesomeIcon icon={faPlay} size={"2xl"} className="fa-Icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
