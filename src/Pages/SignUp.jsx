import React, { useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { UserName } from './Helper/Context';



// import "./SignUp.css";

const SignUp = () => {
  const {userName, setUserName} = useContext(UserName);
  /**
   * Added
   * create states to save input values
   */

  const navigate = useNavigate();
  let [userD, setUserD] = useState({
    userName: "",
    email: "",
    password: "",
    confPass: "",
  });
  /**
   * Added
   * check for Fields validation then
   * connect to Firebase and updat database with new users
   */
  function checkEmail(email) {
    if (email.includes("@") && email.includes(".com") || email === "") {
      return true;
    } else return false;
  }
  checkEmail(userD.email);

  function checkPassLength(password) {
    if ( password.length < 8 && password.length >= 1) {
      return false;
    } else return true;
  }
  console.log(checkPassLength(userD.password));

  function checkPassIdentical(password, confPass) {
    if (password === confPass) {
      return true;
    } else return false;
  }
  console.log(checkPassIdentical(userD.password, userD.confPass));


  const submitButton = async (e) => {
    e.preventDefault();
        firebase.initializeApp(firebaseConfig);
    const auth = getAuth();
    if (checkEmail(userD.email) && checkPassLength(userD.password) && checkPassIdentical(userD.password, userD.confPass)){
      createUserWithEmailAndPassword(auth, userD.email, userD.password)
    
      .then((userCredential) => {
        // User account created
        const user = firebase.auth().currentUser;
        user.updateProfile({
      displayName: userD.userName
      })
        const db = getDatabase();
        set(ref(db, `users/${user.uid}`), {
          email: user.email,
          password: userD.password,
          displayName: userD.userName
          // add more user data here if you want
        });
        // Do something with the user object
        navigate('/login');
        setUserName(userD.userName);
      })
      .catch((error) => {
        console.log(error.message);
        alert("Error, Please Try Again!");
      });
    }
    else alert('Please resolve errors before signing up!');
    
  };

  /**
   * Added by Lis
   */
  let name, value;
  const fieldsValues = (e) => {
    name = e.target.name; //take the name of current field
    value = e.target.value; //take the input value of current field

    setUserD({ ...userD, [name]: value }); // update the state with new input values
  };
  return (
    <div className="Background">
      <div className="MainCenterContainer">
        <>
          <div>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>

          <form className="form" method="POST">
            <div className="form-body">
              <div className="username">
                <label className="form__label" for="userName">
                   User Name
                </label><input
                  type="email"
                  name="userName"
                  id="email"
                  className="form__input" 
                  placeholder="User Name"
                  value={userD.userName}
                  onChange={fieldsValues}
                />
              </div>

              <div className="email">
                <label className="form__label" for="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`form__input ${checkEmail(userD.email) ? "" : 'mail-error'}`} 
                  placeholder="Email"
                  value={userD.email}
                  onChange={fieldsValues}
                />
                {
                  checkEmail(userD.email) ? "" : (<p style={{color: "#e34949", fontSize: "12px", marginBottom: 0, "margin-left": "77px"}}>Invalid Email!</p>)
                }
              </div>
              <div className="password">
                <label className="form__label" for="password">
                  Password{" "}
                </label>
                <input
                  className={`form__input ${checkPassLength(userD.password) ? "" : 'length-error'}`}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={userD.password}
                  onChange={fieldsValues}
                />
                {
                  checkPassLength(userD.password) ? "" : (<p style={{color: "#e34949", fontSize: "12px", marginBottom: 0, "margin-left": "205px"}}>Password length should be 8 or more</p>)
                }
              </div>
              <div className="confirm-password">
                <label className="form__label" for="confirmPassword">
                  Confirm Password{" "}
                </label>
                <input
                  className={`form__input ${checkPassIdentical(userD.password, userD.confPass) ? "" : 'identical-error'}`}
                  name="confPass"
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={userD.confPass}
                  onChange={fieldsValues}
                />
                {
                  checkPassIdentical(userD.password, userD.confPass) ? "" : (<p style={{color: "#e34949", fontSize: "12px", marginBottom: 0, "margin-left": "155px"}}>Passwords must match</p>)
                }
                
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
          </form>
        </>
      </div>
    </div>
  );
};

export default SignUp;
