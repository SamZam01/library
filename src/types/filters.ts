export interface Filters {
  subject?: string;
  author?: string;
  title?: string;
  language?: string;
  firstPublishYear?: string | number;
  sort?: 'new' | 'old' | 'title' | 'author';
}
