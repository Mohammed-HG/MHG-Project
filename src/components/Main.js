import React, {useState, useEffect} from "react";
import axios from "axios";

const Main = () => {
    const [contacts, setcontacts] = useState([]);
    const [newContact, setnewContact] = useState({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please login.');
             return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:3000/api/contacts', {
                    headers: { 'Authorization': `Bearer ${token}`
                }
            });
            setcontacts(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized. Please login again.');
            } else {
                console.error('Error fetching contacts:', error);
            }
        }
    };

    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/contacts', newContact,{
                headers: {
                    'Authorization': `Bearer ${token}`
            }
    });
        setcontacts([...contacts, response.data]);
        setnewContact({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert('Unauthorized. Please login again.');
        } else {
            console.error('Error adding contact:', error);
        }
    }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete('http://127.0.0.1:3000/api/contacts/${contact_id}', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setcontacts(contacts.filter(contact => contact.id !== id));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized. Please login again.');
            } else {
                console.error('Error deleting contact:', error);
            }
        }
    };

    const handleEdit = async (id) => {
        const token = localStorage.getItem('token');
        const contact = contacts.find(contact => contact.id === id);
        const updatedContact = {
            ...contact, 
            FirstName: prompt('New First Name:', contact.FirstName),
            LastName: prompt('New Last Name:', contact.LastName), 
            Phone_Number: prompt('New Phone Number:', contact.Phone_Number), 
            contact_Email: prompt('New Email:', contact.contact_Email)
        };
        try {
            await axios.put('http://127.0.0.1:3000/api/contacts/:contact_id', updatedContact, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                } 
            }); 
            setcontacts(contacts.map(contact => contact.id === id ? updatedContact : contact)); 
        } catch (error) { 
            if (error.response && error.response.status === 401) { 
                alert('Unauthorized. Please login again.'); 
            } else { 
                console.error('Error updating contact:', error); 
            } 
        } 
    };

    return (
        <div>
            <h1>Contacts</h1>
            <ul>
                {contacts.map(contact => (
                    <li key = {contact.id}>
                        {contact.FirstName} ({contact.contact_Email})
                        <button onClick={() => handleEdit(contact.id)}>Edit</button>
                        <button onClick={() => handleDelete(contact.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>Add New Contact</h2>
            <input
            type="text"
            placeholder="FirstName"
            value={newContact.FirstName}
            onChange={(e) => setnewContact({...newContact, FirstName: e.target.value})}
            />

            <input
            type="text"
            placeholder="LastName"
            value={newContact.LastName}
            onChange={(e) => setnewContact({...newContact, LastName: e.target.value})}
            />

            <input
            type="text"
            placeholder="Phone Number"
            value={newContact.Phone_Number}
            onChange={(e) => setnewContact({...newContact, Phone_Number: e.target.value})}
            />

            <input
            type="text"
            placeholder="Email"
            value={newContact.contact_Email}
            onChange={(e) => setnewContact({...newContact, contact_Email: e.target.value})}
            />

            <button onClick={handleAdd}>Add Contact</button>
        </div>
    );
};

export default Main;