import React, { useState } from "react";
import QuizComponent from "./components/QuizComponent";
import IntroPage from "./components/IntroPage"; // Import du nouveau composant
import "./App.css";



const App = () => {
  const [quizStarted, setQuizStarted] = useState(false);

  return (
    <div className="app-container">
      {!quizStarted ? <IntroPage startQuiz={() => setQuizStarted(true)} /> : <QuizComponent />}
    </div>
  );
};

export default App;






