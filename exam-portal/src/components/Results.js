import React, { useEffect, useState } from 'react';

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('results')) || [];
    setResults(stored);
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>User Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Marks</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td>{r.username}</td>
                <td>{r.marks}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Results;