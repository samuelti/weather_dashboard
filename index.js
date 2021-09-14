var apiKey = "9ac68ce8d6291dd7b63523ec4ead22d4";
var historyArr = [];

//
// var apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

// dom elements variables

var userInput = document.getElementById("search-input");
var searchForm = document.getElementById("search-form");
var currentWeatherContainer = document.getElementById("today");
var fiveDayForcast = document.getElementById("forecast");
var historyContainer = document.getElementById("history");

function getLatLon(data) {
  var apiCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${apiKey}`;
  fetch(apiCurrentWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (reciever) {
      addToHistory(data);
      oneCall(reciever);
    });
}

function oneCall(data) {
  console.log(data.name);
  var lat = data.coord.lat;
  var lon = data.coord.lon;
  var apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${apiKey}`;
  var cityName = data.name;
  fetch(apiOneCall)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      renderWeather(data.current, cityName);
      renderForecast(data.daily);
    });
}

function renderWeather(weather, city) {
  // console.log(city);
  var tempVar = weather.temp;
  var wind = weather.wind_speed;
  var humidity = weather.humidity;
  var feelsLike = weather.feels_like;
  var uvi = weather.uvi;
  var iconurl = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

  var cardTemplate = document.createElement("div");
  var cBody = document.createElement("div");
  var date = document.createElement("h2");
  var icon = document.createElement("img");
  var displayTemp = document.createElement("p");
  var displayWind = document.createElement("p");
  var displayHumidity = document.createElement("p");
  var displayFeelsLike = document.createElement("p");
  var displayUvi = document.createElement("p");
  cardTemplate.setAttribute("class", "card");
  cBody.setAttribute("class", "card-body");
  cardTemplate.append(cBody);

  date.setAttribute("class", "card-title");
  displayTemp.setAttribute("class", "card-text");
  displayWind.setAttribute("class", "card-text");
  displayHumidity.setAttribute("class", "card-text");
  displayFeelsLike.setAttribute("class", "card-text");
  displayUvi.setAttribute("class", "card-text");
  icon.setAttribute("src", iconurl);
  var currentTime = moment().format("MMMM Do YYYY");

  date.textContent = `${city} ${currentTime}`;
  date.append(icon);
  displayTemp.textContent = `Temp: ${tempVar}°F`;
  displayWind.textContent = `Wind: ${wind}mph`;
  displayHumidity.textContent = `Humidity: ${humidity}%`;
  displayFeelsLike.textContent = `Feels like: ${feelsLike}°F`;
  displayUvi.textContent = `Uvi: ${uvi}%`;
  cBody.append(
    date,
    displayTemp,
    displayWind,
    displayHumidity,
    displayFeelsLike,
    displayUvi
  );
  currentWeatherContainer.innerHTML = "";
  currentWeatherContainer.append(cardTemplate);
}

//handle form submit
function handleFormSubmit(e) {
  e.preventDefault();

  var capturedValue = userInput.value;

  // console.log("captured valued", capturedValue);
  getLatLon(capturedValue);
  userInput.value = "";
}

function renderForecast(forcast) {
  console.log(forcast);
  var header = document.createElement("div");
  var heading = document.createElement("h3");

  header.setAttribute("class", "col-md-12");
  heading.textContent = "Five-Day Forecast";
  header.append(heading);

  fiveDayForcast.innerHTML = "";
  fiveDayForcast.append(header);

  for (let i = 1; i < 6; i++) {
    var unix = new Date(forcast[i].dt * 1000);
    var formatDt = unix.toLocaleString().slice(0, -12);
    var temp = forcast[i].temp.day;
    //console.log(temp);
    var humidity = forcast[i].humidity;
    //console.log(humidity);
    var windSpeed = forcast[i].wind_speed;
    console.log(windSpeed);
    var collumn = document.createElement("div");
    var cardTemplate = document.createElement("div");
    var cBody = document.createElement("div");
    var date = document.createElement("h4");
    var displayTemp = document.createElement("p");
    var displayWind = document.createElement("p");
    var displayHumidity = document.createElement("p");
    collumn.append(cardTemplate);
    cardTemplate.append(cBody);
    cBody.append(date, displayTemp, displayWind, displayHumidity);
    collumn.setAttribute("class", "col");
    cardTemplate.setAttribute("class", "card h-100");
    cBody.setAttribute("class", "card-body");
    date.setAttribute("class", "card-title");
    displayTemp.setAttribute("class", "card-text");
    displayWind.setAttribute("class", "card-text");
    displayHumidity.setAttribute("class", "card-text");
    date.textContent = formatDt;
    displayTemp.textContent = `Temp: ${temp}°F`;
    displayWind.textContent = `Wind: ${windSpeed}mph`;
    displayHumidity.textContent = `Humidity: ${humidity}%`;
    fiveDayForcast.append(collumn);
  }
}

function addToHistory(city) {
    if (historyArr.indexOf(city) !== -1){
        return;
    }
  historyArr.push(city);
  console.log(historyArr);
  localStorage.setItem("history", JSON.stringify(historyArr));
  renderHistory();
}

function renderHistory() {
  historyContainer.innerHTML = "";

  for (let i = 0; i < historyArr.length; i++) {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "btn primary btn-history");

    btn.setAttribute("data-search", historyArr[i]);
    btn.textContent = historyArr[i];
    historyContainer.append(btn);
  }
}

function init() {
  var storedhistory = localStorage.getItem("history");
  if (storedhistory) {
    historyArr = JSON.parse(storedhistory);
  }
  renderHistory();
}

function historyClick(e) {
  if (!e.target.matches(".btn-history")) {
    return;
  }
  var buttonData = e.target;
  var historySearch = buttonData.getAttribute("data-search");
  getLatLon(historySearch);
}

init();
searchForm.addEventListener("submit", handleFormSubmit);
historyContainer.addEventListener("click", historyClick);
