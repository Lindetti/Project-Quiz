import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import "./results.css";
import { QuizContext } from "./context";
import Confetti from "react-confetti";

function Results(props) {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const confetiRef = useRef(null);

  useEffect(() => {
    setHeight(confetiRef.current.clientHeight);
    setWidth(confetiRef.current.clientWidth);
  }, []);

  const {
    data,
    setGameStart,
    difficulty,
    NO_OF_HIGH_SCORES,
    HIGH_SCORES,
    nickName,
  } = useContext(QuizContext);

  //Calculating Scores
  let multiplier;
  if (difficulty === "easy") {
    multiplier = 1;
  } else if (difficulty === "medium") {
    multiplier = 2;
  } else if (difficulty === "hard") {
    multiplier = 3;
  }
  const score = multiplier * props.correctAnswer;

  function checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    if (score > lowestScore) {
      saveHighScore(score, highScores);
    }
  }

  function saveHighScore(score, highScores) {
    const name = nickName ? nickName : "Anonymous";
    const newScore = { score, name };

    highScores.push(newScore); // 1. Add to list
    highScores.sort((a, b) => b.score - a.score); // 2. Sort the list
    highScores.splice(NO_OF_HIGH_SCORES); // 3. Select new list
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores)); // 4. Save to local storage
  }

  useEffect(() => {
    setGameStart(false);
    checkHighScore(score);
  }, []);

  const results = data.map((item, index) => {
    const indexCorrectAnswer = props.possibleAnswers[index].findIndex(
      (el) => el === item.correctAnswer
    );
    return (
      <div className="resultsQuestion" key={index}>
        <div className="wrongOrRightDiv">
          <h2>
            {props.userAnswers[index] === item.correctAnswer
              ? "Correct answer"
              : "Wrong answer"}
          </h2>
        </div>
        <div className="resultQuestionsDiv">
          <h4>
            Question {index + 1}: {item.question}
          </h4>
        </div>

        <div className="resultsAnswer">
          {props.possibleAnswers[index].map((answer, indexAnsw) => {
            return (
              <p
                className={
                  indexAnsw === indexCorrectAnswer
                    ? "correctAnswerColor"
                    : "incorrectAnswerColor"
                }
                key={answer}
              >
                {answer}
              </p>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <div className="results-wrapper" ref={confetiRef}>
      <Confetti numberOfPieces={150} width={width} height={height} />
      <div className="resultsInfo">
        <h1>Results</h1>
        <h2>
          You had {props.correctAnswer} correct out of {props.amountOfAnswers}!
        </h2>
      </div>
      <div className="resultsScrollBox">{results}</div>
      <div className="playAgainDiv">
        <Link to="/" className="playAgainBtn">
          Play again
        </Link>
      </div>
    </div>
  );
}

export default Results;
