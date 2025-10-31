import { useState, useEffect } from 'react';

export type TimeOfDay = 'Day' | 'Sunset' | 'Night';

// Fix: Export WeatherCondition type to resolve import error in DynamicBackground.tsx.
export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rainy' | 'Snowy';

export const useWeather = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Day');
  const [weather] = useState<WeatherCondition>('Sunny');

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

    // check time of day every minute
    const timeInterval = setInterval(updateDateTime, 60000);

    return () => {
        clearInterval(timeInterval);
    };
  }, []);

  return { timeOfDay, weather };
};