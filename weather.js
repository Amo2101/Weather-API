const axios = require('axios');

async function getWeatherForecast(location) {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const forecastData = response.data.list.map((item) => {
      return {
        date: item.dt_txt,
        temperature: item.main.temp,
        conditions: item.weather[0].description
      };
    });

    return forecastData;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Could not find weather forecast data for location '${location}'`);
    } else {
      throw new Error(`Failed to get weather forecast data for location '${location}'. Error message: ${error.message}`);
    }
  }
}




  
  async function getWeatherHistory(location, startTimestamp, endTimestamp) {
    // Make a request to the OpenWeatherMap API to retrieve the weather history data
    const response = await axios.get('https://api.openweathermap.org/data/2.5/onecall/timemachine', {
      params: {
        lat: location.lat, // Specify the latitude of the location
        lon: location.lon, // Specify the longitude of the location
        dt: startTimestamp, // Specify the start timestamp as a UNIX timestamp
        appid: 'your_api_key_here', // Replace with your actual API key
        units: 'metric' // Specify units as metric or imperial
      }
    });
  
    // Extract the relevant data from the API response and return it as a JSON object
    const historyData = response.data.hourly.map((weather) => {
      return {
        dateTime: new Date(weather.dt * 1000).toISOString(),
        temperature: weather.temp,
        humidity: weather.humidity,
        conditions: weather.weather[0].description
      };
    });
  
    return historyData;
  }
  
  module.exports = {  getWeatherForecast, getWeatherHistory };
