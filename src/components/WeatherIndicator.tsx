
import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

const WeatherIndicator = () => {
  const [weather, setWeather] = useState({
    temperature: 29,
    condition: 'sunny'
  });

  useEffect(() => {
    // Simulate weather data for Puerto López
    const conditions = ['sunny', 'cloudy', 'rainy'];
    const temps = [27, 28, 29, 30, 31];
    
    const interval = setInterval(() => {
      setWeather({
        temperature: temps[Math.floor(Math.random() * temps.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)]
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Thermometer className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
      {getWeatherIcon()}
      <span className="text-sm font-medium text-white">
        {weather.temperature}°
      </span>
    </div>
  );
};

export default WeatherIndicator;
