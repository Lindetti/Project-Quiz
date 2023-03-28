import { Link } from "react-router-dom";
import "./start.css";

function Start() {
  return (
    <div className="start-wrapper">
      <h1>The Quiz Game</h1>
      <div className="main">
        <div className="start">
          <input type="text" placeholder="Enter your nickname.." />
          <Link to="/categories">FREE PLAY</Link>
          <a href="#">DAILY CHALLENGE</a>
        </div>
        <div className="highscore">
          <p>Highscore</p>
        </div>
      </div>
    </div>
  );
}

export default Start;
