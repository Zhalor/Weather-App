async function getWeather(city, unit) {
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=03bba837610ec0c4d9d49862f2c39baf&units=${unit}`);
    const data = await response.json();
    console.log(data);
    const weather = {
    location: data.name,
    description: data.weather[0].description,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
    };
    return weather;
  } catch(err) {
    console.log('Error. City not found.');
  }
}

function populateDOM(weatherData) {
  const title = document.getElementById('title').childNodes;
  const feelsLike = document.getElementById('feels-like').childNodes
  const humidity = document.getElementById('humidity').childNodes
  const windSpeed = document.getElementById('wind-speed').childNodes
  title[1].innerText = weatherData.location;
  title[3].innerText = weatherData.description;
  title[5].innerText = weatherData.temperature;
  feelsLike[1].innerText = 'Feels Like';
  feelsLike[3].innerText = weatherData.feelsLike;
  humidity[1].innerText = 'Humidity';
  humidity[3].innerText = weatherData.humidity;
  windSpeed[1].innerText = 'Wind Speed';
  windSpeed[3].innerText = weatherData.windSpeed;
}

function formatData(value, header, unit) {
  if(isNaN(value) && value.includes(" ")) {
    const arr = value.split(" ");
    const newArr = [];
    for(let item of arr) {
      newArr.push(item[0].toUpperCase() + item.slice(1).toLowerCase());
    }
    let data = newArr.join(' ');
    return data;
  }
  
  if(unit === "imperial"){
    switch(header) {
      case 'temperature':
        return value + ' \u00B0F'
      case 'feelsLike':
        return value + ' \u00B0F'
      case 'humidity':
        return value + '%'
      case 'windSpeed':
        return value + ' MPH'
    }
  } else {
    switch(header) {
      case 'temperature':
        return value + ' \u00B0C'
      case 'feelsLike':
        return value + ' \u00B0C'
      case 'humidity':
        return value + '%'
      case 'windSpeed':
        return value + ' MPS'
    }
  }
  return value
}

const btn = document.querySelector('button');
const input = document.querySelector('input[type="text"]');
btn.addEventListener('click', () => {
  let unit = document.querySelector('input[type=radio]:checked').value;
  getWeather(input.value, unit).then(weatherInfo => {
    let formattedWeatherInfo = {};
    for(let [key, value] of Object.entries(weatherInfo)) {
      let data = formatData(value, key, unit);
      formattedWeatherInfo[key] = data;
    }
    populateDOM(formattedWeatherInfo);
  });
});