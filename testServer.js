const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//Here DataBase Connection
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

// endpoint for register
app.post('/api/register', async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const sql = 'Insert Into `phonebookusers` (UserName, UserPass) Values (?, ?)'; 

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error Registering User:', err);
            return res.status(500).json({error:'Internal Server Error'});
        }
        res.status(201).send('User Registered');
    })
})

//endpoint for login
app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    const sql = 'Select * From `phonebookusers` Where UserName = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error Fetching User:', err);
            return res.status(500).json({error:'Internal Server Error'});
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid Credentials');
        }
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.UserPass);

        if (isPasswordValid) {
            const token = jwt.sign({username: user.UserName},'your_jwt_secret', {expiresIn: '1h'});
            res.json({token});
        }else {
            res.status(401).send('Invalid Credentials');
        }
    })
})

//endpoint for Get All\Search
app.get('/api/contacts', authenticateToken, (req, res) => {
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
            conditions.push(' `contact_Email` LIKE ?');
            params.push(`%${contact_Email}%`);
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

//endpoint for Insert New Contact on DataBase        
app.post('/api/contacts', authenticateToken, (req, res) => {
    const { FirstName, LastName, Phone_Number, contact_Email } = req.body;
    const sql = 'Insert Into `phone book` (FirstName, LastName, Phone_Number, contact_Email) Values (?, ?, ?, ?)';
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

//endpoint for Search by Id
app.get ('/api/contacts/:contact_id', authenticateToken, (req, res) => {
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

//endpoint for Update Contact On DataBase
app.put ('/api/contacts/:contact_id', authenticateToken, (req, res) => {
    const ContactId = req.params.contact_id;
    const {FirstName, LastName, Phone_Number, contact_Email} = req.body;
    const sql = 'Update `phone book` Set FirstName = ?, LastName = ?, Phone_Number = ?, contact_Email = ? Where contact_id = ?';
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

// endpoint for delete Contact
app.delete('/api/contacts/:contact_id', authenticateToken ,(req, res) => {
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
 
//Secure MiddleWare
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ') [1];
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) 
            {console.log('Token verification failed:', err);
            return res.sendStatus(403);
            }
        req.user = user;
        next();
    });
}

 app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
