import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageModal from "../components/MessageModal";

export const handleLogout = async (navigate, setModalShow, setModalTitle, setModalMessage) => {
    try {
        await axios.post('http://127.0.0.1:3000/api/logout');
        localStorage.removeItem('token');
        navigate('/login');
    } catch (error) {
        console.error('Error logging out:', error);
        setModalTitle('Error logging out');
        setModalMessage('Logout failed');
        setModalShow(true);
    }
};

const Logout = () => {
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleLogoutClick = () => {
        handleLogout(navigate, setModalShow, setModalTitle, setModalMessage);
    };

    return (
        <div className="logout-container">
            <button onClick={handleLogoutClick} className="btn btn-primary">Logout</button>
            <MessageModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                title={modalTitle}
                message={modalMessage}
            />
        </div>
    );
};

export default Logout;
