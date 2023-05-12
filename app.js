const express = require ('express');
const app = express();
const requestFormats = require('./requestFormats');
const responseFormats = require('./responseFormats');
const axios = require('axios');

const morgan = require('morgan');


const {  getWeatherForecast, getWeatherHistory } = require('./weather');


const bodyParser = require('body-parser');
const currentWeatherRequestFormat = require('./requestFormats').currentWeather;
const currentWeatherResponseFormat = require('./responseFormats').currentWeather;



app.use('/post',()=>{
    console.log("Middlewear running");
});

//routes
app.get ('/', (req,res)=>{
res.send('Home');   
});

app.get ('/post', (req,res)=>{
    res.send('post');   
    });

//MIDDLEWEAR FOR LOGGING
    app.use(morgan('tiny'));

// 1. Defining API Endpoints
async function getCurrentWeather(location) {
  // Make a request to the OpenWeatherMap API to retrieve the current weather data
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: location, // Specify the location as a query parameter
      appid: 'your_api_key_here', // Replace with your actual API key
      units: 'metric' // Specify units as metric or imperial
    }
  });

  // Extract the relevant data from the API response and return it as a JSON object
  const weatherData = {
    location: response.data.name,
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    conditions: response.data.weather[0].description
  };

  return weatherData;
}






app.get('/weather/current', (req, res) => {
  const city = req.query.location;

  // Check if city is provided
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  // Make API call to get weather data
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => {
      // Extract relevant data from API response
      const weatherData = {
        location: response.data.name,
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        conditions: response.data.weather[0].description
      };

      // Send weather data as response
      res.json(weatherData);
    })
    .catch(error => {
      // Handle error from API call
      if (error.response && error.response.status === 404) {
        res.status(404).json({ error: 'City not found' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
});


app.get('/weather/forecast', async (req, res) => {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ error: 'Please provide a location' });
    }

    const forecastData = await weather.getWeatherForecast(location);
    res.json(forecastData);
  } catch (error) {
    console.error(error);
    if (error.response) {
      res.status(400).json({ error: `Unable to get forecast data for ${location}` });
    } else {
      res.status(500).json({ error: 'Something went wrong. Please try again later' });
    }
  }
});




app.get('/weather/history', async (req, res) => {
  // Extract the location and timestamps from the query parameters
  const location = {
    lat: req.query.lat,
    lon: req.query.lon
  };
  const startTimestamp = req.query.start;
  const endTimestamp = req.query.end;

  try {
    // Call the getWeatherHistory function from weather.js to retrieve the weather history data for the specified location and timestamps
    const historyData = await getWeatherHistory(location, startTimestamp, endTimestamp);

    // Return the weather history data in JSON format
    res.json(historyData);
  } catch (error) {
    // Handle errors by returning an error message in JSON format
    res.status(500).json({ error: 'Unable to retrieve weather history data' });
  }
});



  
      
     
     



//listening
app.listen(3001);