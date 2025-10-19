import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import LanguageSelect from '../common/LanguageSelect';
import './FiltersPanel.css';

interface Filters {
  subject?: string;
  author?: string;
  title?: string;
  language?: string;
  firstPublishYear?: string | number;
  sort?: 'new' | 'old' | 'title' | 'author';
}

interface FiltersPanelProps {
  onFilterChange: (filters: Filters) => void;
  initialFilters?: Partial<Filters>;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState<Filters>({
    subject: initialFilters.subject || '',
    author: initialFilters.author || '',
    title: initialFilters.title || '',
    language: initialFilters.language || '',
    firstPublishYear: initialFilters.firstPublishYear || '',
    sort: initialFilters.sort, 
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value, 
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const emptyFilters: Filters = {
      subject: '',
      author: '',
      title: '',
      language: '',
      firstPublishYear: '',
      
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="filters-panel">
      <h3>Filtros</h3>
      <div className="filters-grid">
        <Input
          label="Título"
          name="title"
          value={filters.title || ''}
          onChange={handleInputChange}
          placeholder="Ej. Harry Potter"
        />
        <Input
          label="Autor"
          name="author"
          value={filters.author || ''}
          onChange={handleInputChange}
          placeholder="Ej. J.K. Rowling"
        />
        <Input
          label="Tema/Sujeto"
          name="subject"
          value={filters.subject || ''}
          onChange={handleInputChange}
          placeholder="Ej. fantasy"
        />
        <div className="filter-input-group">
          <label htmlFor="language">Idioma</label>
          <LanguageSelect
            name="language"
            value={filters.language || ''}
            onChange={handleInputChange}
          />
        </div>
        <Input
          label="Año de Publicación"
          name="firstPublishYear"
          type="number"
          value={filters.firstPublishYear || ''}
          onChange={handleInputChange}
          placeholder="Ej. 1997"
        />
        <div className="filter-select-group">
          <label>Ordenar por:</label>
          <select
            name="sort"
            value={filters.sort || ''} 
            onChange={handleInputChange}
          >
            <option value="">Ninguno</option>
            <option value="new">Más nuevo</option>
            <option value="old">Más viejo</option>
            <option value="title">Título</option>
            <option value="author">Autor</option>
          </select>
        </div>
      </div>
      <div className="filters-actions">
        <Button onClick={applyFilters} variant="primary">Aplicar Filtros</Button>
        <Button onClick={resetFilters} variant="secondary">Limpiar</Button>
      </div>
    </div>
  );
};

export default FiltersPanel;
