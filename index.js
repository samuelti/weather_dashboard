var apiKey = "9ac68ce8d6291dd7b63523ec4ead22d4";
var history= [];

// 
// var apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

// dom elements variables

var userInput = document.getElementById('search-input');
var searchForm = document.getElementById('search-form');
var currentWeatherContainer = document.getElementById('today');
var fiveDayForcast = document.getElementById('forecast');
var history = document.getElementById('history');

//timezone from dayjs


function getLatLon(data) {
    var apiCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${apiKey}`;
    fetch(apiCurrentWeather).then(function (response) {
        return response.json();
      }).then(function (reciever){
         oneCall(reciever);
      })
};

function oneCall(data) {
    
    console.log(data.coord.lon);
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var apiOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${apiKey}`
    var cityName = data.cityName
    fetch(apiOneCall).then(function (response) {
        return response.json();
        
    }).then((data =>{
        renderWeather(data.current, cityName);
        //renderForecast(data.daily)
    }))
};

function renderWeather(weather, city){
var tempVar = weather.temp;
var wind = weather.wind_speed;
var humidity = weather.humidity;
var feelsLike = weather.feels_like;
var uvi = weather.uvi;
var iconurl = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

var cardTemplate = document.createElement('div');
var cBody = document.createElement('div');
historyFetch(weather, city);
}


//handle form submit
function handleFormSubmit(e) {
    e.preventDefault();

    var capturedValue = userInput.value;

    // console.log("captured valued", capturedValue);
    getLatLon(capturedValue);
    userInput.value = "";
};

//function to display history

function historyFetch(weather, city){
    var historyCall = `api.openweathermap.org/data/2.5/forecast?id=${city}&appid=${apiKey}`;
    console.log(historyCall);
}

//function to add history to local storage

//function to get history from local storage

//fucntion to store the response from the api

//function to render the information from the api to the html

//get five day forcast info

//handle history click

//event listener

searchForm.addEventListener('submit', handleFormSubmit)