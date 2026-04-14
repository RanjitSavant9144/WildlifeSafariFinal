import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🦁 Wildlife Safari
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/slots" className="navbar-link">Book Safari</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="navbar-link">Admin</Link>
                </li>
              )}
              <li>
                <span className="navbar-link">👤 {user?.firstName}</span>
              </li>
              <li>
                <button onClick={logout} className="btn btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li>
                <Link to="/register">
                  <button className="btn btn-primary">Register</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
