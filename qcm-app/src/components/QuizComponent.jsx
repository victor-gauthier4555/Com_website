import React, { useState } from 'react';
import './QuizComponent.css';
import CircularProgress from './CircularProgress';
import FinalPage from './FinalPage'; // Importation de la page finale

const QuizComponent = () => {
  // Questions avec des poids pour chaque option
  const questions = [
    {
      id: 1,
      question: 'Âge?',
      options: ['Moins de 45 ans', '45-54 ans', '55-64 ans', '65 ou plus'],
      weights: [0, 1, 2, 3]
    },
    {
      id: 2,
      question: 'Sexe biologique',
      options: ['Homme', 'Femme'],
      weights: [1, 0]
    },
    {
      id: 3,
      question: 'Tour de taille (au niveau du nombril, en cm)',
      options: ['- de 80 cm (femmes) / - de 94 cm (hommes)', '80-88 cm (femmes) / 94-102 cm (hommes)', '+ de 88 cm (femmes) / + de 102 cm (hommes)'],
      weights: [0, 3, 4]
    },
    {
      id: 4,
      question: 'Taille (en cm)',
      input: true
    },
    {
      id: 5,
      question: 'Poids (en kg)',
      input: true
    },
    {
      id: 6,
      question: 'Pratiquez-vous une activité physique d’au moins 30 minutes par jour?',
      options: ['Oui, tous les jours ou presque', 'Non moins souvent'],
      weights: [0, 1]
    },
    {
      id: 7,
      question: 'Consommez-vous régulièrement des fruits, légumes ou baies (au moins une portion par jour) ?',
      options: ['Oui', 'Non'],
      weights: [0, 1]
    },
    {
      id: 8,
      question: 'Avez-vous déjà fumé, ou fumez-vous actuellement ?',
      options: ['Non, jamais', 'Oui, je fume actuellement', 'Oui, mais j’ai arrêté depuis plus d’1 an'],
      weights: [0, 3, 1]
    },
    {
      id: 9,
      question: 'Avez-vous déjà été diagnostiqué(e) avec l’une des pathologies suivantes ?',
      options: ['Hypertension artérielle', 'Diabète', 'Cholestérol élevé', 'Maladie cardiovasculaire', 'Aucun de ces diagnostics'],
      weights: [2, 4, 2, 4, 0]
    },
    {
      id: 10,
      question: 'Y a-t-il des cas de diabète diagnostiqués dans votre famille proche ?',
      options: ['Non', 'Oui, famille éloignée', 'Oui, famille proche'],
      weights: [0, 1, 3]
    },
    {
      id: 11,
      question: 'Avez-vous des antécédents familiaux de maladies cardiovasculaires précoces ?',
      options: ['Non', 'Oui'],
      weights: [0, 2]
    },
    {
      id: 12,
      question: 'Votre tension artérielle la plus récente était :',
      options: ['Inférieure à 140/90 mmHg', 'Égale ou supérieure à 140/90 mmHg', 'Je ne sais pas'],
      weights: [0, 3, 1]
    },
    {
      id: 13,
      question: 'Vos derniers résultats de cholestérol indiquent : ',
      options: ['Inférieur à 1,9g/L', 'Égal ou supérieur à 1,9g/L', 'Je ne sais pas'],
      weights: [0, 3, 1]
    },
    {
      id: 14,
      question: 'Votre glycémie à jeun la plus récente était :',
      options: ['Inférieure à 1 g/L', 'Égale ou supérieure à 1 g/L', 'Je ne sais pas'],
      weights: [0, 4, 1]
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userInputs, setUserInputs] = useState({ taille: '', poids: '' });
  const [showFinalPage, setShowFinalPage] = useState(false); // Gérer l'affichage de FinalPage

  const handleAnswerClick = (answerIndex) => {
    const weight = questions[currentQuestionIndex].weights ? questions[currentQuestionIndex].weights[answerIndex] : 0;
    setScore(prevScore => prevScore + weight);
    setIsTransitioning(true);

    setTimeout(() => {
      moveToNextQuestion();
      setIsTransitioning(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    setUserInputs({
      ...userInputs,
      [questions[currentQuestionIndex].id]: e.target.value
    });
  };

  const handleSubmitInput = () => {
    if (validateNumberInput(userInputs[questions[currentQuestionIndex].id])) {
      setIsTransitioning(true);
      setTimeout(() => {
        moveToNextQuestion();
        setIsTransitioning(false);
      }, 300);
    }
  };

  const validateNumberInput = (value) => {
    return value !== '' && !isNaN(value) && Number(value) > 0;
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setProgress(((nextIndex / questions.length) * 100).toFixed(0));
    } else {
        calculateIMC();
        setProgress(100);
        setShowFinalPage(true); // Passe immédiatement à FinalPage
    }
  };


  const calculateIMC = () => {
    const taille = parseFloat(userInputs[4]) / 100;
    const poids = parseFloat(userInputs[5]);
    if (taille && poids) {
      const imc = poids / (taille * taille);
      let imcScore = imc < 25 ? 0 : imc < 30 ? 1 : 3;
      setScore(prevScore => prevScore + imcScore);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setProgress(0);
    setScore(0);
    setUserInputs({ taille: '', poids: '' });
    setShowFinalPage(false);
  };

  return (
    <div className={`quiz-wrapper ${showFinalPage ? 'fade-out' : ''}`}>
      {showFinalPage ? (
        <FinalPage score={score} restartQuiz={restartQuiz} />
      ) : (
        <>
          <div className="quiz-header">
            <img src="/image.png" alt="IHU ICAN Logo" className="quiz-logo"/>
          </div>

          <div className="quiz-container">
            <div className="progress-wrapper">
              <CircularProgress progress={progress}/>
            </div>
            <div className={`question-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              <h2>{questions[currentQuestionIndex].question}</h2>
              <div className="options-container">
                {questions[currentQuestionIndex].options ? (
                  questions[currentQuestionIndex].options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswerClick(index)}>
                      {option}
                    </button>
                  ))
                ) : (
                  <div className="input-container">
                    <input
                      type="number"
                      value={userInputs[questions[currentQuestionIndex].id] || ''}
                      onChange={handleInputChange}
                    />
                    <button
                        onClick={handleSubmitInput}
                        disabled={!validateNumberInput(userInputs[questions[currentQuestionIndex].id])}
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizComponent;





