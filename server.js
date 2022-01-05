// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('public'));


// Setup Server
const PORT = process.env.PORT || 8000;
const listening = () => {
  console.log('Server is running....');
  console.log(`Running on port ${PORT}`)
}
app.listen(PORT, listening);

// POST Request to Set Weather Journaling Data

app.post('/addWeatherData', (req, res) => {
  const weatherJournalData = req.body;
  projectData.location = weatherJournalData.location;
  projectData.temp = weatherJournalData.temp;
  projectData.feelings = weatherJournalData.feelings;
  projectData.date = weatherJournalData.date;
  projectData.iconURL = weatherJournalData.iconURL;
  console.log(projectData);
  res.send('Data Posted Successfully');
})


// // GET Request

app.get('/getRecentUserEntry', (req, res) => {
  res.send(projectData);
})