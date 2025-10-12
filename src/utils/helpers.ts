/**
 * Formatea una fecha a un string legible.
 * @param dateString La fecha en formato ISO string.
 * @returns La fecha formateada (ej. "15/03/2023").
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Capitaliza la primera letra de un string.
 * @param str El string a capitalizar.
 * @returns El string con la primera letra en mayúscula.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

