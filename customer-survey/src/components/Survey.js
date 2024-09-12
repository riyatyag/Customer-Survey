import React, { useState, useEffect } from 'react';
import './Survey.css'; // Ensure CSS is imported

// Function to generate a unique session ID
const generateSessionId = () => {
  return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    // Correct precedence by using parentheses
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

const Survey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [completed, setCompleted] = useState(false);
  const [surveyStarted, setSurveyStarted] = useState(false);

  const questions = [
    { id: 'q1', text: 'How satisfied are you with our products?', type: 'rating', options: [1, 2, 3, 4, 5] },
    { id: 'q2', text: 'How fair are the prices compared to similar retailers?', type: 'rating', options: [1, 2, 3, 4, 5] },
    { id: 'q3', text: 'How satisfied are you with the value for money of your purchase?', type: 'rating', options: [1, 2, 3, 4, 5] },
    { id: 'q4', text: 'On a scale of 1-10 how would you recommend us to your friends and family?', type: 'rating', options: Array.from({ length: 10 }, (_, i) => i + 1) },
    { id: 'q5', text: 'What could we do to improve our service?', type: 'text' },
  ];

  const handleStartSurvey = () => {
    const sessionId = generateSessionId();
    localStorage.setItem('sessionId', sessionId); // Save session ID
    setCurrentQuestion(0);
    setResponses({});
    setCompleted(false);
    setSurveyStarted(true);
  };

  const handleResponseChange = (questionId, response) => {
    const sessionId = localStorage.getItem('sessionId'); // Retrieve session ID
    const updatedResponses = {
      ...responses,
      [questionId]: response
    };
    setResponses(updatedResponses);

    // Save responses to local storage
    localStorage.setItem('responses', JSON.stringify({
      sessionId,
      answers: updatedResponses
    }));
  };

  const handleNavigation = (direction) => {
    setCurrentQuestion(prev => {
      const newIndex = direction === 'next'
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0);
      return newIndex;
    });
  };

  const handleSkip = () => {
    // Skip to the next question
    setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = () => {
    const confirmed = window.confirm('Are you sure you want to submit the survey?');
    if (confirmed) {
      const sessionId = localStorage.getItem('sessionId');
      localStorage.setItem('responses', JSON.stringify({
        sessionId,
        answers: responses
      }));
      localStorage.setItem('surveyStatus', 'COMPLETED');
      setCompleted(true);
    }
  };

  const retrieveSavedResponses = () => {
    const sessionId = localStorage.getItem('sessionId');
    const savedData = JSON.parse(localStorage.getItem('responses'));

    if (savedData && savedData.sessionId === sessionId) {
      setResponses(savedData.answers);
    }
  };

  useEffect(() => {
    if (surveyStarted) {
      retrieveSavedResponses();
    }
  }, [surveyStarted]);

  if (completed) {
    return (
      <div>
        <h1>Thank you for your time!</h1>
        <p>Redirecting to the welcome screen...</p>
        {setTimeout(() => window.location.reload(), 5000)}
      </div>
    );
  }

  if (!surveyStarted) {
    return (
      <div className="survey-container">
        <h1>Customer Survey !</h1> {/* Heading Added Here */}
        <p>Welcome to our survey! Please click below to start.</p>
        <button onClick={handleStartSurvey}>Start Survey</button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="survey-container">
      <h1>Customer Survey</h1> {/* Heading Added Here */}
      <h2>Survey {currentQuestion + 1} / {questions.length}</h2>
      <p>{question.text}</p>
      {question.type === 'rating' && question.options.map(option => (
        <button 
          key={option} 
          onClick={() => handleResponseChange(question.id, option)}
          className={responses[question.id] === option ? 'selected' : ''}
        >
          {option}
        </button>
      ))}
      {question.type === 'text' && (
        <textarea 
          value={responses[question.id] || ''} 
          onChange={(e) => handleResponseChange(question.id, e.target.value)} 
        />
      )}
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation('prev')} disabled={currentQuestion === 0}>Previous</button>
        <button onClick={handleSkip}>Skip</button>
        <button onClick={() => handleNavigation('next')} disabled={currentQuestion === questions.length - 1}>Next</button>
        {currentQuestion === questions.length - 1 && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default Survey;
