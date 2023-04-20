async function fetchWeather(city, unit) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=03bba837610ec0c4d9d49862f2c39baf&units=${unit}`);
    const data = await response.json();
    const weather = {
      location: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      temperature: data.main.temp,
      high: data.main.temp_max,
      low: data.main.temp_min,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      timezone: data.timezone
    };
    return weather;
}

function populateDOM(weatherData) {
  const weatherDataContainer = document.getElementById('weather-data-container');
  const locationPara = document.getElementById('location');
  const timePara = document.getElementById('time');
  const tempH2 = document.getElementById('temp');
  const tempHighSpan = document.getElementById('temp-high');
  const tempLowSpan = document.getElementById('temp-low');
  const weatherIcon = document.getElementById('weather-icon');
  const descPara = document.getElementById('description');
  const feelsLikeSpan = document.getElementById('feels-like');
  const humidityPara = document.getElementById('humidity');
  const windSpeedPara = document.getElementById('wind-speed');
  
  weatherDataContainer.style.display = 'flex';
  locationPara.innerText = `${weatherData.location}, ${weatherData.country}`;
  timePara.innerText = weatherData.timezone;
  tempH2.innerText = weatherData.temperature;
  tempHighSpan.innerText = weatherData.high;
  tempLowSpan.innerText = weatherData.low;
  weatherIcon.src = `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;
  descPara.innerText = weatherData.description;
  feelsLikeSpan.innerText = weatherData.feelsLike;
  humidityPara.innerText = weatherData.humidity;
  windSpeedPara.innerText = weatherData.windSpeed;
}

function formatData(value, key, unit) {
  if(isNaN(value) && value.includes(" ")) {
    const arr = value.split(" ");
    const newArr = [];
    for(let item of arr) {
      newArr.push(item[0].toUpperCase() + item.slice(1).toLowerCase());
    }
    let data = newArr.join(' ');
    return data;
  } else if(!isNaN(value)) {
    value = Math.round(value * 10) / 10;
  }
  
  if(unit === "imperial"){
    switch(key) {
      case 'temperature':
        return value + '\u00B0F'
      case 'high':
        return value + '\u00B0F'
      case 'low':
        return value + '\u00B0F'
      case 'feelsLike':
        return value + '\u00B0F'
      case 'humidity':
        return value + '%'
      case 'windSpeed':
        return value + ' MpH'
      case 'timezone':
        const date = new Date();
        let utcHours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let locationHours = (value / 60) / 60;
        let hours = locationHours > 0 ? locationHours + utcHours : "-" + (Math.abs(locationHours) - utcHours);
        if(hours > 24) {
          hours = hours - 24;
        } else if(hours < 0) {
          hours = 24 - Math.abs(hours) 
        }
        if(minutes < 10) {
          minutes = `0${minutes}`;
        }
        const localTime = hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;
        return localTime;
    }
  } else {
    switch(key) {
      case 'temperature':
        return value + '\u00B0C'
      case 'high':
        return value + '\u00B0C'
      case 'low':
        return value + '\u00B0C'
      case 'feelsLike':
        return value + '\u00B0C'
      case 'humidity':
        return value + '%'
      case 'windSpeed':
        return value + ' MpS'
      case 'timezone':
        const date = new Date();
        let utcHours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let locationHours = (value / 60) / 60;
        let hours = locationHours > 0 ? locationHours + utcHours : "-" + (Math.abs(locationHours) - utcHours);
        if(hours > 24) {
          hours = hours - 24;
        } else if(hours < 0) {
          hours = 24 - Math.abs(hours) 
        }
        if(minutes < 10) {
          minutes = `0${minutes}`;
        }
        const localTime = hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;
        return localTime;
    }
  }
  return value
}

function getWeather(city, unit) {
  fetchWeather(city, unit).then(weatherInfo => {
    let formattedWeatherInfo = {};
    for(let [key, value] of Object.entries(weatherInfo)) {
      let data = formatData(value, key, unit);
      formattedWeatherInfo[key] = data;
    }
    populateDOM(formattedWeatherInfo);
    input.value = '';
  }).catch(err => {
    document.getElementById('weather-data-container').style.display = 'none';
    document.getElementById('location').innerText = 'City not found';
    document.getElementById('time').innerText = '';
  });
}

const btn = document.querySelector('button');
const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');
const input = document.querySelector('input[type="text"]');
btn.addEventListener('click', () => {
  let unit = document.querySelector('input[type=radio]:checked').value;
  getWeather(input.value.trim(), unit);
});

celsiusBtn.addEventListener('click', () => {
  const location = document.getElementById('location');
  const city = location.innerText.split(',');
  getWeather(city[0], 'metric');
});

fahrenheitBtn.addEventListener('click', () => {
  const location = document.getElementById('location');
  const city = location.innerText.split(',');
  getWeather(city[0], 'imperial');
});