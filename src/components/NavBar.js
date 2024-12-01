import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../pages/Logout';
import MessageModal from './MessageModal';
import '../styles/NavBar.css';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
 <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Phone Book</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <button className="nav-link btn btn-link" onClick={handleLogoutClick}> Logout </button>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <MessageModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
      </Container>
    </Navbar>
  );
}

export default NavBar;
