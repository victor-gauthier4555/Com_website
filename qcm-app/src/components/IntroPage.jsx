import React,{ useEffect } from "react";
import "./IntroPage.css";

const IntroPage = ({ startQuiz }) => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=6LdAJvMqAAAAAOVxS_Q96dRIUcBw6VmxrWzz2xRK";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleStartQuiz = async () => {
    window.grecaptcha.ready(async () => {
      const token = await window.grecaptcha.execute("6LdAJvMqAAAAAOVxS_Q96dRIUcBw6VmxrWzz2xRK", { action: "start_test" });
      console.log("Token reCAPTCHA généré :", token); // 🔍
      const response = await fetch("https://5acb-134-157-204-79.ngrok-free.app/start_test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.success) {
        startQuiz();
      } else {
        alert("Captcha échoué, veuillez réessayer.");
      }
    });
  };

  return (
    <div className="intro-page">
      <div className="container">
        {/* Triangle bleu foncé */}
        <div className="background">
          <div className="shape-left">
            <div className="text-inside">
              <h1>Quizz IHU ICAN</h1>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="logo">
          <img src="/image.png" alt="IHU ICAN Logo" />
        </div>

        {/* Cadre de description du quiz + bouton */}
        <div className="quiz-description">

          <p>
            Nous vous proposons de réaliser un test pour évaluer votre risque cardiométabolique
            sur les 10 prochaines années. Ce test est basé sur des données validées
            scientifiquement et a pour but de vous aider à mieux comprendre votre état de
            santé et les éventuelles mesures à prendre pour le préserver. Le test est basé
            sur les scores : Findrisc pour le diabète de type 2 et Score2 pour les maladies
            cardiovasculaires. Il ne s’agit ni d’un dépistage ni d’un diagnostic et ne
            remplace en aucun cas une consultation chez un professionnel de santé.
          </p>

          <p><strong>Cela prendra environ 5 minutes. Êtes-vous prêt(e) ?</strong></p>

          {/* Bouton Commencer (intégré dans la zone) */}
          <button onClick={handleStartQuiz} className="start-button">Commencer</button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
