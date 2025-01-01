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

const LoginForm = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleClose = () => setModalShow(false);
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [contact, setContact] = useState(''); // email or phone number

  const [counter, setCounter] = useState(10);
  const [resendDisabled, setResendDisabled] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        await axios.post('http://127.0.0.1:3000/api/send-otp', { contact, type: 'phone' });
        setOtpSent(true);
        setCounter(10);
        setResendDisabled(true);
        setModalTitle('OTP Sent');
        setModalMessage('An OTP has been sent to your phone number.');
        setModalShow(true);
        setTimeout(() => {
            handleClose();
          }, 2000);
      }
    } catch (error) {
      setModalTitle('Login Error');
      setModalMessage('Invalid username or password. Please try again.');
      setModalShow(true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:3000/api/verify-otp', { contact, otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setModalTitle('Login Successful');
        setModalMessage('OTP verified successfully.');
        setModalShow(true);
        setTimeout(() => {
          handleClose();
          navigate('/Home');
        }, 1000);
      }
    } catch (error) {
      setModalTitle('OTP Verification Error');
      setModalMessage('Invalid OTP. Please try again.');
      setModalShow(true);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://127.0.0.1:3000/api/send-otp', { contact, type: 'email' });
      setModalTitle('OTP Sent');
      setModalMessage('A new OTP has been sent to your email or phone.');
      setModalShow(true);
      setCounter(10);
      setResendDisabled(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Failed to resend OTP. Please try again.');
      setModalShow(true);
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  }

  const handleRegisterClick = () => {
    navigate('/register');
  }


  return (
    <Container>
      <Form onSubmit={handleLogin} className="was-validated">
        <Title>Welcome Back</Title>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          name="uname"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          name="pswd"
          required
        />
        <Input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Verify by email or phone number"
          name="contact"
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
                name="otp"
                required
              />
              <SmallButton type="button" onClick={handleVerifyOtp}>Verify</SmallButton>
            </InputGroup>
            <ResendButton type="button" onClick={handleResendOtp} disabled={resendDisabled}>
              {resendDisabled ? `Resend OTP in ${counter}s` : 'Resend OTP'}
            </ResendButton>
          </>
        )}
        {!otpSent && <Button type="submit">Login</Button>}
        
        <Title></Title>
        <h5>Don't Have Account ?</h5>
        <smallButton type="button" onClick={handleRegisterClick}>Register Now!</smallButton>
        
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

export default LoginForm;
