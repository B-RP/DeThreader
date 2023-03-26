import React, { useState } from "react";
import "./SignUp.css";

const SignUp = () => {
  // User value states
  const [userName, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // User value states

  // Error states for checking error
  const [showError, setShowError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [showConfirmdMessage, setShowConfrimMessage] = useState(false);
  const [showNotSameMessage, setShowNotSameMessage] = useState(false);
  const EMAILERRORMESSGAE = "Email must contain @ and .com";
  const PasswordERRORMESSGAE = "Password must be at least 8 digits";
  const NotSameERRORMESSGAE = "Passwords do not match";
  // Error states for checking error

  // Function for submiting button and validation
  const submitButton = () => {
    
    if (userName === "") {
      setShowError(true); // For highlight name field if empty
    } else if (userEmail === "") {
      setShowEmailError(true);// For highlight email field if empty
    } else if (userPassword === "" || userPassword.length < 8) {
      setShowPasswordMessage(true); // For highlight password field if empty
    } else if (confirmPassword === "" || confirmPassword.length < 8) {
      setShowConfrimMessage(true) // For highlight confirm password field if empty
    }
     else if (!validateEmail(userEmail)) { // For checking email must
        // setShowEmailError(true);
        setShowEmailMessage(true);
      } 
        // WHEN ALL CONDITIONS ARE FULFILLED //
  
      else {
            if (validateEmail(userEmail)) { // Hiding the email message if validate email
          setShowEmailMessage(false);
        } 
       
       if (userPassword !== confirmPassword) { // For matching both password and confirm passwords are same 
        // console.log('called');
        setShowNotSameMessage(true);
      }
      if (userPassword == confirmPassword) { // For matching both password and confirm passwords are same 
        // console.log('called');
        setShowNotSameMessage(false);
      }
      // ALL VALIDATION IS DONE HERE //

      else{ 
        
      // DATABASE // sign up database logic here

      }
       
      }
    // }
  };

  // Validation code for email
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  return (
    <div className="Background">
      <div className="MainCenterContainer">
        <>
          <div>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>

          <div className="form">
            <div className="form-body">
              <div className="username">
                  <label className="form__label" for="firstName">First Name </label>
                  <input className="form__input" type="text" id="firstName" placeholder="First Name"/>
              </div>

              <div className="email">
                  <label className="form__label" for="email">Email </label>
                  <input  type="email" id="email" className="form__input" placeholder="Email"/>
              </div>
              <div className="password">
                  <label className="form__label" for="password">Password </label>
                  <input className="form__input" type="password"  id="password" placeholder="Password"/>
              </div>
              <div className="confirm-password">
                  <label className="form__label" for="confirmPassword">Confirm Password </label>
                  <input className="form__input" type="password" id="confirmPassword" placeholder="Confirm Password"/>
              </div>
            </div>
            <div class="footer">
              <button
                type="submit"
                className="textButton"
                onClick={submitButton}
              >
                Sign Up
              </button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default SignUp;
