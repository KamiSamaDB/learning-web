import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Fisher-Yates shuffle
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function Exam() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [alreadyAttempted, setAlreadyAttempted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('questions')) || [];
        // Shuffle all questions first
        const shuffledAll = shuffleArray(stored);
        // Take up to 10 questions
        const selected = shuffledAll.slice(0, Math.min(10, shuffledAll.length));
        setQuestions(selected);
        setAnswers(Array(selected.length).fill(null));

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
        const answerDetails = questions.map((q, idx) => {
            const selected = answers[idx];
            const correct = q.correctIndex;
            let isCorrect = selected === correct;
            if (isCorrect) {
                marks++;
            } else {
                marks -= 0.25;
            }
            return {
                question: q.question,
                options: q.options,
                correctIndex: correct,
                selectedIndex: selected
            };
        });
        setScore(marks);
        setSubmitted(true);
        setSubmittedData(answerDetails);

        // Save result in localStorage
        const username = localStorage.getItem('username') || 'Unknown';
        const results = JSON.parse(localStorage.getItem('results')) || [];
        results.push({
            username,
            marks,
            date: new Date().toLocaleString(),
            answers: answerDetails
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

    if (submitted && submittedData) {
        return (
            <div style={{ margin: 40 }}>
                <h2>Exam Submitted!</h2>
                <p>Your Score: {score} / {questions.length}</p>
                <hr />
                <h3>Review Your Answers:</h3>
                {submittedData.map((q, idx) => (
                    <div key={idx} style={{ marginBottom: 24 }}>
                        <div><strong>Q{idx + 1}: {q.question}</strong></div>
                        <ol type="A">
                            {q.options.map((opt, oIdx) => {
                                // Determine color
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
                                        {q.selectedIndex === oIdx && oIdx === q.correctIndex && ' (Your answer, Correct)'}
                                        {q.selectedIndex === oIdx && oIdx !== q.correctIndex && ' (Your answer)'}
                                        {q.correctIndex === oIdx && q.selectedIndex !== oIdx && ' (Correct answer)'}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                ))}
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