import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react";

const WeatherIndicator = () => {
  const [weather, setWeather] = useState({
    temperature: 29,
    condition: 'sunny'
  });

  useEffect(() => {
    // Simulated weather data for Puerto López
    const weatherConditions = ['sunny', 'cloudy', 'partly-cloudy'];
    const temps = [27, 28, 29, 30, 31];
    
    const interval = setInterval(() => {
      setWeather({
        temperature: temps[Math.floor(Math.random() * temps.length)],
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-gray-300" />;
      case 'partly-cloudy':
        return <Cloud className="w-4 h-4 text-blue-300" />;
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-400" />;
      default:
        return <Thermometer className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
      {getWeatherIcon()}
      <span className="text-sm font-medium text-white">
        {weather.temperature}°
      </span>
    </div>
  );
};

export default WeatherIndicator;