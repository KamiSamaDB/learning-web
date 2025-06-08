import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import './styles/Results.css';
import Loading from './Loading';

function Results() {
  const [results, setResults] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/results`)
      .then(res => res.json())
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading Results..."/>;

  if (reviewIdx !== null && results[reviewIdx]) {
    const review = results[reviewIdx];
    return (
      <div className="review-section results-container" style={{ maxWidth: 700, margin: '40px auto' }}>
        <h2>Review Attempt: {review.username}</h2>
        <p>
          <b>Score:</b> {review.marks}<br />
          <b>Date:</b> {review.date}
        </p>
        <hr />
        <h3>Answers:</h3>
        {review.answers && review.answers.length > 0 ? (
          review.answers.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 24 }}>
              <div><strong>Q{idx + 1}: {q.question}</strong></div>
              <ol type="A">
                {q.options.map((opt, oIdx) => {
                  let style = {};
                  if (q.selectedIndex === oIdx && oIdx === q.correctIndex) {
                    style = { color: 'green', fontWeight: 'bold' };
                  } else if (q.selectedIndex === oIdx && oIdx !== q.correctIndex) {
                    style = { color: 'red', fontWeight: 'bold' };
                  } else if (q.correctIndex === oIdx) {
                    style = { color: 'green', fontWeight: 'bold' };
                  }
                  return (
                    <li key={oIdx} style={style}>
                      {opt}
                      {q.selectedIndex === oIdx && oIdx === q.correctIndex && ' (User answer, Correct)'}
                      {q.selectedIndex === oIdx && oIdx !== q.correctIndex && ' (User answer)'}
                      {q.correctIndex === oIdx && q.selectedIndex !== oIdx && ' (Correct answer)'}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))
        ) : (
          <p>No answer details available.</p>
        )}
        <button onClick={() => setReviewIdx(null)}>Back to Results</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>User Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="results-table" border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Marks</th>
              <th>Date</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td>{r.username}</td>
                <td>{r.marks}</td>
                <td>{r.date}</td>
                <td>
                  <button onClick={() => setReviewIdx(idx)}>Review Attempt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Results;