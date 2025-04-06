import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
    const [projectId, setProjectId] = useState(0);
    const [userId, setUserId] = useState(1);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileExt = selectedFile.name.split('.').pop().toLowerCase();
            if (fileExt === "txt" || fileExt === "pdf") {
                setFile(selectedFile);
                setFileName(selectedFile.name);
                setError("");
                setIsSuccess(false);
            } else {
                setError("Only .txt and .pdf files are allowed.");
                setFile(null);
                setFileName("");
                e.target.value = "";
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a valid .txt or .pdf file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        setError("");
        setUploadProgress(0);

        try {
            const response = await axios.post(
                `http://127.0.0.1:5000/data/upload/${projectId}/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );
            
            console.log(response.data);
            setIsSuccess(true);
            setFileName("");
            setFile(null);
            e.target.reset(); // Reset the form
        } catch (error) {
            console.error("Error uploading file:", error);
            setError(error.response?.data?.message || "Failed to upload file");
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setUploadProgress(0);
            }, 2000);
        }
    };

    const removeFile = () => {
        setFile(null);
        setFileName("");
        setError("");
        setIsSuccess(false);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header">
                            <h2 className="h4 mb-0">Document Upload</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
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
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a project</option>
                                        <option value="ensofia">ensofia</option>
                                        <option value="2">project 2</option>
                                        <option value="3">project 3</option>
                                        <option value="4">project 4</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="userId" className="form-label fw-bold">User ID</label>
                                    <div className="input-group">
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => setUserId(prev => (prev > 1 ? prev - 1 : 1))}
                                            disabled={isLoading}
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
                                            disabled={isLoading}
                                        />
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => setUserId(prev => prev + 1)}
                                            disabled={isLoading}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="file" className="form-label fw-bold">
                                        Document Upload
                                        <span className="text-danger">*</span>
                                    </label>
                                    {fileName ? (
                                        <div className="file-preview mb-3 p-3 border rounded d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="bi bi-file-earmark-text me-2"></i>
                                                {fileName}
                                            </div>
                                            <button 
                                                type="button" 
                                                className="btn-close"
                                                onClick={removeFile}
                                                aria-label="Remove file"
                                            ></button>
                                        </div>
                                    ) : (
                                        <div className="file-upload-area border rounded p-5 text-center">
                                            <input
                                                type="file"
                                                className="form-control d-none"
                                                id="file"
                                                onChange={handleFileChange}
                                                required
                                                accept=".txt,.pdf"
                                            />
                                            <label htmlFor="file" className="btn btn-outline-primary">
                                                Browse Files
                                            </label>
                                            <p className="mt-2 mb-0 text-muted">or drag and drop files here</p>
                                            <p className="small text-muted">Supports: .txt, .pdf</p>
                                        </div>
                                    )}
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                </div>

                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="mb-3">
                                        <div className="progress">
                                            <div 
                                                className="progress-bar progress-bar-striped progress-bar-animated" 
                                                role="progressbar" 
                                                style={{ width: `${uploadProgress}%` }}
                                                aria-valuenow={uploadProgress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {uploadProgress}%
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isSuccess && (
                                    <div className="alert alert-success mb-3">
                                        File uploaded successfully!
                                    </div>
                                )}

                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success btn-lg"
                                        disabled={isLoading || !file}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span 
                                                    className="spinner-border spinner-border-sm me-2" 
                                                    role="status" 
                                                    aria-hidden="true"
                                                ></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            "Upload Document"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadForm;