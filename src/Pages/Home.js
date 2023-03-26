import './Style.css';
import React, { Component }  from 'react';
import { useNavigate } from 'react-router-dom';

const TextButton = (props) => {
  return(
  <button onClick={props.action} className="textButton">{props.text}</button>
  )
}
const Home = () => {

  let navigate = useNavigate();

  return (
    <div className="Background">
      <div className="MainCenterContainer">
        <>
        <div><span className="titleDE">[DE]</span><span className="titleTHREADER">THREADER</span></div>

        <TextButton action={()=> {navigate("/SignUp")}} text={'Sign Up'} />
        <TextButton action={()=> {navigate("/LogIn")}} text={'Log In'} />
        <TextButton text={'Continue as Guest'} />
        <TextButton action={()=> {navigate("/about")}} text={'About Us'} />
        </>
      </div>
    </div>
  );
}


export default Home;