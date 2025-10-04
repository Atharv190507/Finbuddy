import React, { useState } from "react";
import "./quiz.css";

const quizData = [
  {
    question: "What is a budget?",
    options: ["Plan for money", "Credit card", "Bank loan"],
    answer: "Plan for money",
    explanation: "A budget helps you plan income and expenses to manage money better."
  },
  {
    question: "What should you do before investing?",
    options: [
      "Take random advice",
      "Check your risk and goals",
      "Invest in trending stocks"
    ],
    answer: "Check your risk and goals",
    explanation: "Understanding your risk and goals helps you choose the right investment."
  },
  {
    question: "What is an emergency fund?",
    options: [
      "Money for shopping",
      "Savings for unexpected expenses",
      "Credit card balance"
    ],
    answer: "Savings for unexpected expenses",
    explanation: "Emergency funds cover medical, job loss, or urgent expenses."
  },
  {
    question: "Which is a good savings habit?",
    options: [
      "Spend first, save later",
      "Save at least 20% of income",
      "Borrow to spend more"
    ],
    answer: "Save at least 20% of income",
    explanation: "Following the 50-30-20 rule (needs-wants-savings) is a good practice."
  },
  {
    question: "What is diversification?",
    options: [
      "Putting all money in one stock",
      "Spreading investments across assets",
      "Keeping money only in cash"
    ],
    answer: "Spreading investments across assets",
    explanation: "Diversification reduces risk by spreading money in different types of assets."
  }
];

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (option) => {
    setSelected(option);
    setShowAnswer(true);
    if (option === quizData[current].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setSelected("");
    if (current < quizData.length - 1) {
      setCurrent(current + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setSelected("");
  };

  if (isFinished) {
    const percentage = Math.round((score / quizData.length) * 100);
    let message = "Keep practicing! 📘";
    if (percentage === 100) message = "🔥 Perfect score! You're a finance pro!";
    else if (percentage >= 70) message = "💡 Great job! You're on the right track.";
    else if (percentage >= 50) message = "👌 Decent! A little more effort will make you great.";

    return (
      <div className="quiz-card results">
        <h2>🎉 Quiz Completed!</h2>
        <p>Your Score: <b>{score}</b> / {quizData.length}</p>
        <p>Accuracy: <b>{percentage}%</b></p>
        <p className="result-message">{message}</p>
        <button className="next-btn" onClick={restartQuiz}>
          🔄 Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <h4>
          Question {current + 1}/{quizData.length}
        </h4>
        <h4>Score: {score}</h4>
      </div>

      <h2 className="quiz-question">{quizData[current].question}</h2>
      <div className="quiz-options">
        {quizData[current].options.map((opt, i) => (
          <button
            key={i}
            className="quiz-btn"
            onClick={() => handleAnswer(opt)}
            disabled={showAnswer}
          >
            {opt}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div className="quiz-feedback">
          {selected === quizData[current].answer ? (
            <p className="correct">✅ Correct! {quizData[current].explanation}</p>
          ) : (
            <p className="wrong">
              ❌ Wrong! You chose <b>{selected}</b>. <br />
              Correct answer: <b>{quizData[current].answer}</b> <br />
              {quizData[current].explanation}
            </p>
          )}
          <button className="next-btn" onClick={nextQuestion}>
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
