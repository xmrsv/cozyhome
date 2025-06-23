const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button'); // its an a tag
const weatherLabel = document.getElementById('weather-placeholder');

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  } else {
    alert('Please enter a search term.');
  }
    searchInput.value = ''; // Clear the input after search
});

window.addEventListener('DOMContentLoaded', () => {
    getWeatherData();
});

async function getWeatherData() {
    const city = 'Tarapoto'; // Variable para la ciudad
    const weatherData = localStorage.getItem('weatherData');
    const now = new Date();

    if (weatherData) {
        const { data, timestamp } = JSON.parse(weatherData);
        const ageInMinutes = (now.getTime() - timestamp) / 1000 / 60;

        if (ageInMinutes < 60) { // Use cached data if less than an hour old
            displayWeatherData(data, city);
            return;
        }
    }

    // Tarapoto coordinates
    const latitude = -6.48;
    const longitude = -76.36;
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();

        localStorage.setItem('weatherData', JSON.stringify({ data, timestamp: now.getTime() }));
        displayWeatherData(data, city);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherLabel.textContent = 'Clima no disponible';
    }
}

function displayWeatherData(data, city) {
    const temp = data.current.temperature_2m;
    const weatherCode = data.current.weather_code;
    const weatherDescription = getWeatherDescription(weatherCode);
    weatherLabel.textContent = `Clima en ${city}: ${temp}°C, ${weatherDescription}`;
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Cielo despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla engelante',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna densa',
        56: 'Llovizna helada ligera',
        57: 'Llovizna helada densa',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        66: 'Lluvia helada ligera',
        67: 'Lluvia helada intensa',
        71: 'Nevada ligera',
        73: 'Nevada moderada',
        75: 'Nevada intensa',
        77: 'Granos de nieve',
        80: 'Chubascos ligeros',
        81: 'Chubascos moderados',
        82: 'Chubascos violentos',
        85: 'Chubascos de nieve ligeros',
        86: 'Chubascos de nieve intensos',
        95: 'Tormenta',
        96: 'Tormenta con granizo ligero',
        99: 'Tormenta con granizo intenso',
    };
    return descriptions[code] || 'Desconocido';
}