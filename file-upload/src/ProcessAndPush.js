import React, { useState } from "react";
import axios from "axios";

const ProcessAndPush = () => {
    const [projectId, setProjectId] = useState(0); 
    const [userId, setUserId] = useState(1); 
    const [chunkSize, setChunkSize] = useState(200);
    const [overlap, setOverlap] = useState(0);
    const [doReset, setDoReset] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [embeddingResponse, setEmbeddingResponse] = useState({});
    const [processResponse, setProcessResponse] = useState({});
    const [processLoading, setProcessLoading] = useState(false);
    const [embeddingLoading, setEmbeddingLoading] = useState(false);
    const [processingDone, setProcessingDone] = useState(false);
    const [pushingDone, setPushingDone] = useState(false);

    const handleProcess = async (e) => {
        e.preventDefault();
        setProcessLoading(true);

        try {
            const response = await axios.post(
                `http://127.0.0.1:5000/data/process/${projectId}/${userId}`,
                {
                    chunkSize,
                    overlap,
                    doReset
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            setResponseData(response.data || {});
            setProcessResponse(response.data || {})
            setProcessingDone(true);
            setPushingDone(false);
            console.log(response.data);
        } catch (error) {
            console.error("Error while processing data:", error);
            alert("Error while processing data\n you may need to:\n select the project name or the user ")
        } finally {
            setProcessLoading(false);
        }
    };

    const handlePushEmbeddings = async (e) => {
        e.preventDefault();
        if (!processingDone) return;
        
        setEmbeddingLoading(true);

        try {
            const response = await axios.post(
                `http://127.0.0.1:5000/nlp/embedding/push/${projectId}/${userId}`,
                { doReset },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            setEmbeddingResponse(response.data || {});
            setPushingDone(true);
            console.log(response.data);
        } catch (error) {
            console.error("Error while pushing the embeddings:", error);
        } finally {
            setEmbeddingLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Process and Push</h2>
            
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title mb-3">Configuration</h4>
                    <form>
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

                            <div className="col-md-6">
                                <label htmlFor="chunkSize" className="form-label">Chunk Size</label>
                                <select
                                    className="form-select"
                                    id="chunkSize"
                                    value={chunkSize}
                                    onChange={(e) => setChunkSize(Number(e.target.value))}
                                    required
                                >
                                    <option value="200">200</option>
                                    <option value="400">400</option>
                                    <option value="600">600</option>
                                    <option value="800">800</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="overlap" className="form-label">Overlap</label>
                                <select
                                    className="form-select"
                                    id="overlap"
                                    value={overlap}
                                    onChange={(e) => setOverlap(Number(e.target.value))}
                                    required
                                >
                                    <option value="0">100</option>
                                    <option value="50">150</option>
                                    <option value="100">200</option>
                                    <option value="150">250</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="doReset"
                                        checked={doReset}
                                        onChange={(e) => setDoReset(e.target.checked)}
                                        role="switch"
                                    />
                                    <label className="form-check-label" htmlFor="doReset">Reset Context</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title mb-0">1-Processing</h4>
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleProcess}
                                    disabled={processLoading}
                                >
                                    {processLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : "Process"}
                                </button>
                            </div>
                            
                            <div className={`alert ${processingDone ? "alert-success" : "alert-secondary"}`}>
                                {processingDone ? (
                                    <>
                                        <strong>Status:</strong> {processResponse.signal || 'N/A'}<br />
                                        <strong>Inserted Chunks:</strong> {processResponse.inserted_chunks || '0'}<br />
                                        <strong>Processed Files:</strong> {processResponse.processed_files || '0'}
                                    </>
                                ) : (
                                    <em>No processing results yet. Process data to see results.</em>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="card-title mb-0">2-Embeddings</h4>
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={handlePushEmbeddings}
                                    disabled={!processingDone || embeddingLoading}
                                >
                                    {embeddingLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Pushing...
                                        </>
                                    ) : "Push Embeddings"}
                                </button>
                            </div>
                            
                            <div className={`alert ${pushingDone ? "alert-info" : "alert-secondary"}`}>
                                {pushingDone ? (
                                    <>
                                        <strong>Status:</strong> {embeddingResponse.signal || 'Success'}<br />
                                        <strong>Embeddings Pushed:</strong> {embeddingResponse.inserted_items_count || 'All available chunks'}
                                    </>
                                ) : (
                                    <em>No embedding results yet. Push embeddings to see results.</em>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessAndPush;