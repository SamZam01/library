export interface Book {
  id: string; 
  title: string;
  authors?: string[]; 
  coverId?: number; 
  firstPublishYear?: number;
  description?: string;
  categories?: string[];
  isbn?: string[];
  availability?: 'available' | 'borrowed';
  subjects?: string[];
  language?: string[];
}
