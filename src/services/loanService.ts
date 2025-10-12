import type { Loan } from '../types/loan';
import { getItem, setItem } from './localStorageService';
import { getAuthToken } from './authTokenService'; // ✅ Agregado

const LOANS_KEY = 'lib_loans';

/**
 * Obtiene todos los préstamos de LocalStorage.
 * @returns Array de préstamos.
 */
const getAllLoans = (): Loan[] => {
  return getItem<Loan[]>(LOANS_KEY) || [];
};

/**
 * Guarda la lista de préstamos en LocalStorage.
 * @param loans Array de préstamos.
 */
const saveAllLoans = (loans: Loan[]): void => {
  setItem(LOANS_KEY, loans);
};

/**
 * Añade un nuevo préstamo.
 * @param bookId ID del libro.
 * @param userId ID del usuario.
 * @returns El nuevo objeto Loan creado, o null si falla.
 */
export const addLoan = (bookId: string, userId: string): Loan | null => {
  // ✅ Verificación de token antes de continuar (simulando auth)
  const token = getAuthToken();
  if (!token) {
    console.error('Token requerido para préstamo'); // Simulación de error de auth
    return null;
  }

  const loans = getAllLoans();
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 14); // Vence en 14 días

  const newLoan: Loan = {
    id: `loan-${Date.now()}`,
    bookId,
    userId,
    loanDate: now.toISOString(),
    dueDate: dueDate.toISOString(),
    status: 'active',
  };

  loans.push(newLoan);
  saveAllLoans(loans);
  return newLoan;
};

/**
 * Actualiza el estado de un préstamo (ej. a 'returned').
 * @param loanId ID del préstamo a actualizar.
 * @param newStatus Nuevo estado del préstamo.
 * @param returnDate Fecha de devolución (opcional, para 'returned').
 * @returns true si el préstamo fue actualizado, false si no se encontró.
 */
export const updateLoanStatus = (
  loanId: string,
  newStatus: 'active' | 'returned' | 'overdue',
  returnDate?: string
): boolean => {
  const loans = getAllLoans();
  const loanIndex = loans.findIndex(loan => loan.id === loanId);

  if (loanIndex > -1) {
    loans[loanIndex] = {
      ...loans[loanIndex],
      status: newStatus,
      returnDate: returnDate || loans[loanIndex].returnDate,
    };
    saveAllLoans(loans);
    return true;
  }
  return false;
};

/**
 * Obtiene los préstamos de un usuario específico.
 * @param userId ID del usuario.
 * @returns Array de préstamos del usuario.
 */
export const getUserLoans = (userId: string): Loan[] => {
  const loans = getAllLoans();
  return loans.filter(loan => loan.userId === userId);
};
