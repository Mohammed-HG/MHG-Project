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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [counter, setCounter] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  
  const navigate = useNavigate();
  const handleClose = () => setModalShow(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/api/register', { username, password, email });
      setModalTitle('Registration Successful');
      setModalMessage('You have registered successfully. Please check your email or phone for an OTP to verify your account.');
      setModalShow(true);
      setOtpSent(true);
      setCounter(10);
      setResendDisabled(true);
    } catch (error) {
      setModalTitle('Registration Error');
      setModalMessage('There was an error during registration. Please try again.');
      setModalShow(true);
    }
  };

  useEffect(() => {
    let timer;
    if (otpSent && counter > 0) {
      timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    } else if (counter === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [otpSent, counter]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:3000/api/verify-otp', { email, otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setModalTitle('Verification Successful');
        setModalMessage('Your account has been verified successfully. You can now log in.');
        setModalShow(true);
        setTimeout(() => {
          handleClose();
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      setModalTitle('OTP Verification Error');
      setModalMessage('Invalid OTP. Please try again.');
      setModalShow(true);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://127.0.0.1:3000/api/send-otp', { email, type: 'email' });
      setModalTitle('OTP Sent');
      setModalMessage('A new OTP has been sent to your email.');
      setModalShow(true);
      setCounter(10);
      setResendDisabled(true);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Failed to resend OTP. Please try again.');
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
        {otpSent && (
          <>
            <InputGroup>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
              <SmallButton type="button" onClick={handleVerifyOtp}>Verify</SmallButton>
            </InputGroup>
            <ResendButton type="button" onClick={handleResendOtp} disabled={resendDisabled}>
              {resendDisabled ? `Resend OTP in ${counter}s` : 'Resend OTP'}
            </ResendButton>
          </>
        )}
        {!otpSent && <Button type="submit">Register</Button>}
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
