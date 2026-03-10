import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Thermometer, Moon, CloudSun } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const WeatherWidget = ({ scrolled }: { scrolled: boolean }) => {
  const { language } = useLanguage();
  const [weather, setWeather] = useState({
    temperature: 28,
    condition: "soleado",
    conditionEn: "sunny",
    icon: "sun"
  });

  useEffect(() => {
    const hour = new Date().getHours();
    
    let selectedWeather;
    
    if (hour >= 6 && hour < 12) {
      // Mañana
      const morningConditions = [
        { temperature: 24, condition: "fresco", conditionEn: "cool", icon: "cloud-sun" },
        { temperature: 26, condition: "soleado", conditionEn: "sunny", icon: "sun" },
        { temperature: 25, condition: "parcialmente nublado", conditionEn: "partly cloudy", icon: "cloud-sun" },
      ];
      selectedWeather = morningConditions[Math.floor(Math.random() * morningConditions.length)];
    } else if (hour >= 12 && hour < 18) {
      // Tarde
      const afternoonConditions = [
        { temperature: 30, condition: "caluroso", conditionEn: "hot", icon: "sun" },
        { temperature: 29, condition: "soleado", conditionEn: "sunny", icon: "sun" },
        { temperature: 27, condition: "lluvia ligera", conditionEn: "light rain", icon: "rain" },
        { temperature: 28, condition: "nublado", conditionEn: "cloudy", icon: "cloud" },
      ];
      selectedWeather = afternoonConditions[Math.floor(Math.random() * afternoonConditions.length)];
    } else {
      // Noche
      const nightConditions = [
        { temperature: 23, condition: "despejado", conditionEn: "clear", icon: "moon" },
        { temperature: 22, condition: "fresco", conditionEn: "cool", icon: "moon" },
        { temperature: 24, condition: "nublado", conditionEn: "cloudy", icon: "cloud" },
      ];
      selectedWeather = nightConditions[Math.floor(Math.random() * nightConditions.length)];
    }
    
    setWeather(selectedWeather);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case "sun":
        return <Sun size={16} className="text-yellow-500" />;
      case "cloud":
        return <Cloud size={16} className="text-gray-400" />;
      case "rain":
        return <CloudRain size={16} className="text-blue-400" />;
      case "moon":
        return <Moon size={16} className="text-indigo-300" />;
      case "cloud-sun":
        return <CloudSun size={16} className="text-orange-400" />;
      default:
        return <Thermometer size={16} />;
    }
  };

  const displayCondition = language === 'en' ? weather.conditionEn : weather.condition;

  return (
    <div 
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        color: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'white',
        border: `1px solid ${scrolled ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`
      }}
    >
      {getWeatherIcon()}
      <span className="text-sm font-medium">
        {weather.temperature}°
      </span>
      <span className="text-xs opacity-75 hidden lg:inline">
        Puerto López
      </span>
    </div>
  );
};

export default WeatherWidget;
