import React, { Component }  from 'react';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


const TaskDT = (props) =>
{
    const addTask = () =>
    {
        //show input box, show addSubtask and addTask under it, toggle button to delete task
    }

    return(
        <>
        <span className="task">
            <button onClick={""} className="iconButton">
                <FontAwesomeIcon icon={faPlus} style={{color: "#ffffff",}} size={"lg"} />
            </button>
                <input className="taskInput" placeholder='new task'/>
        </span>
        </>
    )
}

const NewSessionTasks = () => {
    return (
        <>

        <div className="Background">
            <div className="MainCenterContainer">
                <div><span className="titleDE">[DE]</span><span className="titleTHREADER">THREADER</span></div>
                <p>Take your big task apart, thread by thread</p>

                <div className="createTasksContainer">
                    <TaskDT />
                </div>
   
            </div>
        </div>
        </>
    );
  }
  
  export default NewSessionTasks;