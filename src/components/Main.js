import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../adds/NavBar";
import MessageModal from "./MessageModal";

const Main = () => {

    const [modalShow, setModalShow] = useState(false); 
    const [modalTitle, setModalTitle] = useState(''); 
    const [modalMessage, setModalMessage] = useState(''); 
    
    const [contacts, setContacts] = useState([]);
    const [newContact, setnewContact] = useState({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});
    const navigate = useNavigate();

    const handleClose = () => setModalShow(false);

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

   
    const handleDelete = async (contact_id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://127.0.0.1:3000/api/contacts/${contact_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });            
            setContacts(contacts.filter(contact => contact.contact_id !== contact_id));
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert('You have been logged out. Please login again.');
                navigate('/login');

            } else {
                console.error('Error deleting contact:', error);
            }
        }
    };

    const handleEdit = async (contact_id) => {
        const token = localStorage.getItem('token');
        const contact = contacts.find(contact => contact.contact_id === contact_id);
        const updatedContact = {
            ...contact, 
            FirstName: prompt('New First Name:', contact.FirstName),
            LastName: prompt('New Last Name:', contact.LastName), 
            Phone_Number: prompt('New Phone Number:', contact.Phone_Number), 
            contact_Email: prompt('New Email:', contact.contact_Email)
        };
        try {
            await axios.put(`http://127.0.0.1:3000/api/contacts/${contact_id}`, updatedContact, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                } 
            }); 
            setContacts(contacts.map(contact => contact.contact_id === contact_id ? updatedContact : contact)); 
        } catch (error) { 
            if (error.response && error.response.status === 403) { 
                alert('You have been logged out. Please login again.'); 
                navigate('/login');

            } else { 
                console.error('Error updating contact:', error); 
            } 
        } 
    };

    const handleButtonClick = () => {
        navigate('/Add-Contact');
      };

    return (
        <><div>
            <NavBar />

            <h1>Contacts</h1>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                {contacts.map(contact => (
                    <tr key={contact.contact_id}>
                        <td scope="row">{contact.FirstName} </td>  
                        <td scope="row">{contact.LastName}</td>
                        <td scope="row">{contact.Phone_Number}</td>
                        <td scope="row">{contact.contact_Email}</td>
                    </tr>
                ))}
                </tbody>
                
            </table>
        </div>
        <div>
            <button onClick={handleButtonClick}>Add New Contact</button>
        </div>
        </>

    );
};

export default Main;