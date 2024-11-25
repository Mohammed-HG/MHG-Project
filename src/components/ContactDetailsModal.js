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

const handleDelete = async (contact, field, fetchContacts, handleClose) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://127.0.0.1:3000/api/contacts/${contact.contact_id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchContacts(); // Refresh the contacts list after deletion
    handleClose();
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
};

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
    fetchContacts(); // Refresh the contacts list after editing
    handleClose();
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
          <DeleteButton onClick={() => handleDelete(contact, 'FirstName', fetchContacts, handleClose)}>Delete</DeleteButton>
        </p>
        <p>
          <strong>Last Name:</strong> {contact.LastName}
          <EditButton onClick={() => handleEdit(contact, 'LastName', fetchContacts, handleClose)}>Edit</EditButton>
          <DeleteButton onClick={() => handleDelete(contact, 'LastName', fetchContacts, handleClose)}>Delete</DeleteButton>
        </p>
        <p>
          <strong>Phone Number:</strong> {contact.Phone_Number}
          <EditButton onClick={() => handleEdit(contact, 'Phone_Number', fetchContacts, handleClose)}>Edit</EditButton>
          <DeleteButton onClick={() => handleDelete(contact, 'Phone_Number', fetchContacts, handleClose)}>Delete</DeleteButton>
        </p>
        <p>
          <strong>Email:</strong> {contact.contact_Email}
          <EditButton onClick={() => handleEdit(contact, 'contact_Email', fetchContacts, handleClose)}>Edit</EditButton>
          <DeleteButton onClick={() => handleDelete(contact, 'contact_Email', fetchContacts, handleClose)}>Delete</DeleteButton>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactDetailsModal;
