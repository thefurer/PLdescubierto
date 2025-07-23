import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react";

const WeatherWidget = ({ scrolled }: { scrolled: boolean }) => {
  const [weather, setWeather] = useState({
    temperature: 29,
    condition: "soleado",
    icon: "sun"
  });

  // Simular cambios de clima (en producción conectarías a una API real)
  useEffect(() => {
    const conditions = [
      { temperature: 29, condition: "soleado", icon: "sun" },
      { temperature: 27, condition: "nublado", icon: "cloud" },
      { temperature: 25, condition: "lluvia", icon: "rain" }
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    setWeather(randomCondition);
  }, []);

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case "sun":
        return <Sun size={16} className="text-yellow-500" />;
      case "cloud":
        return <Cloud size={16} className="text-gray-400" />;
      case "rain":
        return <CloudRain size={16} className="text-blue-400" />;
      default:
        return <Thermometer size={16} />;
    }
  };

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