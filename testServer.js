const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config();

const app = express();
const router = express.Router(); // Use the router
const PORT = process.env.PORT || 3000;

let userOTP = {}; // Store OTPs temporarily

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'your_session_secret', // Change this to a secure secret 
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false } // Set to true if using HTTPS 
    }));

// DataBase Connection
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

// Send OTP via phone function (Placeholder)
const sendOTPSMS = (phone, otp) => {
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
};

// Register endpoint 
app.post('/api/register', async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const sql = 'Insert Into `users` (UserName, UserPass) Values (?, ?)'; 

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error Registering User:', err);
            return res.status(500).json({error:'Internal Server Error'});
        }
        res.status(201).send('User Registered');
    })
})

// Login endpoint
app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    const sql = 'Select * From `users` Where UserName = ?';

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
            const token = jwt.sign({userId: user.UserId, username: user.UserName},'your_jwt_secret', {expiresIn: '1h'});
            res.json({token});
        }else {
            res.status(401).send('Invalid Credentials');
        }
    })
})

// Logout endpoint
router.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid', { path:'/'});
        res.status(200).json({ message: 'Logged out Succssfully' });
    });
});
app.use(router);

// Send OTP endpoint 
app.post('/api/send-otp', (req, res) => { 
    const { contact, type } = req.body; 
    const otp = crypto.randomInt(100000, 999999).toString(); 
    userOTP[contact] = otp; 

    sendOTPSMS(contact, otp); 
    res.status(200).send('OTP Sent'); 

}); 

// Verify OTP endpoint 
app.post('/api/verify-otp', authenticateToken, (req, res) => { 
    const { contact, otp } = req.body; 
        if (userOTP[contact] === otp) { 
            delete userOTP[contact]; 
            res.status(200).send('OTP Verified'); 
        } else { 
            res.status(400).send('Invalid OTP'); 
        }
});

//Get All Users endpoint
router.get('/api/users', authenticateToken, (req, res) => {
    const sql = 'Select UserId, UserName, isActive From users';

    db.query(sql,(err, results) => {
        if (err) {
            console.error('Error Fetching Users', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

//Get (Me) User endpoint
router.get('/api/users/me', authenticateToken, (req, res) => {
    const userId = req.user; // Accessing user ID from the token
    console.log('User ID from token:', userId); // Log userId to ensure it's correct
    const sql = 'Select `UserName`, `UserId` From `users` Where `UserId` = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error feching user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            res.json(results[0])
        } else {
            res.status(404).json({ message: 'User Not Found'});
        }
    });
});
module.exports = router;

//Activate User enpoint
router.put('/api/users/:userId/activate', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    const sql = 'Update users Set isActive = 1 Where UserId = ?';

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error Activating User:', err);
            return res.status(500).json({ error:'Internal server error' });
        }
        res.json({ message: 'User actvates successfully' });
    });
});

//Deactivate User endpoint
router.put('/api/users/:userId/deactivate', authenticateToken, (req, res) => {
    const userId = req.params.userId;
    const sql = 'Update users Set isActive = 0 Where UserId = ?';

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error deactivating user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'User deactivated successfully'});
    });
});
app.use(router);

// Get All\Search Contacts endpoint
app.get('/api/contacts', authenticateToken, (req, res) => {
    const { search } = req.query;  // Using 'search' as the query parameter
    const userId = req.user.userId;
    let sql = 'SELECT * FROM `contacts` WHERE `UserId` = ?';
    const params = [userId];

    if (search) {
        sql += ' AND (`FirstName` LIKE ? OR `LastName` LIKE ? OR `Phone_Number` LIKE ? OR `contact_Email` LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});


// Insert New Contact endpoint   
app.post('/api/contacts', authenticateToken, (req, res) => {
    const { FirstName, LastName, Phone_Number, contact_Email } = req.body;
    const userId = req.user.userId;
    const sql = 'Insert Into `contacts` (FirstName, LastName, Phone_Number, contact_Email, UserId) Values (?, ?, ?, ?, ? )';

    db.query(sql, [FirstName, LastName, Phone_Number, contact_Email, userId], (err, results) => {
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

// Search by Id endpoint
app.get ('/api/contacts/:contact_id', authenticateToken, (req, res) => {
    const ContactId = req.params.contact_id;
    const userId = req.user.userId;
    const sql = 'Select * From `contacts` Where contact_id = ? and UserId = ?';

    db.query(sql, [ContactId, userId], (err, results) => {
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

// Update Contact endpoint
app.put ('/api/contacts/:contact_id', authenticateToken, (req, res) => {
    const ContactId = req.params.contact_id;
    const userId = req.user.userId;
    const {FirstName, LastName, Phone_Number, contact_Email} = req.body;
    const sql = 'Update `contacts` Set FirstName = ?, LastName = ?, Phone_Number = ?, contact_Email = ? Where contact_id = ? and UserId = ?';

    db.query(sql, [FirstName, LastName, Phone_Number, contact_Email, ContactId, userId], (err, results) => {
        if (err) {
            console.error('Error Updating Data:', err);
            res.status(500).json({error: 'Internal server error' });
        }else if (results.affectedRows === 0) {
            res.status(404).json({error: 'Contact not found'});
        }else {
            res.json({message: 'Contact updated successfully', url: `/api/contacts/${ContactId}`});
        } ;
     });
});

// Delete Contact endpoint
app.delete('/api/contacts/:contact_id', authenticateToken ,(req, res) => {
    const ContactId = req.params.contact_id;
    const userId = req.user.userId; 
    const sql = 'Delete From `contacts` Where contact_id = ? and UserId = ?';

    db.query(sql, [ContactId, userId], (err, results) => {
        if (err) {
            console.error('Error Deleting Data:', err);
            res.status(500).json({Error: 'Internal Server Error'});
        } else if (results.affectedRows === 0) {
            res.status(404).json({Error: 'Contact Not Found'});
        }else {
            res.json({message: 'Contact deleted successfully'});
        }
    });
});

// MiddleWare function
function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ') [1];
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) 
            {console.log('Token verification failed:', err);
            return res.sendStatus(403);
            }
        console.log('User from token:', user);  
        req.user = user;
        next();
    });
}

 app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});