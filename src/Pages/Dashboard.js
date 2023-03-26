import React, { Component }  from 'react';
import { useNavigate } from 'react-router-dom';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'


const Dashboard = () => {
    let navigate = useNavigate();
    return (
        <>
        <div className="Background">
            <div className="MainCenterContainer">
                <div><span className="titleDE">[DE]</span><span className="titleTHREADER">THREADER</span></div>
                <div className="messageContainer"> <span className ="white">Welcome, </span> <span className="green">User</span></div>
                <div className="iconContainer">
                <button onClick={()=> {}} className="iconButton">
                    <FontAwesomeIcon icon={faGear} size={"2xl"} className="fa-Icon"/>
                </button>

                <button onClick={()=> {}} className="iconButton">
                    <FontAwesomeIcon icon={faUser} size={"2xl"} className="fa-Icon"/>
                </button>

                <button onClick={()=> {}} className="iconButton">
                    <FontAwesomeIcon icon={faQuestion} size={"2xl"} className="fa-Icon"/>
                </button>

                <button onClick={()=> {navigate("/newsessiontasks")}} className="iconButton">
                    <FontAwesomeIcon icon={faPlus} size={"2xl"} className="fa-Icon"/>
                </button>

                <button onClick={()=> {}} className="iconButton">
                    <FontAwesomeIcon icon={faPlay} size={"2xl"} className="fa-Icon"/>
                </button>
                </div>
   
            </div>
        </div>
        </>
    );
  }
  
  export default Dashboard;