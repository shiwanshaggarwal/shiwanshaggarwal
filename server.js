const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
app.use(bodyParser.json());  // Middleware to parse JSON

// Connect to MongoDB (replace the connection string with your own)
mongoose.connect('mongodb+srv://shiwanshaggarwal2004:YPvS4SDJwKc59iUv@cluster0.ueomq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB Atlas:', err));

// Define the DeviceData schema and model
const deviceDataSchema = new mongoose.Schema({
    deviceno: Number,
    date: String,  // Use String to store date in "YYYY-MM-DD" format
    time: String,  // Use String to store time in "HH:MM:SS" format
    ch1: Number,   // Storing byte values as numbers
    ch2: Number,
    ch3: Number,
    ch4: Number,
    ch5: Number,
    ch6: Number,
    ch7: Number,
    ch8: Number,
    prevtime: Number, // Store the previous time as an integer
    logdate: String,  // Field for the current date in "YY/MM/DD" format
    longtime: String, // Field for the current time in "HH:MM:SS" (24-hour format)
});

const DeviceData = mongoose.model('DeviceData', deviceDataSchema);

// Function to get current Indian date and time in required formats
function getCurrentIndianDateTime() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata' };

    // Format date in "YY/MM/DD" (two-digit year)
    const year = now.toLocaleDateString('en-IN', { ...options, year: '2-digit' });
    const month = String(now.getMonth() + 1).padStart(2, '0');  // Add leading zero for single-digit months
    const day = String(now.getDate()).padStart(2, '0');         // Add leading zero for single-digit days
    const logdate = `${year}/${month}/${day}`;

    // Format time in "HH:MM:SS" (24-hour format)
    const longtime = now.toLocaleTimeString('en-IN', { ...options, hour12: false });

    return { logdate, longtime };
}

// API endpoint to accept POST request
app.post('/add-user', async (req, res) => {
    console.log('Received POST request');
    console.log('Request body:', req.body);

    const { deviceno, date, time, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, prevtime } = req.body;

    // Get current Indian date and time for logdate and longtime
    const { logdate, longtime } = getCurrentIndianDateTime();

    // Create a new document
    const newDeviceData = new DeviceData({
        deviceno,
        date,
        time,
        ch1,
        ch2,
        ch3,
        ch4,
        ch5,
        ch6,
        ch7,
        ch8,
        prevtime,
        logdate,  // Add current date in YY/MM/DD format
        longtime, // Add current time in 24-hour HH:MM:SS format
    });

    try {
        // Save the document in the collection
        const savedData = await newDeviceData.save();
        console.log('Data saved to MongoDB:', savedData);
        res.status(201).send('Device data added successfully');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send('Error saving device data to database');
    }
});

// Use the port provided by Render or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
