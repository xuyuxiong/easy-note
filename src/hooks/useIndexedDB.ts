import { useState, useEffect } from 'react';

interface Item {
  id?: number;
  name: string;
  age: number;
}

function useIndexedDB(databaseName: string, storeName: string) {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open(databaseName, 1);

    request.onerror = (event: any) => {
      console.error('Database error: ', event.target?.errorCode);
    };

    request.onsuccess = (event: any) => {
      setDb(event.target?.result);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target?.result;
      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    };
  }, [databaseName, storeName]);

  function addItem(item: Item) {
    const transaction = db?.transaction([storeName], 'readwrite');
    const objectStore = transaction?.objectStore(storeName);
    const request = objectStore?.add(item);
  }

  function getAllItems(callback: (items: Item[]) => void) {
    const transaction = db?.transaction([storeName], 'readonly');
    const objectStore = transaction?.objectStore(storeName);
    const request = objectStore?.getAll();

    if (request?.onsuccess) {
      request.onsuccess = (event: any) => {
        callback(event.target?.result);
      };
    }
  }

  return { addItem, getAllItems };
}
