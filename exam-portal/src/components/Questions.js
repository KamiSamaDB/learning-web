import React, { useEffect, useState } from 'react';
import './styles/Questions.css';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrect, setNewCorrect] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState(['', '', '', '']);
  const [editCorrect, setEditCorrect] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('questions')) || [];
    setQuestions(stored);
  }, []);

  const saveQuestions = (updated) => {
    setQuestions(updated);
    localStorage.setItem('questions', JSON.stringify(updated));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (
      newQuestion.trim() &&
      newOptions.every(opt => opt.trim()) &&
      newCorrect >= 0 && newCorrect < 4
    ) {
      const updated = [
        ...questions,
        {
          question: newQuestion.trim(),
          options: newOptions.map(opt => opt.trim()),
          correctIndex: newCorrect
        }
      ];
      saveQuestions(updated);
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setNewCorrect(0);
    }
  };

  const handleDelete = (idx) => {
    const updated = questions.filter((_, i) => i !== idx);
    saveQuestions(updated);
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    setEditQuestion(questions[idx].question);
    setEditOptions([...questions[idx].options]);
    setEditCorrect(questions[idx].correctIndex);
  };

  const handleEditSave = (idx) => {
    if (
      editQuestion.trim() &&
      editOptions.every(opt => opt.trim()) &&
      editCorrect >= 0 && editCorrect < 4
    ) {
      const updated = questions.map((q, i) =>
        i === idx
          ? {
              question: editQuestion.trim(),
              options: editOptions.map(opt => opt.trim()),
              correctIndex: editCorrect
            }
          : q
      );
      saveQuestions(updated);
      setEditIndex(null);
      setEditQuestion('');
      setEditOptions(['', '', '', '']);
      setEditCorrect(0);
    }
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