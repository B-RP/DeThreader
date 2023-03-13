import './Home.css';

const TextButton = (props) => {
  return(
  <button onClick={props.action} className="textButton">{props.text}</button>
  )
}
const Home = () => {
  return (
    <div className="Background">
      <div className="MainCenterContainer">
        <>
        <div><span className="titleDE">[DE]</span><span className="titleTHREADER">THREADER</span></div>

        <TextButton text={'Sign Up'} />
        <TextButton text={'Log In'} />
        <TextButton text={'Continue as Guest'} />
        <TextButton text={'About Us'} />
        </>
      </div>
    </div>
  );
}

export default Home;