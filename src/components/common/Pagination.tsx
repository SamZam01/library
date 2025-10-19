import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      pages.push(1, 2, 3);
      
      if (currentPage > 4) {
        pages.push('...');
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
        pages.push('...');
      }

      if (currentPage <= 3 && totalPages > 4) {
        pages.push('...');
      }

      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ←
      </button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="pagination-ellipsis">...</span>
          ) : (
            <button
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
              aria-label={`Ir a página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className="pagination-arrow"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;