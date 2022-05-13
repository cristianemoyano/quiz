import * as React from "react";

import { AppContext, calculateScore } from "./context";
import { capFirst } from "./utils";
import Form from "./Components/Form";
import Loading from "./Components/Loading";
import Modal from "./Components/Modal";


const App = () => {
  const {
    waiting,
    loading,
    index,
    questions,
    nextQuestion,
    checkAnswer,
    correct,
    quiz,
    playingBackground,
    toggleBackground,
  } = React.useContext(AppContext);

  if (waiting) {
    return <Form />;
  }
  if (loading) {
    return <Loading />;
  }

  const { incorrect_answers, correct_answer, question, category, difficulty } = questions[index];
  const answers = [...incorrect_answers];
  if (incorrect_answers.length > 1) {
    let num = Math.floor(Math.random() * 4);
    if (num === 3) {
      answers.push(correct_answer);
    } else {
      answers.push(answers[num]);
      answers[num] = correct_answer;
    }
  } else {
    let num = Math.floor(Math.random() * 2);
    answers.push(answers[num]);
    answers[num] = correct_answer;
  }

  let score = calculateScore(correct, questions);

  let playIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height={50} className="" fill="none" viewBox="0 0 24 24" stroke="orange" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  let pauseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height={50} className="" fill="none" viewBox="0 0 24 24" stroke="orange" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  let toggleBtn = playingBackground ? pauseIcon : playIcon;

  const { username } = quiz;

  return (
    <main className="min-h-screen flex items-center justify-center">

      <Modal />
      <div className="p-3 py-5 md:p-8 bg-white shadow rounded-lg max-w-[800px] w-11/12 min-h-[300px]">
        <div onClick={toggleBackground}>{toggleBtn} </div>
        <div className="flex flex-wrap">
          <div className="w-full sm:w-1/2 mb-4 text-3xl font-medium ">
            <span className="text-blue-500">{capFirst(username)}</span>

          </div>
          <div className="w-full sm:w-1/2 mb-4 text-right text-3xl font-medium p-2">
            <span className="bg-blue-500 shadow rounded-full p-2 text-white p-2 hover:bg-blue-400"> {score} %</span>
          </div>
        </div>

        <div className="flex flex-wrap">
          <div className="w-full sm:w-1/2 mb-4 text-green-600">{category} | {difficulty}</div>
          <div className="w-full sm:w-1/2 mb-4 text-right text-green-600">
            Número:{" "}
            <span>
              {index + 1}/{questions.length}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <p
            className="text-center font-medium text-2xl lg:text-3xl leading-loose"
            dangerouslySetInnerHTML={{ __html: question }}
          />
          <div className="grid grid-cols-1 my-5 space-y-2 place-content-center">
            {answers.map((answer, index) => {
              return (
                <button
                  onClick={() => checkAnswer(answer === correct_answer)}
                  key={index}
                  className="bg-blue-500 w-4/5 rounded-lg mx-auto text-white p-2 hover:bg-blue-400"
                  dangerouslySetInnerHTML={{
                    __html: answer,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button
            onClick={nextQuestion}
            className="py-2 px-7 text-medium flex rounded-lg text-white bg-yellow-600 hover:bg-green-700"
          >
            Siguiente Pregunta
          </button>
        </div>
      </div>
    </main>
  );
};

export default App;