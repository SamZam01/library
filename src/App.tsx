import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { BooksProvider } from './context/BooksProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import WishlistPage from './pages/WishlistPage';
import LoansPage from './pages/LoansPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <BooksProvider>
          <Header />
          <main className="app-main-content"> {/* Contenido principal de la app */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/books" element={<BookListPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              {/* Rutas protegidas que requieren autenticación */}
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {}
              {}
              <Route path="*" element={<NotFoundPage />} /> {/* Ruta 404 */}
            </Routes>
          </main>
          <Footer />
        </BooksProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
