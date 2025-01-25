import axios from 'axios';

const API_KEY = '1f35ab46496e93b18160bd521ca8df89';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const IP_GEOLOCATION_URL = 'https://ipapi.co/json/';

const DEFAULT_LOCATION = {
  lat: 40.7128,
  lon: -74.0060,
  name: 'New York'
};

// Keywords that suggest outdoor activities
const OUTDOOR_KEYWORDS = [
  'walk', 'run', 'jog', 'hiking', 'garden', 'park',
  'outdoor', 'outside', 'yard', 'lawn', 'playground',
  'bike', 'cycling', 'exercise', 'sport', 'beach'
];

export const isOutdoorTask = (taskTitle) => {
  const lowercaseTitle = taskTitle.toLowerCase();
  return OUTDOOR_KEYWORDS.some(keyword => lowercaseTitle.includes(keyword));
};

const getLocationByIP = async () => {
  try {
    console.log('Attempting IP-based geolocation...');
    const response = await axios.get(IP_GEOLOCATION_URL);
    console.log('IP geolocation successful:', response.data);
    return {
      lat: response.data.latitude,
      lon: response.data.longitude,
      name: response.data.city
    };
  } catch (error) {
    console.error('IP geolocation failed:', error);
    throw error;
  }
};

const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: 'Current Location'
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

export const getWeatherData = async () => {
  try {
    let location;

    // Try browser geolocation first
    try {
      console.log('Attempting browser geolocation...');
      location = await getBrowserLocation();
      console.log('Browser geolocation successful:', location);
    } catch (error) {
      console.log('Browser geolocation failed, trying IP-based location...');
      
      // Try IP-based geolocation as fallback
      try {
        location = await getLocationByIP();
      } catch (ipError) {
        console.log('IP geolocation failed, using default location');
        location = DEFAULT_LOCATION;
      }
    }

    console.log('Fetching weather for:', location.name);
    const response = await axios.get(BASE_URL, {
      params: {
        lat: location.lat,
        lon: location.lon,
        appid: API_KEY,
        units: 'metric'
      }
    });

    return {
      description: response.data.weather[0].description,
      temperature: Math.round(response.data.main.temp),
      icon: response.data.weather[0].icon,
      isOutdoor: true,
      locationDefault: location === DEFAULT_LOCATION,
      locationName: location.name
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    return {
      description: 'Weather data unavailable',
      temperature: '--',
      icon: '01d',
      isOutdoor: true,
      locationDefault: true,
      locationName: 'Unknown Location'
    };
  }
};
