import React from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>Admin Panel</h2>
      <button onClick={() => navigate('/questions')} style={{ margin: '10px' }}>
        Go to Questions
      </button>
      <button onClick={() => navigate('/results')} style={{ margin: '10px' }}>
        Go to Results
      </button>
    </div>
  );
}

export default Admin;