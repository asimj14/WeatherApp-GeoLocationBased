//Selecting all Elements 

const iconElement = document.querySelector(".weather-icon")
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p")
const locationElement = document.querySelector(".location p")
const notificationElement = document.querySelector(".notification")
const dateTimeElement = document.querySelector(".dateTime")
const topCardElement = document.querySelector(".top-card")
const humidityElement = document.querySelector(".humidity")
const windElement = document.querySelector(".wind")

//Our App Data

//Weather Objects
const weather = {};

weather.temperature = {
    unit: "celsius"

}

//Some constants
const KELVIN = 273;

//Weather API Key


const key = "6131d2b350b3cbfa938668a585cc056b";


//Checking if browser supports geolocaiton
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, displayError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}


//Function to Set User's Position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    //Calling function to get weather in base of the current latitude & longitude
    getWeather(latitude, longitude);

}

//Function to Display Error if there's any issue with Geolocation service

function displayError(error) {

    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;

}
//Function to Display Weather to User Interface
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;


    //dateTimeElement.innerHTML = new Date();
    if (isDayTime(weather.iconId)) {
        console.log('Day');
        topCardElement.innerHTML = `<img class="top-card" src="img/day_image.svg"/>`;
    } else {
        console.log('Night');
        topCardElement.innerHTML = `<img class="top-card" src="img/night_image.svg"/>`;

    }
    humidityElement.innerHTML = `${weather.humidity}%`;
    windElement.innerHTML = `${weather.wind}m/s`;



}

//function to change background
function isDayTime(icon) {
    if (icon.includes('d')) {
        return true;
    } else {
        return false;
    }

}


//Function to Get Weather from our API Provider
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
        })
        .then(function() {
            displayWeather();
        });
}


// Celsius to Forenheit conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

//function to change temperature type when user clicks
tempElement.addEventListener("click", function() {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

//function to render date & time
function renderTime() {

    //Date 
    var myDate = new Date();

    console.log(myDate);
    var year = myDate.getYear();
    if (year < 1000) {
        year += 1900
    }
    var day = myDate.getDay();
    var month = myDate.getMonth();
    var daym = myDate.getDate();
    var daysArray = new Array("Sunday,", "Monday,", "Tuesday,", "Wednesday,", "Thursday,", "Friday,", "Saturday");
    var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];





    console.log(myDate.toLocaleDateString());


    //Time
    var currentTime = new Date();
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    var s = currentTime.getSeconds();
    if (h == 24) {
        h = 0;
    } else if (h > 12) {
        h = h - 0;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }

    dateTimeElement.textContent = "" + daysArray[day] + " " + daym + " " + monthsArray[month] + " " + year + " | " + h + " : " + m + " : " + s;
    dateTimeElement.innerHTML = "" + daysArray[day] + " " + daym + " " + monthsArray[month] + " " + year + " | " + h + " : " + m + " : " + s;

    setTimeout("renderTime()", 1000);
}
renderTime();