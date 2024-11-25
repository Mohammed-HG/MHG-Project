import React, { useState, useEffect } from 'react';
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
  background: #ff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
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
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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

const Checkbox = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  input {
    margin-right: 10px;
  }

  label {
    margin: 0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #1302339a;
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
    
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      if (modalShow) {
        const timer = setTimeout(() => { 
          handleClose();
          navigate('/Home');
        }, 1500);
        return () => clearTimeout(timer);
      }
    },[modalShow, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/login', {username, password});
            setModalTitle('Login Successful');
            setModalMessage(response.data.message || 'Login Successful');
            setModalShow(true);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
        } catch(error) {
          setModalTitle('Login Error'); 
          setModalMessage('Username OR Password Invaild');
          setModalShow(true);
        }
    }

    return (
        <Container>
        <Form onSubmit={handleLogin} className="was-validated">
            <Title>Login</Title>
            <Input
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Enter username"
                name="uname"
                required
            />
            <Input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter password"
                name="pswd"
                required
            />
            <Checkbox>
                <input className="form-check-input" type="checkbox" id="myCheck" name="remember" required />
                <label className="form-check-label" htmlFor="myCheck">I agree</label>
            </Checkbox>
            <Button type="submit">Login</Button>
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