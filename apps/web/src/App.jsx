import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const AppHeader = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-header" role="banner">
      <a href="/" className="app-header__brand">KSBid</a>
      {isAuthenticated && (
        <button type="button" className="gel-button" onClick={handleLogout}>
          Sign out
        </button>
      )}
    </header>
  );
};

const HomePage = () => (
  <main className="app-main">
    <h1 className="gel-great-primer-bold">Welcome to KSBid</h1>
    <p>You are signed in.</p>
  </main>
);

const AppRoutes = () => (
  <>
    <AppHeader />
    <Routes>
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
