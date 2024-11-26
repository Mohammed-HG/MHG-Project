import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import NavBar from "../adds/NavBar";
import MessageModal from "./MessageModal";
import ContactDetailsModal from "./ContactDetailsModal";

const theme = {
    background: '#fff',
    color: '#333',
    tableBg: '#f9f9f9',
    buttonBg: '#8e44ad',
    buttonHoverBg: '#5b6ef4',
  };
  
  const Container = styled.div`
    background: ${theme.background};
    color: ${theme.color};
    min-height: 100vh;
    padding: 20px;
    transition: background 0.3s, color 0.3s;
  `;
  
  const Title = styled.h1`
    text-align: center;
  `;
  
  const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: ${theme.tableBg};
    border-radius: 10px;
    overflow: hidden;
  `;
  
  const Th = styled.th`
    padding: 12px;
    background: ${theme.buttonBg};
    color: #fff;
  `;
  
  const Td = styled.td`
    padding: 12px;
    border: 1px solid ${theme.background};
    cursor: pointer;
    &:hover {
      background: ${theme.buttonHoverBg};
      color: #fff;
    }
  `;
  
  const Button = styled.button`
    background: ${theme.buttonBg};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s, transform 0.3s;
  
    &:hover {
      background: ${theme.buttonHoverBg};
      transform: translateY(-2px);
    }
  `;
const Main = () => {

    const [modalShow, setModalShow] = useState(false); 
    const [modalTitle, setModalTitle] = useState(''); 
    const [modalMessage, setModalMessage] = useState(''); 
    
    const [contacts, setContacts] = useState([]);
    const [newContact, setnewContact] = useState({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});
    const navigate = useNavigate();

    const [selectedContact, setSelectedContact] = useState(null);

    const handleClose = () => {
        setModalShow(false);
        setSelectedContact(null);
    }

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setModalTitle('Authentication Error'); 
            setModalMessage('Authentication token Expired. Please login.');
            setModalShow(true);
             return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:3000/api/contacts', {
                    headers: { 'Authorization': `Bearer ${token}`
                }
            });
            setContacts(response.data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setModalTitle('Session Expired'); 
                setModalMessage('Your session has expired. Please log in again '); 
                setModalShow(true);
                navigate('/login');
            } else {
                console.error('Error fetching contacts:', error);
            }
        }
    };

     const handleRowClick = (contact) => {
    setSelectedContact(contact);
    setModalShow(true);
  };

    const handleButtonClick = () => {
        navigate('/Add-Contact');
      };

    return (
        <Container>
        <NavBar />
        <Title>Contacts</Title>
        <Table>
          <thead>
            <tr>
              <Th>Contacts Name</Th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.contact_id} onClick={() => handleRowClick(contact)}>
                <Td>{contact.FirstName} {contact.LastName}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={handleButtonClick}>Add New Contact</Button>
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
    );
};

export default Main;