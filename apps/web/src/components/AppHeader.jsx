import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const navClass = ({ isActive }) => (isActive ? 'active' : '');

const AppHeader = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="app-header" role="banner">
      <Link to="/" className="app-header__brand">KSBid</Link>
      {isAuthenticated && (
        <nav className="tabs" aria-label="Primary">
          <NavLink to="/evidence" className={navClass}>Evidence</NavLink>
          {isAdmin && (
            <NavLink to="/admin/queue" className={navClass}>Review Queue</NavLink>
          )}
          <NavLink to="/profile" className={navClass}>Profile</NavLink>
          <NavLink to="/auction" className={navClass}>Auction</NavLink>
          <button type="button" className="tabs__signout" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      )}
    </header>
  );
};

export default AppHeader;
