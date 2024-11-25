import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from '../components/Logout';
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

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link active" href="#">Account</a>
                    </li>
                    <button className="nav-link btn btn-link" onClick={handleLogoutClick}> Logout </button>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
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
