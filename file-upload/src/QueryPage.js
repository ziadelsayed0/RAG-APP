import React, { useState, useEffect } from "react";
import axios from "axios";

const QueryPage = () => {
    const [projectId, setProjectId] = useState(0); 
    const [userId, setUserId] = useState(1); 
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [answerWithout, setAnswerWithout] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [history, setHistory] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [limit, setLimit] = useState(5); // Default limit set to 5

    // Load history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('queryHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save history to localStorage when it changes
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem('queryHistory', JSON.stringify(history));
        }
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || loading) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`http://127.0.0.1:5000/nlp/answer/${projectId}/${userId}`, {
                text: question,
                limit: limit, // Using the limit state
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            const ragAnswer = response.data?.answer_with_RAG || "No answer available";
            const directAnswer = response.data?.answer_without_RAG || "No direct LLM response";
            
            setAnswer(ragAnswer);
            setAnswerWithout(directAnswer);
            
            // Add to history
            setHistory(prev => [
                {
                    question,
                    answer: ragAnswer,
                    timestamp: new Date().toISOString()
                },
                ...prev.slice(0, 9) // Keep only last 10 items
            ]);
            
        } catch (error) {
            console.error("Error submitting question:", error);
            setError("Failed to get an answer. Please try again.");
        } finally {
            setLoading(false);
            setIsTyping(false);
        }
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
        setCharCount(e.target.value.length);
        setIsTyping(true);
    };

    const loadFromHistory = (item) => {
        setQuestion(item.question);
        setAnswer(item.answer);
        setAnswerWithout("");
        setShowAdvanced(false);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-lg">
                        <div className="card-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0">RAG Assistant</h2>
                                {history.length > 0 && (
                                    <button 
                                        className="btn btn-sm btn-light"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                    >
                                        {showAdvanced ? (
                                            <>
                                                <span className="me-1">↑</span>
                                                Hide History
                                            </>
                                        ) : (
                                            <>
                                                <span className="me-1">H</span>
                                                Show History ({history.length})
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="project" className="form-label fw-bold">Project</label>
                                        <select
                                            className="form-select"
                                            id="project"
                                            value={projectId === 1 ? "ensofia" : projectId}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setProjectId(value === "ensofia" ? 1 : Number(value));
                                            }}
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Select a project</option>
                                            <option value="ensofia">ensofia</option>
                                            <option value="2">project 2</option>
                                            <option value="3">project 3</option>
                                            <option value="4">project 4</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="userId" className="form-label fw-bold">User ID</label>
                                        <div className="input-group">
                                            <button 
                                                className="btn btn-outline-secondary" 
                                                type="button"
                                                onClick={() => setUserId(prev => (prev > 1 ? prev - 1 : 1))}
                                                disabled={loading}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                id="userId"
                                                value={userId}
                                                onChange={(e) => setUserId(Number(e.target.value))}
                                                min="1"
                                                required
                                                disabled={loading}
                                            />
                                            <button 
                                                className="btn btn-outline-secondary" 
                                                type="button"
                                                onClick={() => setUserId(prev => prev + 1)}
                                                disabled={loading}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="limit" className="form-label fw-bold">Searching Limit</label>
                                        <select
                                            className="form-select"
                                            id="limit"
                                            value={limit}
                                            onChange={(e) => setLimit(Number(e.target.value))}
                                            disabled={loading}
                                        >
                                            {[1, 3, 5, 10, 20].map(num => (
                                                <option key={num} value={num}>
                                                    {num} result{num !== 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4 position-relative">
                                    <label htmlFor="question" className="form-label fw-bold">
                                        Your Question
                                        <span className="text-danger">*</span>
                                        <small className="text-muted float-end">
                                            {charCount}/500 {isTyping && (
                                                <span className="spinner-border spinner-border-sm ms-1" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </span>
                                            )}
                                        </small>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="question"
                                        value={question}
                                        onChange={handleQuestionChange}
                                        rows="5"
                                        placeholder="Ask your question here..."
                                        required
                                        disabled={loading}
                                        maxLength="500"
                                    ></textarea>
                                    <div className="form-text">
                                        Be specific with your question for better results
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg"
                                        disabled={loading || !question.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </span>
                                                Analyzing Question...
                                            </>
                                        ) : (
                                            <>
                                                <span className="me-2">→</span>
                                                Get Expert Answer
                                            </>
                                        )}
                                    </button>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3 d-flex align-items-center">
                                        <span className="me-2">!</span>
                                        <div>{error}</div>
                                    </div>
                                )}
                            </form>

                            {showAdvanced && history.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="h5 mb-3">Recent Questions</h4>
                                    <div className="list-group">
                                        {history.map((item, index) => (
                                            <button
                                                key={index}
                                                className="list-group-item list-group-item-action text-start"
                                                onClick={() => loadFromHistory(item)}
                                            >
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-truncate">{item.question}</span>
                                                    <small className="text-muted">
                                                        {new Date(item.timestamp).toLocaleTimeString()}
                                                    </small>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(answer || answerWithout) && (
                                <div className="mt-5">
                                    <h3 className="h4 mb-3">Answers</h3>
                                    
                                    <div className="card mb-4 border-success">
                                        <div className="card-header bg-success bg-opacity-10 text-success d-flex justify-content-between align-items-center">
                                            <strong>Enhanced Knowledge Answer</strong>
                                            <span className="badge bg-success">RAG</span>
                                        </div>
                                        <div className="card-body">
                                            {answer ? (
                                                <div className="answer-content" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {answer}
                                                </div>
                                            ) : (
                                                <div className="text-muted">
                                                    No enhanced answer available
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card border-info">
                                        <div className="card-header bg-info bg-opacity-10 text-info d-flex justify-content-between align-items-center">
                                            <strong>Base Model Response</strong>
                                            <span className="badge bg-info">LLM</span>
                                        </div>
                                        <div className="card-body">
                                            {answerWithout ? (
                                                <div className="answer-content" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {answerWithout}
                                                </div>
                                            ) : (
                                                <div className="text-muted">
                                                    No direct model response available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryPage;