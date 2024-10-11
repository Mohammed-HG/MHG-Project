const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact manager.html'));
})

app.get('/api/contacts', (req, res) => {
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

app.post('/api/contacts', (req, res) => {
    const { FirstName, LastName, Phone_Number, User_Email } = req.body;
    const sql = 'Insert Into `phone book` (FirstName, LastName, Phone_Number, User_Email) Values (?, ?, ?, ?, ?)';
    db.query(sql, [FirstName, LastName, Phone_Number, User_Email], (err, results) => {
        if (err) {
            console.error('Error Adding New User');
            res.status(500).json({error:'Internal Server Error'});
        }else if (results.affectedRows === 0) {
            res.status(400).json({error: 'Contact was not added'})
        }else {
            res.status(201).json({ message: 'Contact added successfully', contactId: results.insertId });
        }
    })
})

app.get ('/api/contacts/:user_id', (req, res) => {
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

app.put ('/api/contacts/:user_id', (req, res) => {
    const UserId = req.params.user_id;
    const {FirstName, LastName, Phone_Number, User_Email} = req.body;
    const sql = 'Update `phone book` Set FirstName = ?, LastName = ?, Phone_Number = ?, User_Email = ? Where user_id = ?';
    db.query(sql, [FirstName, LastName, Phone_Number, User_Email, UserId], (err, results) => {
        if (err) {
            console.error('Error Updating Data:', err);
            res.status(500).json({error: 'Internal server error' });
        }else if (results.affectedRows === 0) {
            res.status(404).json({error: 'Contact not found'});
        }else {
            res.json({message: 'Contact updated successfully'});
        } ;
     });
});

app.delete('/api/contact/:user_id', (req, res) => {
    const UserId = req.params.user_id;
    const sql = 'Delete From `phone book` Where user_id = ?';
    db.query(sql, [UserId], (err, results) => {
        if (err) {
            console.error('Error Deleting Data:', err);
            res.status(500).json({Error: 'Internal Server Error'});
        } else if (results.affectRows === 0) {
            res.status(404).json({Error: 'Contact Not Found'});
        }else {
            res.json({message: 'Contact deleted successfully'});
        }
    });
});
 
 app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
