import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      style={{
      padding: '15px 30px',
      backgroundColor: '#2c3e50',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Healthcare Portal
      </div>
      
      {isAuthenticated && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <Link to="/search" style={{ color: 'white', textDecoration: 'none' }}>
            Search
          </Link>
          <Link to="/book" style={{ color: 'white', textDecoration: 'none' }}>
            Book
          </Link>
          <Link to="/appointments" style={{ color: 'white', textDecoration: 'none' }}>
            Appointments
          </Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
            Profile
          </Link>
          <span style={{ marginLeft: '20px' }}>
            Hi, {user?.name}
          </span>
          <button
            onClick={handleLogout}
            aria-label="Logout from your account"
            style={{
              padding: '5px 15px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
