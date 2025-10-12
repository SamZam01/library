/**
 * Servicio centralizado para interactuar con LocalStorage.
 * Proporciona una capa de abstracción y manejo de errores.
 */

/**
 * Obtiene un elemento de LocalStorage.
 * @param key La clave del elemento.
 * @returns El valor parseado o null si no existe o hay un error.
 */
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error al obtener '${key}' de LocalStorage:`, error);
    return null;
  }
};

/**
 * Guarda un elemento en LocalStorage.
 * @param key La clave del elemento.
 * @param value El valor a guardar (se serializará a JSON).
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar '${key}' en LocalStorage:`, error);
  }
};

/**
 * Elimina un elemento de LocalStorage.
 * @param key La clave del elemento a eliminar.
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar '${key}' de LocalStorage:`, error);
  }
};

/**
 * Limpia todo LocalStorage. Usar con precaución.
 */
export const clearAll = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error al limpiar LocalStorage:", error);
  }
};
