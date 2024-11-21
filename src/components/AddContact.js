import React, {useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

const AddContact = () => {
    const [contacts, setContacts] = useState([]);
    const [newContact, setnewContact] = useState({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});
    const navigate = useNavigate();
    
    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://127.0.0.1:3000/api/contacts', newContact,{
                headers: {
                    'Authorization': `Bearer ${token}`
            }
    });
        setContacts([...contacts, response.data]);
        setnewContact({FirstName: '', LastName: '', Phone_Number: '', contact_Email: ''});
        if (response.data){
            navigate('/Home')
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('You have been logged out. Please login again.');
            navigate('/login');

        } else {
            console.error('Error adding contact:', error);
        }
    }
    };

    return(
        <div>
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

export default AddContact;