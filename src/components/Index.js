import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to the Phone Book App</h1>
      <p>Store and manage your contacts with ease!</p>

      <h2>Login</h2>
      <button onClick={handleButtonClick}>Go to Login</button>
    </div>
  );
};

export default Index;