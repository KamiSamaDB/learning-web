import React, { useEffect, useState } from 'react';

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
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Manage MCQ Questions</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 16 }}>
        <div>
          <input
            type="text"
            placeholder="Enter question"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            style={{ width: '90%' }}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          {newOptions.map((opt, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
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
                style={{ width: '70%' }}
              />
              <label style={{ marginLeft: 10 }}>
                <input
                  type="radio"
                  name="newCorrect"
                  checked={newCorrect === i}
                  onChange={() => setNewCorrect(i)}
                  required
                />
                Correct
              </label>
            </div>
          ))}
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Add Question</button>
      </form>
      <ul>
        {questions.map((q, idx) => (
          <li key={idx} style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            {editIndex === idx ? (
              <div>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={e => setEditQuestion(e.target.value)}
                  style={{ width: '90%' }}
                  required
                />
                <div style={{ marginTop: 10 }}>
                  {editOptions.map((opt, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const opts = [...editOptions];
                          opts[i] = e.target.value;
                          setEditOptions(opts);
                        }}
                        required
                        style={{ width: '70%' }}
                      />
                      <label style={{ marginLeft: 10 }}>
                        <input
                          type="radio"
                          name="editCorrect"
                          checked={editCorrect === i}
                          onChange={() => setEditCorrect(i)}
                          required
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleEditSave(idx)} style={{ marginRight: 5, marginTop: 5 }}>Save</button>
                <button onClick={() => setEditIndex(null)} style={{ marginTop: 5 }}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{q.question}</strong>
                <ol type="A">
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ color: q.correctIndex === i ? 'green' : undefined }}>
                      {opt} {q.correctIndex === i && <b>(Correct)</b>}
                    </li>
                  ))}
                </ol>
                <button onClick={() => handleEdit(idx)} style={{ marginRight: 5 }}>Edit</button>
                <button onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Questions;