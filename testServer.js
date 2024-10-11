const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

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




app.get('/api/contacts', (req, res) => {
    const { FirstName, LastName, Phone_Number, contact_Email } = req.query;
    let sql = 'SELECT * FROM `phone book`';
    const params = [];

    if (FirstName || LastName || Phone_Number || contact_Email) {
        sql += ' WHERE';
        const conditions = [];

        if (FirstName) {
            conditions.push(' `FirstName` LIKE ?');
            params.push(`%${FirstName}%`);
        }

        if (LastName) {
            if (conditions.length > 0) sql += ' AND';
            conditions.push(' `LastName` LIKE ?');
            params.push(`%${LastName}%`);
        }

        if (Phone_Number) {
            if (conditions.length > 0) sql += ' AND';
            conditions.push(' `Phone_Number` LIKE ?');
            params.push(`%${Phone_Number}%`);
        }

        if (contact_Email) {
            if (conditions.length > 0) sql += ' AND';
            conditions.push(' `User_Email` LIKE ?');
            params.push(`%${User_Email}%`);
        }

        sql += conditions.join(' AND');
    }

    db.query(sql, params, (err, results) => {    
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
});

        
app.post('/api/contacts', (req, res) => {
    const { FirstName, LastName, Phone_Number, contact_Email } = req.body;
    const sql = 'Insert Into `phone book` (FirstName, LastName, Phone_Number, contact_Email) Values (?, ?, ?, ?, ?)';
    db.query(sql, [FirstName, LastName, Phone_Number, contact_Email], (err, results) => {
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

app.get ('/api/contacts/:contact_id', (req, res) => {
    const ContactId = req.params.contact_id;
    const sql = 'Select * From `phone book` Where contact_id = ?';
    db.query(sql, [ContactId], (err, results) => {
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

app.put ('/api/contacts/:contact_id', (req, res) => {
    const ContactId = req.params.contact_id;
    const {FirstName, LastName, Phone_Number, contact_Email} = req.body;
    const sql = 'Update `phone book` Set FirstName = ?, LastName = ?, Phone_Number = ?, User_Email = ? Where contact_id = ?';
    db.query(sql, [FirstName, LastName, Phone_Number, contact_Email, ContactId], (err, results) => {
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

app.delete('/api/contact/:contact_id', (req, res) => {
    const ContactId = req.params.contact_id;
    const sql = 'Delete From `phone book` Where contact_id = ?';
    db.query(sql, [ContactId], (err, results) => {
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
