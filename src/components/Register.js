import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/register', {newUsername, newPassword});
            alert(response.data.message || 'Register Successful');
            if (response.status === 201) {
                navigate('/login');
            }

        } catch(error) {
            alert(error.response?.data?.error || 'Regster Failed')
        }
    }

return (
    <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div>
            <label>Set User Name</label>
            <input type='text' value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
        </div>
        <div>
        <label>Set Password</label>
        <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>

    </form>
)
}

export default Register;