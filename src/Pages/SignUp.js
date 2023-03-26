import React, { Component }  from 'react';
import './Style.css';

const SignUp = () => {
    return (
      <div className="Background">
      <div className="MainCenterContainer">
        <>
        <div><span className="titleDE">[DE]</span><span className="titleTHREADER">THREADER</span></div>

        <div className="form">
          <div className="form-body">
              <div className="username">
                  <input className="form__input" type="text" id="firstName" placeholder="First Name"/>
              </div>
              <div className="email">
                  <input  type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <input className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>
              <div className="confirm-password">
                  <input className="form__input" type="password" id="confirmPassword" placeholder="Confirm Password"/>
              </div>
          </div>
          <div class="footer">
              <button type="submit" className="textButton">Sign Up</button>
          </div>
      </div>    
        </>
      </div>
    </div>
    );
  }
  
  export default SignUp;