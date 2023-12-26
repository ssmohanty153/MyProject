const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const app = express();
const PORT = 3008;
const SECRET_KEY = 'your-secret-key'; // Change this to a secure secret key in production

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// In-memory user database (replace this with a proper database in production)
const users = [
    { id: 1, username: 'user1', password: '$2a$10$XVk06VL48BFAbZVvc75Ho.3InxAJ0twtMPhMwDKdcQzysOCPm6K4e' }, // Password: password1
    { id: 2, username: 'user2', password: '$2a$10$ibDjlRm7UCzGPbK8Aqj.cewuRtQOlWIIkDl9M5eGDWZcC9a3BgeUa' }, // Password: password2
];

// Middleware for authentication
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        console.log('No token found. Unauthorized.');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'shhh');

        console.log(decoded.userId)
        const user = users.find(user => user.id === decoded.userId);
        req.user = user.username;
        console.log('User authenticated:', user.username);
        next();
    } catch (error) {
        console.error('Failed to authenticate user:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Routes
app.post('/api/register', async (req, res) => {
    console.log('Received registration request:', req.body);

    const { username, password } = req.body;

    // Check if the username already exists
    if (users.some((user) => user.username === username)) {
        console.log('Username already exists. Registration failed.');
        return res.status(400).json({ message: 'Username already exists' });
    }

    try {
        // Hash the password only if it's new or has been modified
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add the new user to the database
        const newUser = { id: users.length + 1, username, password: hashedPassword };

        console.log(newUser, "newUsernewUser")
        users.push(newUser);

        // Generate and attach a token to the user
        const token = jwt.sign({ userId: newUser.id }, 'shhh', {
            expiresIn: '1h',
        });
        newUser.token = token;
        const responseUser = {
            id: newUser.id,
            username: newUser.username,
            token: newUser.token,
        };
        console.log('User registered successfully:', responseUser);
        res.status(201).json(responseUser);
    } catch (error) {
        console.error('Registration failed:', error.message);
        res.status(500).json({ message: 'Registration failed' });
    }
});


app.post('/api/login', async (req, res) => {

    try {
        const { username, password } = req.body;
        console.log(username, "popkpokpokpk")
        const user = users.find(user => user.username === username);
        console.log(user, "user")
        if (!user) {
            console.log("user")
            return res.status(401).json({ error: 'Authentication failed' });
        }
        console.log(password, "opkooioij")

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch, "passwordMatch")
        if (!passwordMatch) {
            console.log("password")
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user.id }, "shhh",//'your-secret-key',
            {
                expiresIn: '1h',
            });
        //cookies section 

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.status(200).cookie("token", token, options).json({
            success: true,
            token,
            user
        })
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});



app.get('/api/logout', (req, res) => {
    console.log('Received logout request.');

    // Clear the cookie to log out the user
    res.clearCookie('token');
    console.log('User logged out successfully.');
    res.sendStatus(200);
});

app.get('/api/data', authenticateUser, (req, res) => {
    console.log('Received request for protected data from user:', req.user);

    // Protected route, accessible only with a valid JWT
    res.json({ message: 'Protected data', user: req.user });
});

app.post('/api/submit-employee', authenticateUser, (req, res) => {
    try {
        const { name, id, department } = req.body;

        // CSV file path
        const csvFilePath = 'employee_data.csv';

        // Check if the CSV file exists; if not, create it with header
        if (!fs.existsSync(csvFilePath)) {
            const csvWriter = createCsvWriter({
                path: csvFilePath,
                header: [
                    { id: 'Name', title: 'Name' },
                    { id: 'ID', title: 'ID' },
                    { id: 'Department', title: 'Department' },
                ],
                append: true, // Append to the existing file
            });

            csvWriter.writeRecords([]); // Write an empty array to create the header
        }

        // Append the new data to the CSV file
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'Name', title: 'Name' },
                { id: 'ID', title: 'ID' },
                { id: 'Department', title: 'Department' },
            ],
            append: true, // Append to the existing file
        });

        csvWriter.writeRecords([{ Name: name, ID: id, Department: department }])
            .then(() => {
                console.log('Data written to CSV file');
                res.status(200).send('Data written to CSV file');
            })
            .catch((error) => {
                console.error('Error writing to CSV file:', error);
                res.status(500).send('Internal Server Error');
            });
    } catch (error) {
        console.error('Error processing employee data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
