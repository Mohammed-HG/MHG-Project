import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from './Logout';
import MessageModal from "../components/MessageModal";

const NavBar = () => {
    const navigate = useNavigate();

    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleLogoutClick = (e) => {
        e.preventDefault();
        handleLogout(navigate, setModalShow, setModalTitle, setModalMessage);
    };

    const handleAccountClick = () => {
        navigate('/account');
    };

    const handleAboutClick = () => {
        navigate('/about');
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Phone Book App</a>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button className="nav-link active btn btn-link" onClick={handleAccountClick}>
                            Account
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link" onClick={handleLogoutClick}>
                            Logout
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link btn btn-link" onClick={handleAboutClick}>
                            About
                        </button>
                    </li>
                </ul>
            </div>
            <MessageModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                title={modalTitle}
                message={modalMessage}
            />
        </nav>
    );
};

export default NavBar;
