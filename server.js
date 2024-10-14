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
});

const DeviceData = mongoose.model('DeviceData', deviceDataSchema);

// API endpoint to accept POST request
app.post('/add-user', async (req, res) => {
    console.log('Received POST request');  // Debugging: log when POST request is received
    console.log('Request body:', req.body);  // Debugging: log the request body

    const { deviceno, date, time, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, prevtime } = req.body;

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
    });

    try {
        // Save the document in the collection
        const savedData = await newDeviceData.save();
        console.log('Data saved to MongoDB:', savedData);  // Debugging: log the saved data
        res.status(201).send('Device data added successfully');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);  // Debugging: log any error that occurs while saving
        res.status(500).send('Error saving device data to database');
    }
});

// Use the port provided by Render or default to 3000
const port = process.env.PORT || 3000;

// Bind to 0.0.0.0 for Render compatibility
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});