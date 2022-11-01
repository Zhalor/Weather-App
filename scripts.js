async function getWeather(city, unit) {
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=03bba837610ec0c4d9d49862f2c39baf&units=imperial`);
  const data = await response.json();
  const weather = {
    location: data.name,
    description: data.weather[0].description,
    temperature: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    wind_speed: data.wind.speed
  };
  return weather;
}

function populateDOM(key, value) {
  const div = document.getElementById(key).childNodes;
  let header = formatHeader(key)
  let data = formatData(value, header);
  div[1].innerText = header;
  div[3].innerText = data;
}

function formatHeader(key) {
  if(key.includes("_")) {
    const arr = key.split("_");
    const newArr = [];
    for(let item of arr) {
      newArr.push(item[0].toUpperCase() + item.slice(1).toLowerCase());
    }
    let header = newArr.join(' ');
    return header;
  }
  return key[0].toUpperCase() + key.slice(1).toLowerCase();
}

function formatData(value, header) {
  if(isNaN(value) && value.includes(" ")) {
    const arr = value.split(" ");
    const newArr = [];
    for(let item of arr) {
      newArr.push(item[0].toUpperCase() + item.slice(1).toLowerCase());
    }
    let data = newArr.join(' ');
    return data;
  }
  switch(header) {
    case 'Temperature':
      return value + ' \u00B0F'
    case 'Feels Like':
      return value + ' \u00B0F'
    case 'Humidity':
      return value + '%'
    case 'Wind Speed':
      return value + ' MPH'
  }
  return value
}

const btn = document.querySelector('button');
const input = document.querySelector('input[type="text"]');
btn.addEventListener('click', () => {
  getWeather(input.value).then(weatherInfo => {
    for(let [key, value] of Object.entries(weatherInfo)) {
      populateDOM(key, value);
    }
  });
});