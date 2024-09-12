// src/components/Welcome.js
import React from 'react';

const Welcome = ({ onStart }) => {
  return (
    <div>
      <h1>Welcome to our survey!</h1>
      <button onClick={onStart}>Start Survey</button>
    </div>
  );
};

export default Welcome;
