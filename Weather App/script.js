let isCelsius = true;

function getWeather() {
    const apiKey = '32463c725616a046f44d5654c12614b6';
    const locationInput = document.getElementById('location');
    const location = locationInput.value;

    if (location === '') {
        alert('Please enter a location.');
        return;
    }

    const unit = isCelsius ? 'metric' : 'imperial';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);

            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                alert('Failed to connect to the weather service. Please check your internet connection.');
            } else if (error instanceof Error && error.message.includes('HTTP error!')) {
                alert(`Error: Unauthorized (Status ${error.message.split(':')[1].trim()}). Please check your API key.`);
            } else {
                alert('Error fetching weather data. Please try again.');
            }
        });
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    getWeather(); // Fetch weather again with the new unit
}

function updateWeatherInfo(data) {
    const weatherIcon = document.getElementById('weather-icon');
    const cityNameElement = document.getElementById('city-name');
    const descriptionElement = document.getElementById('description');
    const temperatureElement = document.getElementById('temperature');
    const windSpeedElement = document.getElementById('wind-speed');
    const cloudCoverElement = document.getElementById('cloud-cover');
    const pressureElement = document.getElementById('pressure');
    const dateTimeElement = document.getElementById('date-time');

    // Update weather icon
    const iconCode = data.weather && data.weather.length > 0 ? data.weather[0].icon : '01d';
    weatherIcon.innerHTML = `<i class="fas fa-${getWeatherIcon(iconCode)}"></i>`;

    // Update other weather information
    cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
    descriptionElement.textContent = capitalizeFirstLetter(data.weather[0].description);
    temperatureElement.textContent = `${data.main.temp} ${isCelsius ? '°C' : '°F'} temperature`;
    windSpeedElement.textContent = `Wind ${data.wind.speed} m/s`;
    cloudCoverElement.textContent = `Clouds ${data.clouds.all} %`;
    pressureElement.textContent = `Pressure ${data.main.pressure} hPa`;

    // Update date and time
    const timestamp = data.dt;
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    dateTimeElement.textContent = `Last Updated: ${date.toLocaleDateString('en-US', options)}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeatherIcon(iconCode) {
    // Map OpenWeatherMap icon codes to Font Awesome icons
    const iconMap = {
        '01d': 'sun',
        '02d': 'cloud-sun',
        '03d': 'cloud',
        '04d': 'cloud',
        '09d': 'cloud-showers-heavy',
        '10d': 'cloud-sun-rain',
        '11d': 'bolt',
        '13d': 'snowflake',
        '50d': 'smog',
        '01n': 'moon',
        '02n': 'cloud-moon',
        '03n': 'cloud',
        '04n': 'cloud',
        '09n': 'cloud-showers-heavy',
        '10n': 'cloud-moon-rain',
        '11n': 'bolt',
        '13n': 'snowflake',
        '50n': 'smog'
    };

    return iconMap[iconCode] || 'question';
}

