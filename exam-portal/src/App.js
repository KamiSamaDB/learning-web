import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './components/images/logo.png';
import './App.css';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import Admin from './components/Admin';
import Questions from './components/Questions';
import Results from './components/Results';
import Exam from './components/Exam';
import Header from './components/Header';


function App() {
  const [storedRole, setStoredRole] = React.useState(localStorage.getItem('role'));

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login setStoredRole={setStoredRole} />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <div className="App">
                <header className="App-header">
                  <img src={logo} alt="logo" />
                  <h1 style={{ color: "#00bcd4", marginBottom: 16 }}>Welcome to the Exam Portal</h1>
                  <p style={{ fontSize: "1.2rem", marginBottom: 32 }}>
                    Take online exams, manage questions, and view results in a modern, secure portal.
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                    <Link to="/exam">
                      <button>Take Exam</button>
                    </Link>
                    <Link to="/results">
                      <button>View Results</button>
                    </Link>
                  </div>
                  <p style={{ marginTop: 32, color: "#888" }}>
                    {storedRole === 'admin'
                      ? "You are logged in as Admin. Use the navigation above to manage questions and results."
                      : localStorage.getItem('username')
                        ? `Good luck, ${localStorage.getItem('username')}!`
                        : "Please login to get started."}

                    {/* {localStorage.getItem('role') === 'admin'
                      ? "You are logged in as Admin. Use the navigation above to manage questions and results."
                      : localStorage.getItem('username')
                        ? `Good luck, ${localStorage.getItem('username')}!`
                        : "Please login to get started."} */}
                  </p>
                </header>
              </div>
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth admin={true}>
              <Admin />
            </RequireAuth>
          }
        />
        {/* You can add /questions and /results routes here later */}
        <Route
          path="/questions"
          element={
            <RequireAuth admin={true}>
              <Questions />
            </RequireAuth>
          }
        />
        <Route
          path="/results"
          element={
            <RequireAuth admin={true}>
              <Results />
            </RequireAuth>
          }
        />
        <Route
          path="/exam"
          element={
            <RequireAuth>
              <Exam />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;