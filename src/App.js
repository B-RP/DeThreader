import React, { Component }  from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Home from "./Pages/Home"
import SignUp from "./Pages/SignUp"
import LogIn from "./Pages/LogIn"
import About from "./Pages/About"
import Dashboard from "./Pages/Dashboard"
import NewSessionTasks from './Pages/NewSessionTasks';

const Border = (props) => {
  return(
    <div className="LogoBorderBackground">
      <div > </div>
    </div>
  )
}

const App = () => {
  document.title = "[De]Threader";
  return (
    <Router>
     <Border />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/login" element={<LogIn />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/newsessiontasks" element={<NewSessionTasks />}/>
      </Routes>
    </Router>
  );
}

export default App;