import React, { useState } from "react";
import axios from "axios";

const EmbeddingSearch = () => {
    const [projectId, setProjectId] = useState(0); 
    const [userId, setUserId] = useState(1); 
    const [text, setQuery] = useState("");
    const [limit, setLimit] = useState(5);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log(text)
            console.log(limit)
            const response = await axios.post(
                `http://127.0.0.1:5000/nlp/embedding/search/${projectId}/${userId}`,
                {
                    text,
                    limit
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            setSearchResults(response.data.results || []);
        } catch (error) {
            console.error("Error while searching:", error);
            setError("Error while performing search. Please check your inputs and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Semantic Search</h2>
            
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title mb-3">Search Configuration</h4>
                    <form onSubmit={handleSearch}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="project" className="form-label">Project</label>
                                <select
                                    className="form-select"
                                    id="project"
                                    value={projectId === 1 ? "ensofia" : projectId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setProjectId(value === "ensofia" ? 1 : Number(value));
                                    }}
                                    required
                                >
                                    <option value="">Select a project</option>
                                    <option value="ensofia">ensofia</option>
                                    <option value="2">project 2</option>
                                    <option value="3">project 3</option>
                                    <option value="4">project 4</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="userId" className="form-label">User ID</label>
                                <div className="input-group">
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => setUserId(prev => (prev > 1 ? prev - 1 : 1))}
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
                                    />
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => setUserId(prev => prev + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            
                            <div className="col-md-8">
                                <label htmlFor="query" className="form-label">Search Query</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="query"
                                    value={text}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Enter your search query..."
                                    required
                                />
                            </div>
                            
                            <div className="col-md-4">
                                <label htmlFor="limit" className="form-label">Results Limit</label>
                                <select
                                    className="form-select"
                                    id="limit"
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                >
                                    <option value="1">1 result</option>
                                    <option value="3">3 results</option>
                                    <option value="5">5 results</option>
                                    <option value="10">10 results</option>
                                    <option value="20">20 results</option>
                                </select>
                            </div>
                            
                            <div className="col-12">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Searching...
                                        </>
                                    ) : "Search"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-body">
                    <h4 className="card-title mb-3">Search Results</h4>
                    
                    {searchResults.length > 0 ? (
                        <div className="list-group">
                            {searchResults.map((result, index) => (
                                <div key={index} className="list-group-item mb-2">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="mb-1">Result #{index + 1}</h5>
                                        <span className="badge bg-primary rounded-pill">
                                            Score: {result.score ? result.score.toFixed(4) : 'N/A'}
                                        </span>
                                    </div>
                                    <p className="mb-1">{result.text || 'No content available'}</p>
                                    {result.metadata && (
                                        <small className="text-muted">
                                            Source: {result.metadata.source || 'Unknown'}
                                        </small>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-secondary">
                            {loading ? 'Searching...' : 'No results yet. Perform a search to see results.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmbeddingSearch;