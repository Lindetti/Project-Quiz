import { useContext, useEffect, useState } from "react";
import Results from "./results";
import "./quizgame.css";
import { QuizContext } from "./context";
import { Link } from "react-router-dom";
import ProgressBar from "./progressbar";
import { useTimer } from "../Hooks/usetimer";

function QuizGame() {
  const [count, setCount] = useState(0);
  const [answers, setAnswers] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState(null);
  const [progress, setProgress] = useState(100); // for progress bar
  const [stopProgress, setStopProgress] = useState(false); // for progress bar
  const [isDeactive, setIsDeactive] = useState(false);

  const { pause, reset, running, seconds, start, stop } = useTimer({
    initialSeconds: 0,
    initiallyRunning: true,
  });
  const { data, gameStart, setGameStart } = useContext(QuizContext);

  let indexCorrectAnswer;
  //for progress bar
  useEffect(() => {
    if (!stopProgress) {
      setProgress((oldProgress) => {
        if (oldProgress === 0) {
          setIsDeactive(true);
          pause();
          setUserAnswers([...userAnswers, "No answer"]);
          setTimeout(() => {
            start();
            setCount(count + 1);
            setIsDeactive(false);
          }, 3000);
          return 100;
        }
        return Math.max(oldProgress - 1, 0);
      });
    } else {
      stop();
    }
  }, [seconds]);

  const clickHandler = (event) => {
    const buttonId = document.getElementById(event.target.id);
    if (data[count].correctAnswer === event.target.innerHTML) {
      setUserAnswers([...userAnswers, event.target.innerHTML]);
      setCorrect(correct + 1);
      buttonId.style.backgroundColor = "green";
    } else if (data[count].correctAnswer !== event.target.innerHTML) {
      buttonId.style.backgroundColor = "red";
    }
    setUserAnswers([...userAnswers, event.target.innerHTML]);

    pause();
    setTimeout(() => {
      setCount(count + 1);
      setProgress(100);
      start();
      buttonId.style.backgroundColor = "white";
    }, 3000);
  };

  useEffect(() => {
    if (count === 10) {
      setStopProgress(true);
    }
  }, [count]);

  useEffect(() => {
    if (data[count] && count < 10) {
      const answersArray = [
        ...data[count].incorrectAnswers,
        data[count].correctAnswer,
      ];
      answersArray.sort(() => Math.random() - 0.5);
      indexCorrectAnswer = answersArray.findIndex(
        (el) => el === data[count].correctAnswer
      );
      const answersButton = answersArray.map((answer, index) => {
        return (
          <button
            className="answerBtn"
            onClick={(e) => clickHandler(e)}
            key={index}
            id={index}
            disabled={isDeactive}
          >
            {answer}
          </button>
        );
      });
      if (allAnswers != null) {
        setAllAnswers((prev) => [...prev, answersArray]);
      } else {
        setAllAnswers([answersArray]);
      }
      setAnswers(answersButton);
    }
  }, [count, data, isDeactive]);

  if (!stopProgress && count >= 0 && count < 10) {
    return (
      <div className="question-wrapper">
        <div className="main-questions">
          <div className="topperContainer">
            <div className="currentQuestion">
              <h3>{count + 1}/10</h3>
            </div>
            <div className="imageDiv">
              <p>{data[count].category}</p>
            </div>
          </div>

          {data[count] ? (
            <>
              <div className="questionAndProgress">
                <div className="question">
                  <h3>{data[count].question}</h3>
                </div>
                <div>
                  <ProgressBar completed={progress}></ProgressBar>
                </div>
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
          <div className="answersdiv">{answers}</div>
          <div className="cancel">
            <Link to="/" className="cancelBtn">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    );
  } else if (stopProgress) {
    return (
      <>
        <div className="resultsContainer">
          <Results
            userAnswers={userAnswers}
            possibleAnswers={allAnswers}
            correctAnswer={correct}
            amountOfAnswers={data.length}
            fetchedData={data}
          />
        </div>
      </>
    );
  }
}

export default QuizGame;
