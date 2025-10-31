import { useState, useEffect } from 'react';
import { getAllItems, addItemDB, updateItemDB, deleteItemDB } from '../utils/db';

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

export const useTripItems = () => {
  const [items, setItems] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
        try {
            const storedItems = await getAllItems();
            setItems(storedItems);
        } catch (error) {
            console.error("Failed to load trip items from IndexedDB", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadItems();
  }, []);

  const addItem = async (item: Omit<TripItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    try {
        await addItemDB(newItem);
        setItems(prevItems => [...prevItems, newItem]);
    } catch (error) {
        console.error("Failed to save trip item to IndexedDB", error);
    }
  };

  const updateItem = async (id: string, updatedFields: Partial<Omit<TripItem, 'id'>>) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    const updatedItem = { ...itemToUpdate, ...updatedFields };

    try {
        await updateItemDB(updatedItem);
        setItems(prevItems => prevItems.map(item =>
          item.id === id ? updatedItem : item
        ));
    } catch (error) {
        console.error("Failed to update trip item in IndexedDB", error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
        await deleteItemDB(id);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
        console.error("Failed to delete trip item from IndexedDB", error);
    }
  };
  
  const getItemsByCategory = (category: Category) => {
    return items.filter(item => item.category === category);
  };

  return { items, getItemsByCategory, addItem, updateItem, deleteItem, isLoading };
};
