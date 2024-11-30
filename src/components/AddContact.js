import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MessageModal from './MessageModal';

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

const AddContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    FirstName: '',
    LastName: '',
    Phone_Number: '',
    contact_Email: ''
  });
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleClose = () => setModalShow(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://127.0.0.1:3000/api/contacts', newContact, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts([...contacts, response.data]);
      setNewContact({ FirstName: '', LastName: '', Phone_Number: '', contact_Email: '' });
      setModalTitle('Contact Added');
      setModalMessage('The new contact has been added successfully.');
      setModalShow(true);
      setTimeout(() => {
        handleClose();
        navigate('/Home');
      }, 1500);
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('There was an error adding the contact. Please try again.');
      setModalShow(true);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleAdd}>
        <Title>Add New Contact</Title>
        <Input
          type="text"
          placeholder="First Name"
          value={newContact.FirstName}
          onChange={(e) => setNewContact({ ...newContact, FirstName: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={newContact.LastName}
          onChange={(e) => setNewContact({ ...newContact, LastName: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Phone Number"
          value={newContact.Phone_Number}
          onChange={(e) => setNewContact({ ...newContact, Phone_Number: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={newContact.contact_Email}
          onChange={(e) => setNewContact({ ...newContact, contact_Email: e.target.value })}
          required
        />
        <Button type="submit">Add Contact</Button>
      </Form>
      <MessageModal
        show={modalShow}
        handleClose={handleClose}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

export default AddContact;
