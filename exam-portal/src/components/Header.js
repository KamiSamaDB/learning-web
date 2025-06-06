import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav style={{ padding: 16, background: '#eee', marginBottom: 24 }}>
      <Link to="/" style={{ marginRight: 16 }}>Home</Link>
      {role === 'admin' && (
        <>
          <Link to="/admin" style={{ marginRight: 16 }}>Admin Panel</Link>
          <Link to="/questions" style={{ marginRight: 16 }}>Questions</Link>
          <Link to="/results" style={{ marginRight: 16 }}>Results</Link>
        </>
      )}
      {role === 'user' && (
        <>
          <Link to="/exam" style={{ marginRight: 16 }}>Exam</Link>
        </>
      )}
      {role && (
        <>
          <span style={{ marginRight: 16 }}>
            {role === 'user' ? `User: ${username}` : 'Admin'}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {!role && (
        <Link to="/login" style={{ marginLeft: 16 }}>Login</Link>
      )}
    </nav>
  );
}

export default Header;