import type { Book } from '../types/book';

const BASE_URL = 'https://openlibrary.org';

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  language?: string[]; 
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

interface OpenLibraryEdition {
  languages?: Array<{ key: string }>;
}

interface OpenLibraryWork {
  key: string;
  title: string;
  description?: string | { value: string };
  authors?: OpenLibraryAuthorRef[];
  covers?: number[];
  first_publish_date?: string;
  excerpts?: { text: string }[];
  subjects?: string[];
  subject_places?: string[];
  subject_times?: string[];
  subject_people?: string[];
  languages?: Array<{ key: string }>;
}

interface OpenLibraryAuthor {
  name?: string;
}

/**
 * Busca libros en Open Library por query.
 * @param query Término de búsqueda (título, autor, etc.).
 * @param filters Filtros adicionales para la búsqueda.
 * @param limit Número de resultados a devolver.
 * @param offset Desplazamiento para paginación.
 * @returns Promesa que resuelve a una lista de libros y el total de resultados.
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
): Promise<{ books: Book[]; total: number }> => {
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
    
    const books = data.docs.map((doc: OpenLibraryDoc) => ({
      id: doc.key,
      title: doc.title,
      authors: doc.author_name || [],
      coverId: doc.cover_i,
      firstPublishYear: doc.first_publish_year,
      subjects: doc.subject,
      language: doc.language,
    }));

    return {
      books,
      total: data.numFound
    };
  } catch (error) {
    console.error('Error searching books:', error);
    return { books: [], total: 0 };
  }
};

/**
 * Obtiene el nombre de un autor por su key.
 * @param key El key del autor (ej. "/authors/OL3175986A").
 * @returns Promesa que resuelve al nombre del autor o un fallback.
 */
const fetchAuthorName = async (key: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}${key}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: OpenLibraryAuthor = await response.json();
    return data.name || 'Autor Desconocido';
  } catch (error) {
    console.error(`Error fetching author name for ${key}:`, error);
    return 'Autor Desconocido';
  }
};

/**
 * Mapea códigos de idioma a nombres legibles
 */
const languageNames: Record<string, string> = {
  eng: 'Inglés',
  spa: 'Español',
  fre: 'Francés',
  ger: 'Alemán',
  ita: 'Italiano',
  por: 'Portugués',
  rus: 'Ruso',
  jpn: 'Japonés',
  chi: 'Chino',
  ara: 'Árabe',
};

const getLanguageName = (code: string): string => {
  const cleanCode = code.replace('/languages/', '');
  return languageNames[cleanCode] || cleanCode.toUpperCase();
};

/**
 * Obtiene idiomas desde las ediciones del libro
 */
const fetchBookLanguages = async (workId: string): Promise<string[] | undefined> => {
  try {
    const editionsUrl = `${BASE_URL}${workId}/editions.json?limit=10`;
    const response = await fetch(editionsUrl);
    if (!response.ok) return undefined;
    
    const data = await response.json();
    const languageCodes = new Set<string>();
    
    if (data.entries && Array.isArray(data.entries)) {
      data.entries.forEach((edition: OpenLibraryEdition) => {
        if (edition.languages) {
          edition.languages.forEach(lang => {
            languageCodes.add(getLanguageName(lang.key));
          });
        }
      });
    }
    
    return languageCodes.size > 0 ? Array.from(languageCodes) : undefined;
  } catch (error) {
    console.error('Error fetching book languages:', error);
    return undefined;
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

    // Obtener nombres de autores con fetches adicionales
    const authors = data.authors
      ? await Promise.all(
          data.authors.map(async (a: OpenLibraryAuthorRef) => {
            if (a.author.name) {
              return a.author.name;
            }
            return await fetchAuthorName(a.author.key);
          })
        )
      : [];

    const yearMatch = data.first_publish_date ? data.first_publish_date.match(/\b(\d{4})\b/) : null;
    const firstPublishYear = yearMatch ? parseInt(yearMatch[1], 10) : undefined;

    const subjects = [
      ...(data.subjects || []),
      ...(data.subject_places || []),
      ...(data.subject_times || []),
      ...(data.subject_people || []),
    ];

    const languages = data.languages 
      ? data.languages.map(lang => getLanguageName(lang.key))
      : await fetchBookLanguages(data.key);

    return {
      id: data.key,
      title: data.title,
      authors,
      coverId: data.covers && data.covers.length > 0 ? data.covers[0] : undefined,
      firstPublishYear,
      description,
      subjects: subjects.length > 0 ? subjects : undefined,
      language: languages,
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
    return '/libro.PNG'; 
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};