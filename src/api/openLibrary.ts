import type { Book } from '../types/book';

const BASE_URL = 'https://openlibrary.org';

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

interface SearchResponse {
  docs: OpenLibraryDoc[];
  numFound: number;
  start: number;
}

interface OpenLibraryAuthorRef {
  author: {
    key: string;
    name?: string;
  };
}

interface OpenLibraryWork {
  key: string;
  title: string;
  description?: string | { value: string };
  authors?: OpenLibraryAuthorRef[];
  covers?: number[];
  first_publish_date?: string;
  excerpts?: { text: string }[];
}

/**
 * Busca libros en Open Library por query.
 * @param query Término de búsqueda (título, autor, etc.).
 * @param limit Número de resultados a devolver.
 * @param offset Desplazamiento para paginación.
 * @returns Promesa que resuelve a una lista de libros.
 */
export const searchBooks = async (
  query: string,
  filters: {
    subject?: string;
    author?: string;
    title?: string;
    language?: string;
    firstPublishYear?: number | string;
    sort?: 'new' | 'old' | 'title' | 'author';
  } = {}, 
  limit: number = 10,
  offset: number = 0
): Promise<Book[]> => {
  try {
    let url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}`;
    
    
    if (filters.subject) url += `&subject=${encodeURIComponent(filters.subject)}`;
    if (filters.author) url += `&author=${encodeURIComponent(filters.author)}`;
    if (filters.title) url += `&title=${encodeURIComponent(filters.title)}`;
    if (filters.language) url += `&language=${encodeURIComponent(filters.language)}`;
    if (filters.firstPublishYear) url += `&first_publish_year=${encodeURIComponent(filters.firstPublishYear.toString())}`;
    if (filters.sort) url += `&sort=${filters.sort}`;
    
    url += `&limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: SearchResponse = await response.json();
    return data.docs.map((doc: OpenLibraryDoc) => ({
      id: doc.key,
      title: doc.title,
      authors: doc.author_name || [],
      coverId: doc.cover_i,
      firstPublishYear: doc.first_publish_year,
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

/**
 * Obtiene los detalles de un libro por su ID (work key).
 * @param bookId El ID del libro (ej. "/works/OL45804W").
 * @returns Promesa que resuelve a los detalles del libro.
 */
export const getBookDetails = async (bookId: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${BASE_URL}${bookId}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: OpenLibraryWork = await response.json();

    let description = '';
    if (data.description) {
      description = typeof data.description === 'string' ? data.description : data.description.value;
    } else if (data.excerpts && data.excerpts.length > 0) {
      description = data.excerpts[0].text;
    }

    return {
      id: data.key,
      title: data.title,
      authors: data.authors
        ? data.authors.map((a: OpenLibraryAuthorRef) =>
            a.author.key ? a.author.key.split('/').pop()! : a.author.name || ''
          )
        : [],
      coverId: data.covers && data.covers.length > 0 ? data.covers[0] : undefined,
      firstPublishYear: data.first_publish_date
        ? parseInt(data.first_publish_date.split(' ')[2])
        : undefined,
      description,
    };
  } catch (error) {
    console.error(`Error fetching book details for ${bookId}:`, error);
    return null;
  }
};

/**
 * Construye la URL de la imagen de portada.
 * @param coverId El ID de la portada.
 * @param size Tamaño de la imagen ('S', 'M', 'L').
 * @returns URL de la imagen de portada.
 */
export const getCoverImageUrl = (
  coverId: number | undefined,
  size: 'S' | 'M' | 'L' = 'M'
): string => {
  if (!coverId) {
    return '/placeholder-book.png'; 
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};
