import React, { useState, useContext } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { UserName } from './Helper/Context';
import { LoggedIn } from './Helper/Context';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";

const TextButton = (props) => {
  return(
  <button 
    onClick={props.action} 
    className="textButton">
    {props.text}
  
  </button>
  )
}

const LogIn = (props) => {
  const {isLoggedIn, setIsLoggedIn} = useContext(LoggedIn); // determine if the user is logged in or not
  const {userName, setUserName} = useContext(UserName);
  const navigate = useNavigate();

 /**
   * Added
   * save the input vals in state object to use it in authentication
 */
let [userData, setUserData] = useState({
    "email": "",
    "password": ""
  });
let name, val;
const fieldHandler = (e) => {
    name = e.target.name;
    val = e.target.value;

    setUserData({...userData, [name]:val});
  }
  /**
   * Added
   * Authentication process, 
   * copy this code from firebase at:
   * https://console.firebase.google.com/u/1/project/threader-app-8163c/settings/general/web:M2JjMGUwYTktYjA3YS00YmRiLWI1OTUtMDFiOGEwNjIwOWUx
   */
  // Initialize Firebase

  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredential) => {
        // User signed in
        const user = userCredential.user;
        props.setUser(user);
        // Do something with the user object
        console.log({user});
        // alert('success login!');
        localStorage.setItem('user', JSON.stringify(user));
        if (user.displayName) {
          setUserName(user.displayName);
        } else {
          setUserName('Guest');
        }
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log(error.message);
        alert("error");
      });
  }
  return (
    <div className="Background">
      <div className="MainCenterContainer">
        <>
          <div onClick={() => { navigate("/"); }} style={{cursor: "pointer"}}>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>

          <form className="form" method="GET" style={{position: "relative"}}>
            <div className="form-body">
              <div className="email">
                {/*}
                <label className="form__label" for="email">
                  Email{" "}
                </label>
  */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form__input`}
                  placeholder="Email"
                  value={userData.email}
                  onChange={fieldHandler}
                />
                {/* Error field for Email message */}
                
              </div>
              <div className="password">
                {/*
                <label className="form__label" for="password">
                  Password{" "}
                </label>
                */}
                <input
                  className={`form__input`}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={fieldHandler}
                />

                {/* Error field for password message */}
                
              </div>
            </div>
            <div class="footer">
              <button
                type="submit"
                className="textButton"
                onClick={submitHandler}
                style={{display: "inline-block"}}
              >
                Log In
              </button>
              
            </div>
          {/*
          <TextButton action={()=> {
          const provider = new GoogleAuthProvider();
          //Just grab this code from Firebase documentation
          const auth = getAuth();
          signInWithPopup(auth, provider)
            .then((result) => {
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;
              // IdP data available using getAdditionalUserInfo(result)
              setUserName(user.displayName);
              localStorage.setItem('user', JSON.stringify(user));
              setIsLoggedIn(true);
              const db = getDatabase();
              set(ref(db, `users/${user.uid}`), {
                email: user.email,
                name: user.displayName,
                from: 'Google'
                // add more user data here if you want
              });
              navigate("/dashboard");
            }).catch((error) => {
              // Handle Errors here.
              const errorCode = error.code;
              const credential = GoogleAuthProvider.credentialFromError(error);
              setIsLoggedIn(false);
            });
        }} text={'Log In with Google'} />
      */}
        </form>


        </>
      </div>
    </div>
  );
};

export default LogIn;
