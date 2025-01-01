import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MessageModal from '../components/MessageModal';

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

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const SmallButton = styled(Button)`
  width: auto;
  margin-left: 10px;
`;

const ResendButton = styled(Button)`
  background: #e74c3c;
  &:hover {
    background: #c0392b;
  }
`;

const RegisterForm = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleClose = () => setModalShow(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [counter, setCounter] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/api/register', { username, password });
        setModalTitle('Register Successful');
        setModalMessage('You Have Account Now!, you can Login ');
        setModalShow(true);
        setTimeout(() => {
          handleClose();
          navigate('/login');
        }, 1000);
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
          placeholder="Set New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Set New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit">Regiser</Button>

        <MessageModal
          show={modalShow}
          handleClose={handleClose}
          title={modalTitle}
          message={modalMessage}
        />
      </Form>
    </Container>
  );
};

export default RegisterForm;