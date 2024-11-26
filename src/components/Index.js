import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #2980b9, #8e44ad);
`;

const CardContainer = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Text = styled.p`
  margin-bottom: 30px;
  color: #666;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => (props.primary ? '#8e44ad' : '#5b6ef4')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px 0;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background: ${props => (props.primary ? '#5b6ef4' : '#8e44ad')};
    transform: translateY(-2px);
  }
`;

const Separator = styled.div`
  margin: 20px 0;
  text-align: center;
  color: #333;
  font-weight: bold;
`;

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <MainContainer>
      <CardContainer>
        <Title>Welcome to Phone Book App</Title>
        <Text>Store and manage your contacts with ease!</Text>
        <StyledButton primary onClick={handleLogin}>Login</StyledButton>
        <Separator>Not Member?</Separator>
        <StyledButton onClick={handleRegister}>Register</StyledButton>
      </CardContainer>
    </MainContainer>
  );
};

export default Index;
