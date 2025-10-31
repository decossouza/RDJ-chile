import React from 'react';
import { TimeOfDay, WeatherCondition } from '../hooks/useWeather';

interface DynamicBackgroundProps {
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
}

const Rain = () => (
  <div className="rain-container">
    {Array.from({ length: 100 }).map((_, i) => (
      <div key={i} className="rain-drop" style={{ 
        left: `${Math.random() * 100}%`,
        animationDuration: `${0.5 + Math.random() * 0.5}s`,
        animationDelay: `${Math.random() * 5}s`,
       }} />
    ))}
  </div>
);

const Snow = () => (
    <div className="snow-container">
      {Array.from({ length: 150 }).map((_, i) => (
        <div key={i} className="snowflake" style={{ 
          left: `${Math.random() * 100}%`,
          animationDuration: `${5 + Math.random() * 10}s`,
          animationDelay: `${Math.random() * 10}s`,
          opacity: Math.random(),
          transform: `scale(${0.2 + Math.random() * 0.8})`
         }} />
      ))}
    </div>
);

const Stars = () => (
    <div className="stars-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
    </div>
);

const Clouds = () => (
    <div className="clouds-container">
        <div className="cloud-layer layer1"></div>
        <div className="cloud-layer layer2"></div>
    </div>
);

const SunGlow = () => <div className="sun-glow" />;


export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ timeOfDay, weather }) => {
  return (
    <div className="dynamic-background">
      {/* Background Images */}
      <div 
        className="bg-image bg-day" 
        style={{ opacity: timeOfDay === 'Day' ? 1 : 0 }} 
      />
      <div 
        className="bg-image bg-sunset" 
        style={{ opacity: timeOfDay === 'Sunset' ? 1 : 0 }} 
      />
      <div 
        className="bg-image bg-night" 
        style={{ opacity: timeOfDay === 'Night' ? 1 : 0 }} 
      />
      
      {/* Weather Overlays */}
      <div className="weather-overlay" style={{ opacity: timeOfDay === 'Day' && weather === 'Sunny' ? 1 : 0 }}>
        <SunGlow />
      </div>
      <div className="weather-overlay" style={{ opacity: weather === 'Cloudy' ? 1 : 0 }}>
        <Clouds />
      </div>
      <div className="weather-overlay" style={{ opacity: weather === 'Rainy' ? 1 : 0 }}>
        <Rain />
      </div>
       <div className="weather-overlay" style={{ opacity: weather === 'Snowy' ? 1 : 0 }}>
        <Snow />
      </div>
      <div className="weather-overlay" style={{ opacity: timeOfDay === 'Night' ? 1 : 0 }}>
        <Stars />
      </div>
    </div>
  );
};
