import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavBar from '../adds/NavBar';
import MessageModal from './MessageModal';
import ContactDetailsModal from './ContactDetailsModal';
import { FaPlus, FaSearch, FaPhone, FaEnvelope } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(120deg, #2980b9, #8e44ad); /* Matching LoginForm background */
  color: #333;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  margin: 0 auto; /* Center the container */
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
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

const CardContainer = styled.div`
  background: #f8f9fa;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px; /* Adjusting max-width to make it smaller */
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Reduced gap */
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px; /* Adjusting padding to make it smaller */
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ProfilePicture = styled.div`
  width: 50px;
  height: 50px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin-right: 20px;
`;

const CardContent = styled.div`
  flex-grow: 1;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #007bff;
`;

const CardDetail = styled.p`
  margin: 5px 0;
  color: #555;
  display: flex;
  align-items: center;
`;

const CardIcon = styled.span`
  margin-right: 8px;
`;

const AddButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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

const Main = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const navigate = useNavigate();
  const handleClose = () => {
    setModalShow(false);
    setSelectedContact(null);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch contacts function to connect with the server
  const fetchContacts = async (search = '') => {
    const token = localStorage.getItem('token');
    if (!token) {
      setModalTitle('Authentication Error');
      setModalMessage('Authentication token expired. Please log in.');
      setModalShow(true);
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search }, // Include search parameter
      });
      setContacts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setModalTitle('Session Expired');
        setModalMessage('Your session has expired. Please log in again.');
        setModalShow(true);
        navigate('/login');
      } else {
        console.error('Error fetching contacts:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContacts(searchTerm);
  };

  const handleRowClick = (contact) => {
    setSelectedContact(contact);
    setModalShow(true);
  };

  return (
    <>
      <NavBar />
      <Container>
        <Content>
          <Title>Contacts</Title>
          <SearchContainer>
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search contacts"
            />
            <SearchButton onClick={handleSearchSubmit}>
              <FaSearch />
            </SearchButton>
          </SearchContainer>
          <CardContainer>
            {contacts.map((contact) => (
              <Card key={contact.contact_id} onClick={() => handleRowClick(contact)}>
                <ProfilePicture>{contact.FirstName.charAt(0)}</ProfilePicture>
                <CardContent>
                  <CardTitle>{contact.FirstName} {contact.LastName}</CardTitle>
                  <CardDetail>
                    <CardIcon>
                      <FaPhone />
                    </CardIcon>
                    {contact.Phone_Number}
                  </CardDetail>
                  <CardDetail>
                    <CardIcon>
                      <FaEnvelope />
                    </CardIcon>
                    {contact.contact_Email}
                  </CardDetail>
                </CardContent>
              </Card>
            ))}
          </CardContainer>
        </Content>
        <MessageModal
          show={modalShow}
          handleClose={handleClose}
          title={modalTitle}
          message={modalMessage}
        />
        {selectedContact && (
          <ContactDetailsModal
            show={modalShow}
            handleClose={handleClose}
            contact={selectedContact}
            fetchContacts={fetchContacts} // Pass down fetchContacts to refresh the contacts list
          />
        )}
      </Container>
    </>
  );
};

export default Main;
