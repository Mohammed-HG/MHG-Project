import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../components/Logout';
import MessageModal from '../components/MessageModal';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa'; // Importing the plus icon

const AddButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(93, 173, 226, 0.5);
  }
`;

const NavBar = () => {
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleLogoutClick = (e) => {
    e.preventDefault();
    handleLogout(navigate, setModalShow, setModalTitle, setModalMessage);
  };

  const handleButtonClick = () => {
    navigate('/Add-Contact');
  };

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link active" href="#">Account</a>
          </li>
          <button className="nav-link btn btn-link" onClick={handleLogoutClick}> Logout </button>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
        </ul>
        <AddButton onClick={handleButtonClick}>
          <FaPlus />
        </AddButton>
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
