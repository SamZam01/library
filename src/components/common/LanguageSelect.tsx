import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelect.css';

interface LanguageSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  name: string;
}

const languages = [
  { code: 'eng', name: 'Inglés' },
  { code: 'spa', name: 'Español' },
  { code: 'fre', name: 'Francés' },
  { code: 'ger', name: 'Alemán' },
  { code: 'ita', name: 'Italiano' },
  { code: 'por', name: 'Portugués' },
  { code: 'rus', name: 'Ruso' },
  { code: 'jpn', name: 'Japonés' },
  { code: 'chi', name: 'Chino' },
  { code: 'ara', name: 'Árabe' },
  { code: 'kor', name: 'Coreano' },
  { code: 'dut', name: 'Holandés' },
  { code: 'swe', name: 'Sueco' },
  { code: 'nor', name: 'Noruego' },
  { code: 'dan', name: 'Danés' },
  { code: 'fin', name: 'Finlandés' },
  { code: 'pol', name: 'Polaco' },
  { code: 'tur', name: 'Turco' },
  { code: 'gre', name: 'Griego' },
  { code: 'heb', name: 'Hebreo' },
];

const LanguageSelect: React.FC<LanguageSelectProps> = ({ value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLanguages = languages.filter(
    lang =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLanguage = languages.find(lang => lang.code === value);
  const displayValue = selectedLanguage ? `${selectedLanguage.name} (${selectedLanguage.code})` : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    const syntheticEvent = {
        target: { name, value: code }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="language-select" ref={dropdownRef}>
      <div className="language-select-input-wrapper">
        <input
          type="text"
          className="language-select-input"
          placeholder="Buscar o seleccionar idioma..."
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="button"
          className="language-select-arrow"
          onClick={() => setIsOpen(!isOpen)}
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <div className="language-select-dropdown">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map(lang => (
              <div
                key={lang.code}
                className={`language-select-option ${value === lang.code ? 'selected' : ''}`}
                onClick={() => handleSelect(lang.code)}
              >
                {lang.name} ({lang.code})
              </div>
            ))
          ) : (
            <div className="language-select-option disabled">No se encontraron idiomas</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelect;