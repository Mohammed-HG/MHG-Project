import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from './MessageModal';
import styled from 'styled-components';

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

const LoginForm = () => {

    const [modalShow, setModalShow] = useState(false); 
    const [modalTitle, setModalTitle] = useState(''); 
    const [modalMessage, setModalMessage] = useState(''); 

    const handleClose = () => setModalShow(false);

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [contactType, setContactType] = useState('email');
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    //handleLogin function to connect with testServer.js Login endpoint
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/login', {username, password});
            setOtpSent(true);
            if (response.data.token) {
            }
        } catch(error) {
          setModalTitle('Login Error'); 
          setModalMessage('Username OR Password Invaild');
          setModalShow(true);
        }
    };

    //OTP Verify function to connect with testServer.js OTP Verify endpoint
    const handleVerifyOtp = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://127.0.0.1:3000/api/verify-otp', {contact: username, otp});
        if (response.status === 200) {
          setModalTitle('Login Successful');
          setModalMessage(response.data.message || 'Login Successful');
          setModalShow(true);
          localStorage.setItem('token', response.data.token);
          setTimeout(() => { 
            handleClose();
            navigate('/Home'); 
          }, 
          1500);
        }
      } catch (error) { 
          setModalTitle('OTP Verification Error'); 
          setModalMessage('Invalid OTP. Please try again.'); 
          setModalShow(true);
      }
    };

    return (
       <Container> 
        {!otpSent ? ( 
          <Form onSubmit={handleLogin} className="was-validated"> 
              <Title>Login</Title> 
              <Input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter email or phone number" 
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
              <Button type="submit">Login</Button> 
              <MessageModal 
                  show={modalShow} 
                  handleClose={handleClose} 
                  title={modalTitle} 
                  message={modalMessage} 
              /> 
          </Form> 
        ) : ( 
        <Form onSubmit={handleVerifyOtp} className="was-validated"> 
            <Title>Enter OTP</Title> 
            <Input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="Enter OTP" 
                name="otp" 
                required 
            /> 
            <Button type="submit">Verify OTP</Button> 
            <MessageModal 
                show={modalShow} 
                handleClose={handleClose} 
                title={modalTitle} 
                message={modalMessage} 
                /> 
          </Form> 
        )}
    </Container>
    );

};

export default LoginForm;