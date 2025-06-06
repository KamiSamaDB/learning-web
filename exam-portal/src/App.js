import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import Admin from './components/Admin';
import Questions from './components/Questions';
import Results from './components/Results';
import Exam from './components/Exam';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    Edit <code>src/App.js</code> and save to reload.
                  </p>
                  <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn React
                  </a>
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