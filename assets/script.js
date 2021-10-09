const locationEl = document.getElementById("form-location"); 
const inputLocation = document.getElementById("input-location"); 
const forcastCards = document.getElementById("forecast-cards"); 
const dateTodayEl = document.getElementById("today-location-and-time"); 
const tempTodayEl = document.getElementById("today-temp"); 
const windTodayEl = document.getElementById("today-wind"); 
const humidityTodayEl = document.getElementById("today-humidity"); 
const uvTodayEl = document.getElementById("today-uv");

const apiKey = "7ce3aaebf9596e3d83f56d11cea28bb9"; 

locationEl.addEventListener('submit', function(event){
    event.preventDefault(); 

    const location = inputLocation.value;

    getWeather(location)
      .then(function(weatherData){

        tempTodayEl.textContent = toCelcius(weatherData.current.temp).toFixed(1) + ' C';
        windTodayEl.textContent = weatherData.current.wind_speed;
        humidityTodayEl.textContent = weatherData.current.humidity;
        uvTodayEl.textContent = weatherData.current.uvi;

        var fiveDaySlice = weatherData.daily.slice(1, 6)
        for (let index = 0; index < fiveDaySlice.length; index++) {
          const weather = fiveDaySlice[index];

          var weatherDate = moment.unix(weather.dt).format("DD/MM/YYYY");
          var weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`

          var weatherCard = createForecastCard(weatherDate ,weatherIcon , toCelcius(weather.temp.day).toFixed(1) + ' C' ,weather.wind_speed ,weather.humidity)         
          
          
          forcastCards.append(weatherCard)

          console.log(weatherCard)
        }
    })

})



function createUl(content){

  var makeUl = document.createElement("ul")
  makeUl.setAttribute("class", "li")
  makeUl.innerHTML = content

  return makeUl

}

function createForecastCard(date, icon, temp, wind, humidity){

  var mainDiv = document.createElement("div")
  mainDiv.setAttribute("class", "col col-4 card")

  var bodyDiv = document.createElement("div")
  bodyDiv.setAttribute("class", "card-body")
  mainDiv.appendChild(bodyDiv)

  var titleH4 = document.createElement("h4")
  titleH4.setAttribute("class", "card-title")
  titleH4.textContent = (date)
  bodyDiv.appendChild(titleH4)

  var textP = document.createElement("p")
  textP.setAttribute("class", "card-text")
  bodyDiv.appendChild(textP)

  var fiveDayEL= document.createElement("ul")
  fiveDayEL.setAttribute("class", "five-Day")

  var iconUl = createUl("icon " + `<img src="${icon}"></img>`)
  var tempUl = createUl("temp: " + temp)
  var windUl = createUl("wind: " + wind)
  var humidityUl = createUl("humidity: " + humidity)

  textP.append(fiveDayEL)

  textP.appendChild(iconUl)
  textP.appendChild(tempUl)
  textP.appendChild(windUl)
  textP.appendChild(humidityUl)

  return mainDiv
  
}

function getCurrentWeatherApi(location){
    
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  ).then(function(response) {
    return response.json();
  });

}

function getOneCallApi(longitude, latitude){
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${apiKey}`
  ).then(function(response){
    return response.json()
  });
}

function toCelcius(kelvin){
  return kelvin - 273.15;
}

function getWeather(location){

  return getCurrentWeatherApi(location)
    .then(function(currentWeatherResponse){

      const coord = currentWeatherResponse.coord;

      return getOneCallApi(coord.lon, coord.lat)                            

    })

}
