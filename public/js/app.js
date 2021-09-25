class WeatherAPI {
  static API_KEY = '4b806ae0b31d1554da7dd7d975789281';
  static baseURL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&zip=';

  static getWeatherInfo = async (baseURL, zipCode, API_KEY) => {
    const response = await fetch(`${baseURL}${zipCode}&appid=${API_KEY}`);

    try {
      const weatherData = response.json();
      return weatherData;
    } catch (err) {
      console.log('Error: ', err)
    }
  }
}

class UI {
  static userForm = document.querySelector('#user-form');
  static zipInput = document.querySelector('#zip');
  static feelingsInput = document.querySelector('#feelings');
  static userFeelings = document.querySelector('.user-feelings p');
  static weatherTemp = document.querySelector('.weather-info .temp-value');
  static weatherIcon = document.querySelector('.weather-info .weather-icon');
  static entryDate = document.querySelector('.weather-info .date');
  static userLocation = document.querySelector('.weather-info .location');

  static render = async () => {
    const response = await fetch('/getRecentUserEntry');

    try {
      const recentUserEntry = await response.json();
      console.log(recentUserEntry);
      UI.userFeelings.innerHTML = recentUserEntry.feelings;
      UI.weatherTemp.innerHTML = recentUserEntry.temp;
      UI.weatherIcon.src = recentUserEntry.iconURL;
      UI.userLocation.innerHTML = recentUserEntry.location;
      UI.entryDate.innerHTML = recentUserEntry.date;
    } catch (err) {
      console.log('Error: ', err);
    }
  }
}

const postWeatherData = async (url = '', weatherData = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(weatherData)
  });

  try {
    console.log(response);
    const resState = await response.json();
    return resState;
  } catch (err) {
    console.log('Error: ', err)
  }
}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/*
** Events **
*/

UI.userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const zipCode = UI.zipInput.value;
  const userFeelings = UI.feelingsInput.value;
  if ((zipCode || userFeelings) == '') return;
  WeatherAPI.getWeatherInfo(WeatherAPI.baseURL, zipCode, WeatherAPI.API_KEY)
  .then(weatherData => {
      if (weatherData.cod === "404") throw new Error('The city is not found');
      postWeatherData('/addWeatherData', {
        temp: weatherData.main.temp,
        location: `${weatherData.name}, ${weatherData.sys.country}`,
        iconURL: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`,
        date: newDate,
        feelings: userFeelings
    })
    .then(() => {
        UI.render();
    })
    .catch( err => {
      console.log('Error: ', err)
    });
  })


})