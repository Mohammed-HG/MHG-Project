import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MessageModal from './MessageModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(120deg, #2980b9, #8e44ad);
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Form = styled.form`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #8e44ad;
    outline: none;
    box-shadow: 0 0 5px rgba(142, 68, 173, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #8e44ad;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background: #5b6ef4;
    transform: translateY(-2px);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(93, 173, 226, 0.5);
  }
`;

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/register', { username, password, email });
      setModalTitle('Registration Successful');
      setModalMessage('You have registered successfully.');
      setModalShow(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setModalTitle('Registration Error');
      setModalMessage('There was an error during registration. Please try again.');
      setModalShow(true);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <Title>Register</Title>
        <Input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>
      </Form>
      <MessageModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

export default RegisterForm;
