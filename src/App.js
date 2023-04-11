import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserName } from "./Pages/Helper/Context";
import { LoggedIn } from "./Pages/Helper/Context";
import Home from "./Pages/Home.jsx";
import SignUp from "./Pages/SignUp.jsx";
import LogIn from "./Pages/LogIn.jsx";
import About from "./Pages/About.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import NewSessionTasks from "./Pages/NewSessionTasks.jsx";
import app from "./firebase";
import { getAuth } from "firebase/auth";
import SetTimer from "./Pages/setTimer";
import TaskTimer from "./Pages/taskTimer";
import { update } from "firebase/database";
// import { Auth } from "firebase/auth";

const auth = getAuth(app);

const Border = (props) => {
  return (
    <div className="LogoBorderBackground">
      <div> </div>
    </div>
  );
};

const App = () => {
  document.title = "[De]Threader";
  const [user, setUser] = useState(null);
  const [workCountdownTime, setWorkCountdownTime] = useState(120); // 25 minutes in seconds
  const [restCountdownTime, setRestCountdownTime] = useState(300); // 5 minutes in seconds
  const [longRestCountdownTime, setLongRestCountdownTime] = useState(1200); // 20 minutes in seconds
  const [sessions, setSessions] = useState(4);

  // this funciton is defined here and passed down to setTimer.jsx
  const updateTimers = (work, rest, longRest, numSessions) => {
    setWorkCountdownTime(work);
    setRestCountdownTime(rest);
    setLongRestCountdownTime(longRest);
    setSessions(numSessions);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);
  // Added By Lis
  const [userName, setUserName] = useState(null); //create state to pass through context
  const [isLoggedIn, setIsLoggedIn] = useState(false); //create state to pass through context
  return (
    // the Way of using context (added by Lis)
    <UserName.Provider value={{ userName, setUserName }}>
      <LoggedIn.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <Router>
          <Border />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/newsessiontasks" element={<NewSessionTasks user={user} />} />
            <Route path="/play-session" element={<SetTimer user={user} updateTimers={updateTimers} />} />
            <Route
  path="/taskTimer"
  element={<TaskTimer
    workCountdownTime={workCountdownTime}
    restCountdownTime={restCountdownTime}
    longRestCountdownTime={longRestCountdownTime}
    sessions={sessions}
  />}
/>
          </Routes>
        </Router>
      </LoggedIn.Provider>
    </UserName.Provider>
  );
};

export default App;
