import React from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';

const theme = {
  buttonBg: '#8e44ad',
  buttonHoverBg: '#5b6ef4',
};

const EditButton = styled(Button)`
  background: ${theme.buttonBg};
  border: none;
  margin: 5px;
  &:hover {
    background: ${theme.buttonHoverBg};
  }
`;

const DeleteButton = styled(Button)`
  background: red;
  border: none;
  margin: 5px;
  &:hover {
    background: darkred;
  }
`;

//handleDelete function to connect with testServer.js Delete Contact endpoint
const handleDelete = async (contact, field, fetchContacts, handleClose) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://127.0.0.1:3000/api/contacts/${contact.contact_id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchContacts();
    handleClose();
    window.location.reload(); 
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
};

//handleEdit function to connect with testServer.js Update Contact endpoint
const handleEdit = async (contact, field, fetchContacts, handleClose) => {
  const token = localStorage.getItem('token');
  const updatedContact = {
    ...contact,
    [field]: prompt(`New ${field}:`, contact[field]),
  };
  try {
    await axios.put(`http://127.0.0.1:3000/api/contacts/${contact.contact_id}`, updatedContact, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchContacts(); 
    handleClose();
    window.location.reload(); 
  } catch (error) {
    console.error('Error updating contact:', error);
  }
};

const ContactDetailsModal = ({ show, handleClose, contact, fetchContacts }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contact Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>First Name:</strong> {contact.FirstName}
          <EditButton onClick={() => handleEdit(contact, 'FirstName', fetchContacts, handleClose)}>Edit</EditButton>
        </p>
        <p>
          <strong>Last Name:</strong> {contact.LastName}
          <EditButton onClick={() => handleEdit(contact, 'LastName', fetchContacts, handleClose)}>Edit</EditButton>
        </p>
        <p>
          <strong>Phone Number:</strong> {contact.Phone_Number}
          <EditButton onClick={() => handleEdit(contact, 'Phone_Number', fetchContacts, handleClose)}>Edit</EditButton>
        </p>
        <p>
          <strong>Email:</strong> {contact.contact_Email}
          <EditButton onClick={() => handleEdit(contact, 'contact_Email', fetchContacts, handleClose)}>Edit</EditButton>
        </p>
      </Modal.Body>
      <Modal.Footer>
      <DeleteButton variant="danger" onClick={() => handleDelete(contact, fetchContacts, handleClose)}>Delete Contact</DeleteButton>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactDetailsModal;
