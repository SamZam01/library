import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar el estado persistente en LocalStorage.
 * @param key La clave bajo la cual se almacenará el valor en LocalStorage.
 * @param initialValue El valor inicial si no hay nada en LocalStorage.
 * @returns Un array con el valor actual y una función para actualizarlo.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
