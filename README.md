# Library

## Descripción

Library es una aplicación web de biblioteca de una sola página (SPA) desarrollada con React 18 y TypeScript, diseñada para ofrecer una experiencia interactiva y personalizada para la gestión de libros. La aplicación integra la API pública de Open Library para acceder a un vasto catálogo de libros, permitiendo búsquedas avanzadas, visualización de detalles y gestión de colecciones personales. Utiliza localStorage del navegador para persistir datos de usuarios, listas de deseos (wishlist) y préstamos, simulando un backend local sin necesidad de servidores externos.

El proyecto aborda desafíos comunes en aplicaciones web modernas, como el manejo eficiente de estado global, optimización de performance en búsquedas API y diseño responsivo. Es ideal para usuarios que buscan una herramienta intuitiva para explorar literatura, gestionar lecturas pendientes y rastrear préstamos, todo dentro de un entorno seguro y offline-capable.

**Enlace en Vivo:** [LIBRARY-SAM](https://librarysam.netlify.app)

---

## Características Principales

### Exploración y Búsqueda de Libros

- **Búsqueda Avanzada**: Implementa un motor de búsqueda que consulta la API de Open Library (`/search.json`) con parámetros como título, autor, tema, idioma y año de publicación. Soporta consultas complejas mediante concatenación de filtros en la URL.
- **Filtros y Ordenamiento**: Panel de filtros dinámico con opciones para ordenar resultados por fecha (nuevo/viejo), título o autor. Los filtros se aplican en tiempo real, actualizando la query de búsqueda.
- **Paginación**: Manejo de resultados paginados con un límite de 10 libros por página, optimizando la carga de datos. Incluye navegación con botones prev/next y indicadores de página.
- **Visualización de Detalles**: Página dedicada para cada libro, obteniendo datos adicionales de `/works/{id}.json`, incluyendo descripciones, idiomas y temas. Portadas se cargan desde `covers.openlibrary.org` con fallbacks a placeholders.

### Autenticación y Gestión de Usuarios

- **Registro y Login**: Sistema de autenticación basado en localStorage, donde usuarios se registran con nombre de usuario y contraseña (mínimo 6 caracteres). Las credenciales se validan contra una lista almacenada en `lib_users`. Tokens simulados (`lib_auth_token`) mantienen sesiones activas.
- **Protección de Rutas**: Uso de ProtectedRoute para restringir acceso a páginas como wishlist y préstamos. Si no hay sesión, redirige a login.
- **Perfil de Usuario**: Permite visualizar información del usuario actual y cambiar contraseña, con validaciones de seguridad (verificación de contraseña actual).

### Lista de Deseos (Wishlist)

- **Gestión Personalizada**: Los usuarios pueden añadir/eliminar libros de una wishlist persistida en `lib_wishlist`. La lista se sincroniza con la sesión del usuario y se muestra en una grid responsiva.
- **Interfaz Interactiva**: Botones en tarjetas de libros permiten acciones rápidas, con notificaciones de éxito/error.

### Sistema de Préstamos (Loans)

- **Préstamo de Libros**: Los usuarios pueden prestar libros, creando un registro en `lib_loans` con fecha de préstamo, vencimiento (14 días por defecto) y estado (activo/returned/overdue).
- **Historial y Devoluciones**: Página dedicada para ver préstamos activos e históricos. Funcionalidad para marcar libros como devueltos, actualizando el estado y fecha de retorno.
- **Validaciones**: Previene préstamos duplicados y verifica autenticación antes de operaciones.

### Persistencia de Datos con localStorage

**Estructura de Almacenamiento:**

- `lib_users`: Array de objetos User (id, username, password).
- `lib_user`: Objeto del usuario logueado (sin password por seguridad).
- `lib_wishlist`: Array de objetos Book para la wishlist.
- `lib_loans`: Array de objetos Loan con detalles de préstamos.
- `lib_auth_token`: Token base64 simulado para autenticación.

**Ventajas:** No requiere backend; datos persisten entre sesiones del navegador.  
**Desventajas:** Limitado a un dispositivo; aun no escalable para múltiples usuarios reales.  
**Manejo de Errores:** Try-catch en operaciones de localStorage para robustez.

### API Integrada: Open Library

**Endpoints Utilizados:**

- Búsqueda: `https://openlibrary.org/search.json?q={query}&limit={limit}&offset={offset}&{filters}`
- Detalles: `https://openlibrary.org/works/{id}.json`
- Portadas: `https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg`

**Mapeo de Datos:** Interfaces TypeScript (OpenLibraryDoc, OpenLibraryWork) para parsear respuestas JSON. Conversión a objetos Book locales.

**Optimizaciones:** Caching implícito vía localStorage para wishlist/loans; debouncing para evitar rate limits.

### Interfaz de Usuario y UX

- **Diseño Responsivo**: CSS personalizado con variables CSS para temas oscuros/claros. Grid layouts adaptativos para móviles y desktop.
- **Componentes Reutilizables**: Botones, inputs, listas y spinners con props para variantes (primary, secondary, danger).
- **Navegación**: React Router con rutas protegidas y breadcrumbs implícitos.
- **Accesibilidad**: Labels en formularios, ARIA roles en botones y navegación por teclado.

### Performance y Optimizaciones

- **Debouncing**: Hook useDebounce (500ms) en búsquedas para reducir llamadas API excesivas.
- **Lazy Loading**: Imágenes de portadas cargan on-demand con onError para fallbacks.
- **Estado Eficiente**: Context API (AuthContext, BooksContext) para estado global, minimizando re-renders. Hooks personalizados como useLocalStorage para persistencia.
- **Bundle Optimizado**: Vite genera builds eficientes; tree-shaking elimina código no usado.
- **Paginación y Límite**: Reduce carga inicial; solo 10 libros por fetch.

---

## Tecnologías Usadas

- **Frontend Framework**: React 18 con hooks (useState, useEffect, useContext) y TypeScript para tipado fuerte.
- **Enrutamiento**: React Router DOM para navegación SPA.
- **Estilos**: CSS puro con módulos y variables CSS (`:root`) para temas dinámicos.
- **API Externa**: Open Library API (RESTful, sin autenticación requerida).
- **Persistencia**: localStorage API del navegador para simulación de backend.

**Herramientas de Desarrollo:**

- Build Tool: Vite para desarrollo rápido y builds optimizados.
- Testing: Jest y React Testing Library para unit tests (e.g., componentes Button, Input).
- Linting: ESLint con reglas de React/TypeScript.
- Versionado: Git con commits descriptivos.

**Dependencias Clave:** implícito vía fetch; hooks personalizados para lógica reutilizable.

---

## Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── api/                 # Integración con Open Library API
│   ├── openLibrary.ts   # Funciones para búsquedas y detalles
├── components/          # Componentes reutilizables
│   ├── books/           # BookCard, BookList, FiltersPanel
│   ├── common/          # Button, Input, LoadingSpinner, etc.
│   ├── forms/           # LoginForm, RegisterForm
│   ├── layout/          # Header, Footer
├── context/             # Estado global con Context API
│   ├── AuthProvider.tsx # Autenticación
│   ├── BooksProvider.tsx # Gestión de libros
├── hooks/               # Hooks personalizados
│   ├── useAuth.ts       # Acceso a AuthContext
│   ├── useBooks.ts      # Acceso a BooksContext
│   ├── useDebounce.ts   # Debouncing para búsquedas
│   ├── useLocalStorage.ts # Persistencia local
├── pages/               # Páginas principales
│   ├── HomePage.tsx     # Página de inicio con libros destacados
│   ├── BookListPage.tsx # Búsqueda y filtros
│   ├── BookDetailPage.tsx # Detalles de un libro
│   ├── WishlistPage.tsx # Gestión de wishlist
│   ├── LoansPage.tsx    # Historial de préstamos
│   ├── ProfilePage.tsx  # Perfil de usuario
├── services/            # Lógica de negocio y persistencia
│   ├── authService.ts   # Registro, login, logout
│   ├── loanService.ts   # Gestión de préstamos
│   ├── localStorageService.ts # Utilidades para localStorage
├── types/               # Definiciones TypeScript
│   ├── book.d.ts        # Interface Book
│   ├── loan.d.ts        # Interface Loan
│   ├── user.d.ts        # Interface User
├── utils/               # Utilidades auxiliares
│   ├── helpers.ts       # Funciones como formatDate
├── App.tsx              # Componente raíz con rutas
├── main.tsx             # Punto de entrada
```

### Diagrama de Arquitectura

```
[Usuario] --> [React SPA (Frontend)]
                |
                +-- [React Router] --> Páginas (Home, Books, etc.)
                |
                +-- [Context API] --> Estado Global (Auth, Books)
                |
                +-- [Hooks Personalizados] --> useDebounce, useLocalStorage
                |
                +-- [API Layer] --> Open Library API (fetch)
                |
                +-- [Persistencia] --> localStorage (Usuarios, Wishlist, Loans)
```

### Flujo de Datos

- **Búsqueda**: Usuario ingresa query → BooksContext.search() → Debounced fetch a Open Library → Actualiza estado → Renderiza BookList.
- **Autenticación**: Usuario registra/loguea → AuthService valida → Guarda en localStorage → Actualiza AuthContext.
- **Préstamos**: Usuario presta libro → LoanService.addLoan() → Persiste en localStorage → Actualiza UI.

---

## Instalación y Configuración

### Prerrequisitos

- Node.js ≥16.0.0
- npm ≥8.0.0 o yarn ≥1.22.0
- Navegador moderno con soporte para localStorage y ES6+

### Pasos de Instalación

1. **Clona el Repositorio:**

```bash
git clone 
cd biblioteca-spa
```

2. **Instala Dependencias:**

```bash
npm install

```

3. **Configura Variables de Entorno (Opcional):**

No se requieren, ya que la API es pública. Para desarrollo local, ajusta `BASE_URL` en `openLibrary.ts` si es necesario.

4. **Ejecuta en Desarrollo:**

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador. La app recarga automáticamente con cambios.

5. **Build para Producción:**

```bash
npm run build
npm run preview 
```

6. **Ejecuta Tests:**

```bash
npm run test
```

Incluye tests para componentes como Button y hooks como useLocalStorage.

### Configuración Adicional

- **localStorage**: Asegúrate de que el navegador no bloquee localStorage (habilitado por defecto).
- **API Limits**: Open Library no tiene rate limits estrictos, pero usa debouncing para evitar sobrecargas.


---

## Uso

### Guía de Usuario

1. **Inicio**: Visita la home page para ver libros destacados.
2. **Registro/Login**: Crea una cuenta o inicia sesión para acceder a features personalizadas.
3. **Búsqueda**: Usa la barra en el header o la página de libros. Aplica filtros avanzados.
4. **Detalles**: Haz clic en un libro para ver info completa y acciones (wishlist, prestar).
5. **Wishlist**: Añade libros y gestiona desde la página dedicada.
6. **Préstamos**: Presta libros y devuelve desde Mis Préstamos.
7. **Perfil**: Cambia contraseña en la página de perfil.

---

## API y Datos

### Open Library API

**Documentación:** [Open Library API Docs](https://openlibrary.org/developers/api)

**Ejemplo de Respuesta de Búsqueda:**

```json
{
  "docs": [
    {
      "key": "/works/OL45804W",
      "title": "Harry Potter and the Philosopher's Stone",
      "author_name": ["J.K. Rowling"],
      "cover_i": 12345,
      "first_publish_year": 1997
    }
  ],
  "numFound": 100
}
```

**Manejo de Errores:** Si la API falla, muestra mensajes de error y usa datos cached si disponibles.

### Estructuras de Datos (TypeScript)

**Book Interface:**

```typescript
interface Book {
  id: string;
  title: string;
  authors?: string[];
  coverId?: number;
  firstPublishYear?: number;
  description?: string;
  subjects?: string[];
  language?: string[];
}
```

**Loan Interface:**

```typescript
interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  dueDate: string;
  status: 'active' | 'returned' | 'overdue';
}
```

---

## Performance y Optimizaciones Técnicas

- **Debouncing en Búsquedas**: Evita llamadas API excesivas con un delay de 500ms, reduciendo latencia y uso de red.
- **Lazy Loading de Imágenes**: Portadas cargan solo cuando entran en viewport, mejorando tiempos de carga inicial.
- **Memoización**: Uso de React.memo en componentes pesados como BookList.
- **Bundle Analysis**: Vite optimiza imports; tamaño típico del bundle: ~200KB gzipped.
- **Testing de Performance**: Tests unitarios cubren hooks y componentes; simula escenarios de alta carga.

---

## Testing

**Framework:** Jest + React Testing Library.

**Cobertura:** Tests para componentes (Button, Input), hooks (useLocalStorage) y servicios (authService).

**Ejemplo de Test:**

```typescript
test('Button renders with children', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

**Ejecutar Tests:** `npm run test `

---

## Desafíos Técnicos y Soluciones

- **Manejo de Estado Global**: Context API resuelve prop drilling; hooks personalizados simplifican acceso.
- **Persistencia Local**: localStorage limita escalabilidad, pero es ideal para prototipos. Solución: Simula backend con validaciones.
- **Integración API**: Mapeo de respuestas JSON a tipos TypeScript evita errores runtime.
- **Responsividad**: CSS Grid y Flexbox adaptan layouts; media queries para móviles.
- **Seguridad**: Contraseñas no se almacenan en texto plano; tokens simulados.

---

## Autor

**Desarrollado por:** [Samuel Zamudio]  
**Email:** [samuel.zamudio@jala.university]  
**github:** [github-SamuelZamudio-Library](https://github.com/SamZam01/library)  

---
