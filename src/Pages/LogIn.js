import React, { Component }  from 'react';
const LogIn = () => {
    return (
      <div className="Background">
      <div className="MainCenterContainer">
        <>
        <div><span className="titleDE">[DE]</span><span className="titleTHREADER">THREADER</span></div>

        <div className="form">
          <div className="form-body">
              <div className="email">
                  <input  type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <input className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>

          </div>
          <div class="footer">
              <button type="submit" className="textButton">Log In</button>
          </div>
      </div>    
        </>
      </div>
    </div>
    );
  }
  
  export default LogIn;