import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('questions')) || [];
    setQuestions(stored);
    setAnswers(Array(stored.length).fill(null));

    // Check if user already attempted
    const username = localStorage.getItem('username');
    const results = JSON.parse(localStorage.getItem('results')) || [];
    if (username && results.some(r => r.username === username)) {
      setAlreadyAttempted(true);
    }
  }, []);

  const handleChange = (qIdx, optIdx) => {
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let marks = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) marks++;
    });
    setScore(marks);
    setSubmitted(true);

    // Save result in localStorage
    const username = localStorage.getItem('username') || 'Unknown';
    const results = JSON.parse(localStorage.getItem('results')) || [];
    results.push({
      username,
      marks,
      date: new Date().toLocaleString()
    });
    localStorage.setItem('results', JSON.stringify(results));
  };

  if (alreadyAttempted) {
    return (
      <div style={{ margin: 40 }}>
        <h2>Exam Already Attempted</h2>
        <p>You have already attempted the exam. You cannot attempt it again.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div style={{ margin: 40 }}>No questions available.</div>;
  }

  if (submitted) {
    return (
      <div style={{ margin: 40 }}>
        <h2>Exam Submitted!</h2>
        <p>Your Score: {score} / {questions.length}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Exam</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <div><strong>Q{idx + 1}: {q.question}</strong></div>
            <ol type="A">
              {q.options.map((opt, oIdx) => (
                <li key={oIdx}>
                  <label>
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={oIdx}
                      checked={answers[idx] === oIdx}
                      onChange={() => handleChange(idx, oIdx)}
                      required
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <button type="submit">Submit Exam</button>
      </form>
    </div>
  );
}

export default Exam;