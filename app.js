const express = require ('express');
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
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

// 1. Defining API Endpoints and Functions

app.get('/weather/current', async (req, res) => {
  const city = req.query.location;

  // Check if city is provided
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    
    const weatherData = await getCurrentWeather(city);

    
    res.json(weatherData);
  } catch (error) {
    // Handle error from API call
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});






async function getCurrentWeather(location) {
  // Make a request to the OpenWeatherMap API 
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: location, 
      appid: 'c8f116ad29c75d4fb553a21010d281be', 
      units: 'metric' 
    }
  });

  // return as a JSON
  const weatherData = {
    location: response.data.name,
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    conditions: response.data.weather[0].description
  };

  return weatherData;
}









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
    // Call the getWeatherHistory function from weather.js 
    const historyData = await getWeatherHistory(location, startTimestamp, endTimestamp);

    // Return the weather history data in JSON format
    res.json(historyData);
  } catch (error) {
    // Handle errors 
    res.status(500).json({ error: 'Unable to retrieve weather history data' });
  }
});







/**
 * @swagger
 * /weather/{location}:
 *   get:
 *     summary: Get weather forecast for a location
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         description: The location to get the weather forecast for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherForecast'
 */
app.get('/weather/:location', async (req, res, next) => {
  try {
    const location = req.params.location;
    const forecastData = await getWeatherForecast(location);
    res.json(forecastData);
  } catch (error) {
    next(error);
  }
});


const options ={
  definition : {
    openapi:"3.0.0",
    info: {
title: "Weather API",
version:"0.1.0",
description:"This is a simple weather API made in NodeJs"
    },
    servers: [
      {
        ulr: "http://localhost:3001/"
      }
    ]
  },
  apis:["/app.js"],
};
  
      

     
    const spacs = swaggerjsdoc(options)
app.use(
  "/api-docs", 
  swaggerui.serve,
  swaggerui.setup(spacs)
)






//listening
app.listen(3001);