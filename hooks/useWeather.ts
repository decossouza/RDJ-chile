import { useState, useEffect } from 'react';

export type TimeOfDay = 'Day' | 'Sunset' | 'Night';
export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy';

const weatherCycle: WeatherCondition[] = ['Sunny', 'Cloudy', 'Rainy', 'Snowy'];

export const useWeather = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Day');
  const [weather, setWeather] = useState<WeatherCondition>('Sunny');

  useEffect(() => {
    // Function to update state
    const updateDateTime = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) {
            setTimeOfDay('Day');
        } else if (hour >= 18 && hour < 20) {
            setTimeOfDay('Sunset');
        } else {
            setTimeOfDay('Night');
        }
    };
    
    updateDateTime(); // Initial call

    // Simulate weather changing every 30 seconds
    let weatherIndex = 0;
    const weatherInterval = setInterval(() => {
      weatherIndex = (weatherIndex + 1) % weatherCycle.length;
      setWeather(weatherCycle[weatherIndex]);
    }, 30000); // 30 seconds

    // check time of day every minute
    const timeInterval = setInterval(updateDateTime, 60000);


    return () => {
        clearInterval(weatherInterval);
        clearInterval(timeInterval);
    };
  }, []);

  return { timeOfDay, weather };
};
