import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles/Header.css';

function Header() {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Helper to set active tab
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="mb-4">
      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item">
          <Link className={`nav-link ${isActive('/')}`} to="/">Home</Link>
        </li>
        {role === 'admin' && (
          <>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin')}`} to="/admin">Admin Panel</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/questions')}`} to="/questions">Questions</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/results')}`} to="/results">Results</Link>
            </li>
          </>
        )}
        {role === 'user' && (
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/exam')}`} to="/exam">Exam</Link>
          </li>
        )}
        <li className="nav-item ms-auto d-flex align-items-center">
          {role && (
            <>
              <span className="nav-link disabled" tabIndex={-1} aria-disabled="true" style={{ background: 'none', border: 'none' }}>
                {role === 'user' ? `User: ${username}` : 'Admin'}
              </span>
              <button className="btn btn-sm btn-danger ms-2" onClick={handleLogout}>Logout</button>
            </>
          )}
          {!role && (
            <Link className={`nav-link ${isActive('/login')}`} to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Header;