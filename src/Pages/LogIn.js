import React, { useState } from "react";
const LogIn = () => {
  // States for user inputs
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  //
  
  // Validation states
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  //

  const [showEmailMessage, setShowEmailMessage] = useState(false);
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);

  // Constants for error messages
  const EMAILERRORMESSGAE = "Email must contain @ and .com";
  const PasswordERRORMESSGAE = "Password must be atleast 8 digits";

  // Function for submiting button and validation
  const submitButton = () => {
    if (userEmail === "") {
      setShowEmailError(true);
    } else if (userPassword === "") {
      setShowPasswordError(true);
    }
      else if (!validateEmail(userEmail)) {
        // setShowEmailError(true);
        setShowEmailMessage(true);
      } 
      else if (userPassword.length < 8) {
        setShowPasswordMessage(true);
      }
     else if (validateEmail(userEmail)) {
        setShowEmailError(false);
        setShowEmailMessage(false);
      } 
      else {
       
        setShowPasswordError(false);
        setShowPasswordMessage(false);

        /* LOGIN DATABASE GOES HERE */
      }
  };

  // Validation for email
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
              <div className="email">
                <label className="form__label" for="email">
                  Email{" "}
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form__input ${
                    showEmailError ? "Show_Error" : ""
                  }`}
                  placeholder="Email"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                {/* Error field for Email message */}
                {showEmailMessage && (
                  <div className="Show_Email_Erro">{EMAILERRORMESSGAE}</div>
                )}
              </div>
              <div className="password">
                <label className="form__label" for="password">
                  Password{" "}
                </label>
                <input
                  className={`form__input ${
                    showPasswordError ? "Show_Error" : ""
                  }`}
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setUserPassword(e.target.value)}
                />

                {/* Error field for password message */}
                {showPasswordMessage && (
                  <div className="Show_Email_Erro">{PasswordERRORMESSGAE}</div>
                )}
              </div>
            </div>
            <div class="footer">
              <button
                type="submit"
                className="textButton"
                onClick={submitButton}
              >
                Log In
              </button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default LogIn;
