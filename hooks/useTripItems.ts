import { useState, useEffect, useCallback } from 'react';

export type Category = 'documentos' | 'reservas' | 'ingressos' | 'contatos';

export interface TripItem {
  id: string;
  category: Category;
  title: string;
  description: string;
  date: string;
  fileData?: string;
  fileName?: string;
  fileType?: string;
}

const STORAGE_KEY = 'santiagoTripItems';

export const useTripItems = () => {
  const [items, setItems] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to load trip items from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveItems = useCallback((newItems: TripItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error("Failed to save trip items to localStorage", error);
      // Potentially show an error to the user if storage is full
    }
  }, []);

  const addItem = (item: Omit<TripItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const updatedItems = [...items, newItem];
    saveItems(updatedItems);
  };

  const updateItem = (id: string, updatedFields: Partial<Omit<TripItem, 'id'>>) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveItems(updatedItems);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
  };
  
  const getItemsByCategory = (category: Category) => {
    return items.filter(item => item.category === category);
  };

  return { items, getItemsByCategory, addItem, updateItem, deleteItem, isLoading };
};
