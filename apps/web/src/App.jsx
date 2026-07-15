import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute, GuestRoute, AdminRoute } from './components/RouteGuards';
import AppHeader from './components/AppHeader';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './pages/HomePage';
import EvidencePage from './pages/EvidencePage';
import AdminQueuePage from './pages/AdminQueuePage';
import ProfilePage from './pages/ProfilePage';
import { AuctionPage } from './pages/Auction';
import './App.css';

const AppRoutes = () => (
  <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <AppHeader />
    <Routes>
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/evidence" element={<ProtectedRoute><EvidencePage /></ProtectedRoute>} />
      <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin/queue" element={<AdminRoute><AdminQueuePage /></AdminRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
      <Route path="/auction" element={<ProtectedRoute><AuctionPage /></ProtectedRoute>} />
    </Routes>
  </>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
