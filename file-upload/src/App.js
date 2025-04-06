import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import UploadForm from "./UploadForm";
import QueryPage from "./QueryPage";
import ProcessAndPush from "./ProcessAndPush"
import EmdeddingSearch from "./EmdeddingSearch"

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <Link className="navbar-brand" to="/">Home</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/upload">Upload File</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/process">Process And Push</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">Semantic Search</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/query">Query</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/process" element={<ProcessAndPush/>}/>
          <Route path="/search" element={<EmdeddingSearch/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
