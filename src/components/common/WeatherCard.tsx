import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface WeatherCardProps {
  weather: {
    name: string;
    temperature: number;
    temperatureUnit: string;
    shortForecast: string;
    detailedForecast: string;
    windSpeed: string;
    icon: string; 
  };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const { t } = useTranslation('common');

  return (
    <Card sx={{ backgroundColor: '#e0f7fa', color: '#004d40', borderRadius: '10px', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ marginBottom: 1 }}>
          Weather in Boston
        </Typography>
        <Box display="flex" alignItems="center" marginBottom={2}>
        <Box
          component="img"
          src={weather.icon}
          alt={weather.shortForecast}
          width={30}
          height={30}
          sx={{ marginRight: 2 }}
        />
          <Typography variant="h6">{weather.shortForecast}</Typography>
        </Box>
        <Typography variant="body1">
          <strong>{t('weather.temperature')}:</strong> {weather.temperature}°{weather.temperatureUnit}
        </Typography>
        <Typography variant="body1">
          <strong>{t('weather.windSpeed')}:</strong> {weather.windSpeed}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {weather.detailedForecast}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
