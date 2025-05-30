const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/trialdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import User model from users.js
const User = require('./users');

// Register Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists.' });
        } else {
            res.status(500).json({ message: 'Server error.' });
        }
    }
});

const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Starting server.js...');
});