export interface Loan {
  id: string;
  bookId: string; 
  userId: string; 
  loanDate: string; 
  dueDate: string; 
  returnDate?: string; 
  status: 'active' | 'returned' | 'overdue';
}
