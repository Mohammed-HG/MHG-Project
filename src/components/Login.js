import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/login', {username, password});
            alert(response.data.message || 'Login Successful');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
        } catch(error) {
            alert(error.response?.data || 'Login Failed');
        }
    }

return (
    <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
            <label>UserName</label>
            <input type='text' value={username} onChange={(e) => setusername(e.target.value)} required />
        </div>
        <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
    </form>
    
  );
};

export default Login;