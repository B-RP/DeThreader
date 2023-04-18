import React, { Component, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import "./Dashboard.css";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
const db = getDatabase(); //Initialize database
const storage = getStorage();

const fetchTasks = (userId, setIncompleteSession, setSessionLoaded) => {
  const tasksRef = ref(db, `sessions/${userId}`);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      let status = data.status
      setIncompleteSession(status === "Incomplete" ? data : null);
    }
    setSessionLoaded(true)
  });
};


const Dashboard = () => {
  let navigate = useNavigate();
  const storedUser = localStorage.getItem("user"); // get the stored logged in user from localstorage
  const initialUser = storedUser ? JSON.parse(storedUser) : "Guest"; // if the user is logged in set inigialUser to it
  const [user, setUser] = useState(initialUser); // set the state to be the initalUser or null if not available
  const [incompleteSessions, setIncompleteSession] = useState(null); // set the state to be the initalUser or null if not available
  const [sessionLoaded, setSessionLoaded] = useState(false); // set the state to be the initalUser or null if not available
  const [file, setFile] = useState("");

  useEffect(() => {
    if (user) {
      fetchTasks(user.uid, setIncompleteSession, setSessionLoaded);
    }
  }, [user]);
  console.log('incompleteSessions,sessionLoaded,user', incompleteSessions, sessionLoaded, user)

  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!")
    }

    const storageRef = sRef(storage, `/profile-images/${user.uid}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // update progress
        console.log(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          const tasksRef = ref(db, `profile/${user.uid}`);
          set(tasksRef, { url })
            .then(() => {
              alert("Photo uploaded successfully!")
            })
            .catch((error) => {
              alert("An Error Occured, Please Try Again!")
            });
        });
      }
    );
  }

  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  return (
    <>
      <div className="Background">
        <div className="MainCenterContainer">
          <div>
            <span className="titleDE">[DE]</span>
            <span className="titleTHREADER">THREADER</span>
          </div>
          <div className="messageContainer">
            {" "}
            <span className="white">Welcome, </span>{" "}
            <span className="green">{initialUser.displayName || 'Guest'}</span>
          </div>
          <div className="iconContainer">
            <button onClick={() => {
              if (user && user.uid) {
                window.location.href = "#popup1"
              }
            }} className="iconButton">
              <FontAwesomeIcon icon={faGear} size={"2xl"} className="fa-Icon" />
            </button>
            <div id="popup1" class="overlay">
              <div class="custom-popup">
                <h2>Update profile image</h2>
                <a class="close" href="#">&times;</a>
                <div class="content">
                  <input type="file" accept="image/*" onChange={handleChange} />
                  <div>
                    <button onClick={() => handleUpload()}>Upload</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Added by Lis
             *conditionally render the button, show only if logged in
             */}
            {user !== "Guest" ? (
              <button onClick={() => { navigate("/stats") }} className="iconButton">
                <FontAwesomeIcon
                  icon={faUser}
                  size={"2xl"}
                  className="fa-Icon"
                />
              </button>
            ) : (
              ""
            )}

            <button onClick={() => { navigate("/about"); }} className="iconButton">
              <FontAwesomeIcon
                icon={faQuestion}
                size={"2xl"}
                className="fa-Icon"
              />
            </button>
            {(sessionLoaded || user == "Guest") && <>
              {!incompleteSessions ? <button
                onClick={() => {
                  navigate("/newsessiontasks");
                }}
                className="iconButton"
              >
                <FontAwesomeIcon icon={faPlus} size={"2xl"} className="fa-Icon" />
              </button>
                :
                <button onClick={() => {
                  navigate("/taskTimer")
                }} className="iconButton">
                  <FontAwesomeIcon icon={faPlay} size={"2xl"} className="fa-Icon" />
                </button>}
            </>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
