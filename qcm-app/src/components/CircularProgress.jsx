import React from 'react';
import './CircularProgress.css';

const CircularProgress = ({ progress }) => {
  // Calcul de la circonférence
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width="120" height="120" className="progress-circle">
        <circle
          className="progress-circle__background"
          cx="60"
          cy="60"
          r="50"
          strokeWidth="10"
        />
        <circle
          className="progress-circle__foreground"
          cx="60"
          cy="60"
          r="50"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-text">{progress}%</div>
    </div>
  );
};

export default CircularProgress;
