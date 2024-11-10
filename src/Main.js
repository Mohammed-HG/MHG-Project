import React, {useState, useEffect} from "react";
import axios from "axios";

const Main = () => {
    const [contacts, setcontacts] = useState([]);
    const [newContact, setnewContact] = useState({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        const response = await axios.get('http://127.0.0.1:3000/api/contacts');
        setcontacts(response.data);
    };

    const handleAdd = async () => {
        const response = await axios.post('http://127.0.0.1:3000/api/contacts', newContact);
        setcontacts([...contacts, response.data]);
        setnewContact({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});
    };

    const handleDelete = async (id) => {
        await axios.delete('http://127.0.0.1:3000/api/contacts/:contact_id');
        setcontacts(contacts.filter(contact => contact.id !== id));
    };

    const handleEdit = async (id) => {
        const contact = contacts.find(contact => contact.id === id);
        const updatedContact = {...contact, FirstName: prompt('New First Name:', contact.FirstName), LastName: prompt('New Last Name:', contact.LastName), Phone_Number: prompt('New Phone Number:', contact.Phone_Number), contact_Email: prompt('New Email:', contact.contact_Email)};
        await axios.put('http://127.0.0.1:3000/api/contacts/:contact_id', updatedContact);
        setcontacts(contacts.map(contact => contact.id === id ? updatedContact : contact ));
    };

    return (
        <div>
            <h1>Contacts</h1>
            <url>
                {contacts.map(contact => (
                    <li key = {contact.id}>
                        {contact.FirstName} ({contact.contact_Email})
                        <button onClick={() => handleEdit(contact.id)}>Edit</button>
                        <button onClick={() => handleDelete(contact.id)}>Delete</button>
                    </li>
                ))}
            </url>

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
            value={newContact.LastName}
            onChange={(e) => setnewContact({...newContact, Phone_Number: e.target.value})}
            />

            <input
            type="text"
            placeholder="Email"
            value={newContact.LastName}
            onChange={(e) => setnewContact({...newContact, contact_Email: e.target.value})}
            />

            <button onClick={handleAdd}>Add Contact</button>
        </div>
    );
};

export default Main;