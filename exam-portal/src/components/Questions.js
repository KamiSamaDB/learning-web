import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import './styles/Questions.css';
import Loading from './Loading';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrect, setNewCorrect] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);
  const [editCorrect, setEditCorrect] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading Questions...');

  // Fetch questions from API
  useEffect(() => {
    setLoading(true);
    setLoadingText('Loading Questions...');
    fetch(`${API_BASE}/questions`)
      .then(res => res.json())
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, []); // <-- Only runs once on mount

  if (loading) return <Loading text={loadingText} />;

  // Add question
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText('Adding Question...');
    if (
      newQuestion.trim() &&
      newOptions.every(opt => opt.trim()) &&
      newCorrect >= 0 && newCorrect < 4
    ) {
      const res = await fetch(`${API_BASE}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion.trim(),
          options: newOptions.map(opt => opt.trim()),
          correctIndex: newCorrect
        })
      });
      const added = await res.json();
      setQuestions(qs => [...qs, added]);
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setNewCorrect(0);
    }
    setLoading(false);
    setLoadingText('Loading Questions...');
  };

  // Delete question
  const handleDelete = async (idx) => {
    setLoading(true);
    setLoadingText('Deleting Question...');
    const id = questions[idx]._id;
    await fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' });
    setQuestions(qs => qs.filter((_, i) => i !== idx));
    setLoading(false);
    setLoadingText('Loading Questions...');
  };

  // Edit question
  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditQuestion(questions[idx].question);
    setEditOptions([...questions[idx].options]);
    setEditCorrect(questions[idx].correctIndex);
  };

  const handleEditSave = async (idx) => {
    setLoading(true);
    setLoadingText('Saving Changes...');
    const id = questions[idx]._id;
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: editQuestion.trim(),
        options: editOptions.map(opt => opt.trim()),
        correctIndex: editCorrect
      })
    });
    const updated = await res.json();
    setQuestions(qs => qs.map((q, i) => i === idx ? updated : q));
    setEditIndex(null);
    setLoading(false);
    setLoadingText('Loading Questions...');
  };

  return (
    <div className="questions-container">
      <h2>Manage MCQ Questions</h2>
      <form className="questions-form" onSubmit={handleAdd}>
        <div>
          <input
            type="text"
            placeholder="Enter question"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          {newOptions.map((opt, i) => (
            <div className="option-row" key={i}>
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => {
                  const opts = [...newOptions];
                  opts[i] = e.target.value;
                  setNewOptions(opts);
                }}
                required
              />
              <button
                type="button"
                className={`correct-btn${newCorrect === i ? ' selected' : ''}`}
                onClick={() => setNewCorrect(i)}
              >
                {newCorrect === i ? 'Correct' : 'Mark as Correct'}
              </button>
            </div>
          ))}
        </div>
        <button type="submit">Add Question</button>
      </form>
      <ul className="questions-list">
        {questions.map((q, idx) => (
          <li key={idx} className={editIndex === idx ? "editing" : ""}>
            {editIndex === idx ? (
              <div>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={e => setEditQuestion(e.target.value)}
                  required
                />
                <div style={{ marginTop: 10 }}>
                  {editOptions.map((opt, i) => (
                    <div className="option-row" key={i}>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const opts = [...editOptions];
                          opts[i] = e.target.value;
                          setEditOptions(opts);
                        }}
                        required
                      />
                      <button
                        type="button"
                        className={`correct-btn${editCorrect === i ? ' selected' : ''}`}
                        onClick={() => setEditCorrect(i)}
                      >
                        {editCorrect === i ? 'Correct' : 'Mark as Correct'}
                      </button>
                    </div>
                  ))}
                </div>
                <button className="save-btn" onClick={() => handleEditSave(idx)} style={{ marginRight: 5, marginTop: 5 }}>Save</button>
                <button className="cancel-btn" onClick={() => setEditIndex(null)} style={{ marginTop: 5 }}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{q.question}</strong>
                <ol type="A">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      <span className={`option-value${q.correctIndex === i ? ' correct' : ''}`}>
                        {opt} {q.correctIndex === i && <b>(Correct)</b>}
                      </span>
                    </li>
                  ))}
                </ol>
                <button className="edit-btn" onClick={() => handleEdit(idx)} style={{ marginRight: 5 }}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Questions;