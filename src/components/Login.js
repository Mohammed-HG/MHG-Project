import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from './MessageModal';
import { Container } from 'react-bootstrap';

const Login = () => {

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
      <form onSubmit={handleLogin} class="was-validated">
        <Container >
        <h2>Login</h2>
        <div class="mb-3 mt-3">

          <input type="text" 
           value={username} 
           onChange={(e) => setusername(e.target.value)} 
           class="form-control"
           id="floatingInput" 
           placeholder="Enter username" 
           name="uname" 
           required 
           />

          <div class="valid-feedback">Valid.</div>
          <div class="invalid-feedback">Please fill out this field.</div>
        </div>
      <div class="mb-3">

         <input 
         type="password" 
         value={password}
         onChange={(e) => setpassword(e.target.value)}
         class="form-control"
         id="floatingPassword" 
         placeholder="Enter password" 
         name="pswd" 
         required 
         />

         <div class="valid-feedback">Valid.</div>
         <div class="invalid-feedback">Please fill out this field.</div>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" id="myCheck" name="remember" required />
        <label class="form-check-label" for="myCheck">I agree on blabla.</label>
        <div class="valid-feedback">Valid.</div>
        <div class="invalid-feedback">Check this checkbox to continue.</div>
     </div>

     <div> 
      <button onClick={handleLogin} 
       type="submit" 
       class="btn btn-primary">Login</button> 
      <MessageModal 
      show={modalShow} 
      handleClose={handleClose} 
      title={modalTitle} 
      message={modalMessage} 
      /> 
      </div>
    </Container>
    </form>
    );

};

export default Login;