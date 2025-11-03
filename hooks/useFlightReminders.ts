import { useState, useEffect, useCallback } from 'react';

export type FlightType = 'departure' | 'arrival';

export interface FlightReminder {
  id: string;
  type: FlightType;
  flightNumber: string;
  dateTime: string; // ISO string
  reminderMinutes: number; // minutes before
  notified: boolean;
}

const STORAGE_KEY = 'santiagoFlightReminders';

export const useFlightReminders = () => {
  const [reminders, setReminders] = useState<FlightReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedReminders = localStorage.getItem(STORAGE_KEY);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error("Failed to load flight reminders from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const saveReminders = useCallback((updatedReminders: FlightReminder[]) => {
      try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
          setReminders(updatedReminders);
      } catch (error) {
          console.error("Failed to save flight reminders to localStorage", error);
      }
  }, []);

  const addReminder = (reminder: Omit<FlightReminder, 'id' | 'notified'>) => {
    const newReminder: FlightReminder = { ...reminder, id: Date.now().toString(), notified: false };
    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);
  };

  const updateReminder = (id: string, updatedFields: Partial<Omit<FlightReminder, 'id'>>) => {
    const updatedReminders = reminders.map(r =>
      r.id === id ? { ...r, ...updatedFields, notified: false } : r // Reset notified status on update
    );
    saveReminders(updatedReminders);
  };

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    saveReminders(updatedReminders);
  };
  
  const setNotified = (id: string) => {
      const updatedReminders = reminders.map(r =>
          r.id === id ? { ...r, notified: true } : r
      );
      saveReminders(updatedReminders);
  };

  return { reminders, addReminder, updateReminder, deleteReminder, setNotified, isLoading };
};
