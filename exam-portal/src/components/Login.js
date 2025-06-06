import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loggedInAs, setLoggedInAs] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminError, setAdminError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setLoggedInAs(role);
    }
  }, []);

  const handleLogin = (role) => {
    if (role === 'admin') {
      setShowAdminInput(true);
      setShowUsernameInput(false);
      setAdminError('');
      setUsername('');
      setPassword('');
    }
  };

  const handleUserLoginClick = () => {
    setShowUsernameInput(true);
    setShowAdminInput(false);
    setUsername('');
    setPassword('');
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('role', 'user');
      localStorage.setItem('username', username.trim());
      setLoggedInAs('user');
      navigate('/exam');
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin@123') {
      localStorage.setItem('role', 'admin');
      setLoggedInAs('admin');
      setAdminError('');
      navigate('/admin');
    } else {
      setAdminError('Invalid admin credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setLoggedInAs(null);
    setUsername('');
    setPassword('');
    setShowUsernameInput(false);
    setShowAdminInput(false);
    setAdminError('');
  };

  return (
    <div>
      <h2>Login Page</h2>
      {loggedInAs ? (
        <div>
          <p>
            You are logged in as <strong>{loggedInAs}</strong>
            {loggedInAs === 'user' && localStorage.getItem('username') ? (
              <> ({localStorage.getItem('username')})</>
            ) : null}
            .
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleLogin('admin')}>Sign in as Admin</button>
          <button onClick={handleUserLoginClick}>Sign in as User</button>
          {showUsernameInput && (
            <form onSubmit={handleUsernameSubmit} style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <button type="submit">Continue</button>
            </form>
          )}
          {showAdminInput && (
            <form onSubmit={handleAdminSubmit} style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Admin username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ marginLeft: '10px' }}
              />
              <button type="submit" style={{ marginLeft: '10px' }}>Login</button>
              {adminError && (
                <div style={{ color: 'red', marginTop: '5px' }}>{adminError}</div>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
