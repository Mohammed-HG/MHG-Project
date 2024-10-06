const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({

    host: '127.0.0.1',
    user: 'root',
    password: '7253MHG7253mhg@!',
    database: 'new_schema'
}) ;

db.connect ((err) => {
    if (err) { 
        console.error('Error connecting to the database:', err);
    }
    else {
        console.log('Connected to the database!');
    }
});

app.get('/api/phonebook', (req, res) => {
    const sql = 'Select * From `phone book`';
    db.query(sql, (err, results)=> {    
        if (err) {
            console.error('Error fetching data:', err)
            res.status(500).json({ error: 'Internal server error'});
        }
        else {
            res.json(results);
        }
    });
});

app.get ('/api/phonebook/:user_id', (req, res) => {
    const UserId = req.params.user_id;
    const sql = 'Select * From `phone book` Where user_id = ?';
    db.query(sql, [UserId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            res.json(results[0]);
        }; 
    });
});

app.put ('/api/phonebook/:user_id', (req, res) => {
    const UserId = req.params.user_id;
    const {FirstName, LastName, Phone_Number, User_Email} = req.body;
    const sql = 'Update `phone book` Set FirstName = ?, LastName = ?, Phone_Number = ?, User_Email = ? Where user_id = ?';
    db.query(sql, [FirstName, LastName, Phone_Number, User_Email, UserId], (err, result) => {
        if (err) {
            console.error('Error Updating Data:', err);
            res.status(500).json({error: 'Internal server error' });
        }else if (results.affectRows === 0) {
            res.status(404).json({error: 'Contact not found'});
        }else {
            res.json({massage: 'Contact updated successfully'});
        } ;
     });Server 
});

app.delete('/api/phonebook/:user_id', (req, res) => {
    const UserId = req.params.user_id;
    const sql = 'Delete From `phone book` Where user_id = ?';
    db.query(sql, [UserId], (err, results) => {
        if (err) {
            console.error('Error Deleting Data:', err);
            res.status(500).json({Error: 'Internal Server Error'});
        } else if (results.affectRows === 0) {
            res.status(404).json({Error: 'Contact Not Found'});
        }else {
            res.json({massage: 'Contact deleted successfully'});
        }
    });
});
 
app.get('fetch-contact/:user_id', (req, res) => {
    const UserId = req.params.user_id;
    const url = `http://127.0.0.1:3000/api/phonebook/${UserId}`;

    axios.get(url)
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
});

 app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
