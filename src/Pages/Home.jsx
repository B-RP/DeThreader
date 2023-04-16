import './Style.css';
import React from 'react';
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

        <TextButton action={()=> {
          navigate("/SignUp")
          localStorage.clear()
          }} text={'Sign Up'} />
        <TextButton action={()=> {
          navigate("/LogIn")
          localStorage.clear()
          }} text={'Log In'} />
        <TextButton action={()=> {
          navigate("/dashboard")
          localStorage.clear()
          }} text={'Continue as Guest'} />
        <TextButton action={()=> {navigate("/about")}} text={'About Us'} />
        {/* Added */}
        
        </>
      </div>
    </div>
  );
}


export default Home;