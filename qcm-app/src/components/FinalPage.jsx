import React, { useState, useEffect, useRef } from "react";

import "./FinalPage.css";



const FinalPage = ({ score }) => {
  const [email, setEmail] = useState(""); // Stocke l'email actuel
  const [isSubmitted, setIsSubmitted] = useState(false); // Vérifie si soumis
  const hasSentRequest = useRef(false);




  // Fonction pour récupérer le texte en fonction du score
  const getResultDetails = (score) => {
    if (score <= 11) {
      return {
        title: "Risque faible (0-11 points)",
        interpretation: "Votre risque est faible. Vous n’avez pas de facteur de risque majeur à ce jour.",
        conseils: [
          "Maintenez une alimentation équilibrée, une activité physique régulière, et évitez de fumer.",
          "Faites un bilan de santé annuel pour surveiller vos indicateurs."
        ]
      };
    } else if (score <= 20) {
      return {
        title: "Risque modéré (12-20 points)",
        interpretation: "Votre risque est modéré. Vous présentez certains facteurs de risque qui méritent d’être surveillés.",
        conseils: [
          "Améliorez vos habitudes alimentaires en augmentant la consommation de fruits, légumes, et aliments riches en fibres.",
          "Pratiquez une activité physique d’au moins 30 minutes par jour.",
          "Consultez un professionnel de santé pour un suivi régulier de votre tension, cholestérol, et glycémie."
        ]
      };
    } else if (score <= 30) {
      return {
        title: "Risque élevé (21-30 points)",
        interpretation: "Votre risque est élevé. Vous êtes à risque accru de développer un diabète ou une maladie cardiovasculaire dans les 10 prochaines années.",
        conseils: [
          "Prenez rendez-vous avec votre médecin pour une évaluation approfondie et des analyses complémentaires.",
          "Suivez un plan d’action incluant une activité physique adaptée, une perte de poids (si nécessaire), et une gestion stricte de votre alimentation.",
          "Envisagez un suivi par un diététicien et un coach sportif."
        ]
      };
    } else {
      return {
        title: "Risque très élevé (> 30 points)",
        interpretation: "Votre risque est très élevé. Une intervention médicale et des changements de mode de vie sont impératifs.",
        conseils: [
          "Consultez immédiatement un professionnel de santé pour une prise en charge globale.",
          "Suivez un traitement médicamenteux si recommandé (par exemple, antihypertenseurs, statines).",
          "Intégrez des changements drastiques dans votre mode de vie : arrêt total du tabac, contrôle strict de votre alimentation, et suivi d’un programme d’exercice personnalisé."
        ]
      };
    }
  };

  const result = getResultDetails(score);

  useEffect(() => {
    if (!hasSentRequest.current) {
      fetch("https://5acb-134-157-204-79.ngrok-free.app/finish_test", { method: "POST" });
      hasSentRequest.current = true; // Marque comme envoyé
    }
  }, []);

  return (
    <div className="final-page">
      {/* Logo en haut */}
      <div className="quiz-header">
        <img src="/image.png" alt="IHU ICAN Logo" className="quiz-logo" />
      </div>

      {/* Rectangle bleu contenant le résultat */}
      <div className="result-container">

        <p><strong>Total des points :</strong> {score}</p>
        <h3>{result.title}</h3>
        <p><strong>Interprétation :</strong> {result.interpretation}</p>

        <h4>Conseils :</h4>
        <ul>
          {result.conseils.map((conseil, index) => (
            <li key={index}>{conseil}</li>
          ))}
        </ul>


      </div>
    </div>
  );
};

export default FinalPage;


