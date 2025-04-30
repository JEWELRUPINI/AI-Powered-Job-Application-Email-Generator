import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [email, setEmail] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:5000/upload-resume', formData);
      setResumeText(res.data.resumeText);
    } catch (err) {
      alert('Failed to upload and extract text from PDF.');
    }
  };

  const handleGenerateEmail = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please provide both resume and job description.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/generate-email', {
        resumeText,
        jobDescription
      });
      setEmail(res.data.email);
    } catch (err) {
      alert('Error generating email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h2>AI Job Application Email Generator (Powered by Gemini)</h2>

      <div style={{ marginBottom: '20px' }}>
        <h4>Upload Resume (PDF) or Paste Below:</h4>
        <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
        {fileName && <p>Uploaded: {fileName}</p>}
        <textarea
          rows={10}
          cols={80}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Or paste your resume text here..."
          style={{ marginTop: '10px', width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Paste Job Description:</h4>
        <textarea
          rows={10}
          cols={80}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          style={{ width: '100%' }}
        />
      </div>

      <button onClick={handleGenerateEmail} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Email'}
      </button>

      {/* Output Box Before Email is Generated */}
      <div style={{ marginTop: '30px' }}>
        <h4>Generated Email:</h4>
        <div style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '400px',
          overflowY: 'auto',
          border: '2px solid #ddd',  // Adds a solid border around the box
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Adds a shadow effect
        }}>
          <pre>{email || "The generated email will appear here after you click 'Generate Email'."}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;


