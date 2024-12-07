import { iconButtonClasses } from '@mui/material';
import axios from 'axios';

const WEATHER_API_URL = 'https://api.weather.gov/gridpoints/BOX/60,70/forecast/hourly';

interface WeatherAPIResponse {
  properties: {
    periods: {
      name: string;
      temperature: number;
      temperatureUnit: string;
      shortForecast: string;
      detailedForecast: string;
      windSpeed: string;
      icon: string;
    }[];
  };
}

export const getWeatherData = async () => {
  const response = await axios.get<WeatherAPIResponse>(WEATHER_API_URL);
  const firstForecast = response.data.properties.periods[0];
  return {
    name: firstForecast.name,
    temperature: firstForecast.temperature,
    temperatureUnit: firstForecast.temperatureUnit,
    shortForecast: firstForecast.shortForecast,
    detailedForecast: firstForecast.detailedForecast,
    windSpeed: firstForecast.windSpeed,
    icon: firstForecast.icon
  };
};
