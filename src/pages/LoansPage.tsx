import React, { useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Loan } from '../types/loan';
import type { Book } from '../types/book';
import { AuthContext } from '../context/AuthContext';
import { getBookDetails, getCoverImageUrl } from '../api/openLibrary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import './Page.css'; 
import './LoansPage.css'; 

interface LoanWithBookDetails extends Loan {
  bookDetails?: Book | null;
}


const LoansPage: React.FC = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>('lib_loans', []);
  const { currentUser, isAuthenticated } = useContext(AuthContext)!;
  const [loansWithDetails, setLoansWithDetails] = useState<LoanWithBookDetails[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetailsForLoans = async () => {
      if (!isAuthenticated || !currentUser) {
        setIsLoadingDetails(false);
        return;
      }

      setIsLoadingDetails(true);
      const userLoans = loans.filter(loan => loan.userId === currentUser.id);
      const detailedLoansPromises = userLoans.map(async (loan) => {
        
        const bookDetails = await getBookDetails(loan.bookId);
        return { ...loan, bookDetails };
      });
      const results = await Promise.all(detailedLoansPromises);
      setLoansWithDetails(results);
      setIsLoadingDetails(false);
    };

    fetchDetailsForLoans();
  }, [loans, currentUser, isAuthenticated]);

  const handleReturnBook = (loanId: string) => {
    setLoans(prev => prev.map(loan =>
      loan.id === loanId ? { ...loan, status: 'returned', returnDate: new Date().toISOString() } : loan
    ));
  };

  const getStatusClass = (status: 'active' | 'returned' | 'overdue') => {
    switch (status) {
      case 'active': return 'status-active';
      case 'returned': return 'status-returned';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container loans-page">
        <p className="auth-required-message">Por favor, inicia sesión para ver tus préstamos.</p>
      </div>
    );
  }

  if (isLoadingDetails) {
    return <LoadingSpinner />;
  }

  const activeLoans = loansWithDetails.filter(loan => loan.status === 'active');
  const returnedLoans = loansWithDetails.filter(loan => loan.status === 'returned');

  return (
    <div className="page-container loans-page">
      <h1>Mis Préstamos</h1>

      <section className="active-loans-section">
        <h2>Préstamos Activos</h2>
        {activeLoans.length === 0 ? (
          <p className="empty-list-message">No tienes libros prestados actualmente.</p>
        ) : (
          <div className="loans-list">
            {activeLoans.map(loan => (
              <div key={loan.id} className="loan-item">
                <img
                  src={getCoverImageUrl(loan.bookDetails?.coverId, 'S')}
                  alt={`Portada de ${loan.bookDetails?.title}`}
                  className="loan-book-cover"
                />
                <div className="loan-info">
                  <h3>{loan.bookDetails?.title || 'Libro Desconocido'}</h3>
                  <p>Autor(es): {loan.bookDetails?.authors?.join(', ') || 'Desconocido'}</p>
                  <p>Fecha de Préstamo: {new Date(loan.loanDate).toLocaleDateString()}</p>
                  <p>Fecha de Vencimiento: {new Date(loan.dueDate).toLocaleDateString()}</p>
                  <p className={`loan-status ${getStatusClass(loan.status)}`}>Estado: {loan.status === 'active' ? 'Activo' : 'Vencido'}</p>
                </div>
                <Button onClick={() => handleReturnBook(loan.id)} variant="primary" size="small">
                  Devolver
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="returned-loans-section">
        <h2>Historial de Préstamos</h2>
        {returnedLoans.length === 0 ? (
          <p className="empty-list-message">No hay historial de préstamos.</p>
        ) : (
          <div className="loans-list">
            {returnedLoans.map(loan => (
              <div key={loan.id} className="loan-item returned">
                <img
                  src={getCoverImageUrl(loan.bookDetails?.coverId, 'S')}
                  alt={`Portada de ${loan.bookDetails?.title}`}
                  className="loan-book-cover"
                />
                <div className="loan-info">
                  <h3>{loan.bookDetails?.title || 'Libro Desconocido'}</h3>
                  <p>Fecha de Préstamo: {new Date(loan.loanDate).toLocaleDateString()}</p>
                  <p>Fecha de Devolución: {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'N/A'}</p>
                  <p className={`loan-status ${getStatusClass(loan.status)}`}>Estado: Devuelto</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LoansPage;
