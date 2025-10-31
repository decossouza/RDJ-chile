import { TripItem } from '../hooks/useTripItems';

const DB_NAME = 'santiagoTripDB';
const DB_VERSION = 1;
const STORE_NAME = 'tripItems';

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject('IndexedDB error');
    };
  });
};

export const getAllItems = async (): Promise<TripItem[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error fetching items from DB:', request.error);
      reject(request.error);
    };
  });
};

export const addItemDB = async (item: TripItem): Promise<TripItem> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(item);

        request.onsuccess = () => {
            resolve(item);
        };

        request.onerror = () => {
            console.error('Error adding item to DB:', request.error);
            reject(request.error);
        };
    });
};


export const updateItemDB = async (item: TripItem): Promise<TripItem> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => {
      resolve(item);
    };

    request.onerror = () => {
      console.error('Error updating item in DB:', request.error);
      reject(request.error);
    };
  });
};

export const deleteItemDB = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Error deleting item from DB:', request.error);
      reject(request.error);
    };
  });
};
