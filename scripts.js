async function getWeather(city) {
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=03bba837610ec0c4d9d49862f2c39baf&units=imperial`);
  const weather = await response.json();
  console.log(weather);
  return weather;
}

const btn = document.querySelector('button');
const input = document.querySelector('input[type="text"]');
btn.addEventListener('click', () => {
  getWeather(input.value).then(resolve => {
    const h1 = document.createElement('h1');
    h1.innerText = `It is ${resolve.main.temp} degrees in ${resolve.name}.`;
    document.getElementById('weather-data-container').append(h1);
  });
});

