import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';
import './styles/Exam.css';

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
    const [userResult, setUserResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch questions from API
        fetch(`${API_BASE}/questions`)
            .then(res => res.json())
            .then(qs => {
                // Shuffle and select up to 10
                const shuffled = qs.sort(() => Math.random() - 0.5);
                setQuestions(shuffled.slice(0, Math.min(10, shuffled.length)));
                setAnswers(Array(Math.min(10, shuffled.length)).fill(null));
            });

        // Check if user already attempted by querying results API
        const username = localStorage.getItem('username');
        if (username) {
            fetch(`${API_BASE}/results`)
                .then(res => res.json())
                .then(results => {
                    const found = results.find(r => r.username === username);
                    if (found) {
                        setAlreadyAttempted(true);
                        setUserResult(found);
                    }
                });
        }
    }, []);

    const handleChange = (qIdx, optIdx) => {
        const updated = [...answers];
        updated[qIdx] = optIdx;
        setAnswers(updated);
    };

    // On submit, POST result to API
    const handleSubmit = async (e) => {
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

        // Save result in backend
        const username = localStorage.getItem('username') || 'Unknown';
        await fetch(`${API_BASE}/results`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                marks,
                date: new Date().toLocaleString(),
                answers: answerDetails
            })
        });
    };

    if (alreadyAttempted) {
        if (userResult && userResult.answers) {
            // Show review
            return (
                <div className="exam-container">
                    <h2>Exam Attempt Review</h2>
                    <div className="exam-review-score">Your Score: {userResult.marks} / {userResult.answers.length}</div>
                    <hr />
                    <h3 style={{ color: "#00bcd4" }}>Review Your Answers:</h3>
                    {userResult.answers.map((q, idx) => (
                        <div key={idx} className="exam-review-block">
                            <div><strong>Q{idx + 1}: {q.question}</strong></div>
                            <ol className="exam-review-options" type="A">
                                {q.options.map((opt, oIdx) => {
                                    let liClass = "";
                                    if (q.selectedIndex === oIdx && oIdx === q.correctIndex) {
                                        liClass = "correct selected";
                                    } else if (q.selectedIndex === oIdx && oIdx !== q.correctIndex) {
                                        liClass = "incorrect selected";
                                    } else if (q.correctIndex === oIdx) {
                                        liClass = "correct";
                                    }
                                    return (
                                        <li key={oIdx} className={liClass}>
                                            <span
                                                className={
                                                    q.selectedIndex === oIdx
                                                        ? "option-value selected"
                                                        : "option-value"
                                                }
                                            >
                                                {opt}
                                            </span>
                                            {q.selectedIndex === oIdx && oIdx === q.correctIndex && ' (Your answer, Correct)'}
                                            {q.selectedIndex === oIdx && oIdx !== q.correctIndex && ' (Your answer)'}
                                            {q.correctIndex === oIdx && q.selectedIndex !== oIdx && ' (Correct answer)'}
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    ))}
                    <button className="exam-go-home-btn" onClick={() => navigate('/')}>Go Home</button>
                </div>
            );
        }

        // Fallback if no review data
        return (
            <div className="exam-container">
                <h2>Exam Already Attempted</h2>
                <p>You have already attempted the exam. You cannot attempt it again.</p>
                <button className="exam-go-home-btn" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="exam-container">No questions available.</div>;
    }

    if (submitted && submittedData) {
        return (
            <div className="exam-container">
                <h2>Exam Submitted!</h2>
                <div className="exam-review-score">Your Score: {score} / {questions.length}</div>
                <hr />
                <h3 style={{ color: "#00bcd4" }}>Review Your Answers:</h3>
                {submittedData.map((q, idx) => (
                    <div key={idx} className="exam-review-block">
                        <div><strong>Q{idx + 1}: {q.question}</strong></div>
                        <ol className="exam-review-options" type="A">
                            {q.options.map((opt, oIdx) => {
                                let liClass = "";
                                if (q.selectedIndex === oIdx && oIdx === q.correctIndex) {
                                    liClass = "correct selected";
                                } else if (q.selectedIndex === oIdx && oIdx !== q.correctIndex) {
                                    liClass = "incorrect selected";
                                } else if (q.correctIndex === oIdx) {
                                    liClass = "correct";
                                }
                                return (
                                    <li key={oIdx} className={liClass}>
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
                <button className="exam-go-home-btn" onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    }

    return (
        <div className="exam-container">
            <h2>Exam</h2>
            <form className="exam-form" onSubmit={handleSubmit}>
                {questions.map((q, idx) => (
                    <div key={idx} className="exam-question-block">
                        <div><strong>Q{idx + 1}: {q.question}</strong></div>
                        <ol className="exam-options" type="A">
                            {q.options.map((opt, oIdx) => (
                                <li
                                    key={oIdx}
                                    className={answers[idx] === oIdx ? "selected" : ""}
                                    onClick={() => handleChange(idx, oIdx)}
                                    tabIndex={0}
                                    onKeyPress={e => {
                                        if (e.key === " " || e.key === "Enter") handleChange(idx, oIdx);
                                    }}
                                    style={{ userSelect: "none" }}
                                >
                                    <span
                                        className={
                                            answers[idx] === oIdx
                                                ? "option-value selected"
                                                : "option-value"
                                        }
                                    >
                                        {opt}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
                <button className="exam-submit-btn" type="submit">Submit Exam</button>
            </form>
        </div>
    );
}

export default Exam;