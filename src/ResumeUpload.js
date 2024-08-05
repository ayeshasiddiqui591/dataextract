import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setData(null);  // Reset data when new file is selected
    setError('');   // Reset error when new file is selected
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Replace 'http://localhost:5000/api/data' with your Flask backend URL
      const response = await axios.post('http://localhost:5000/api/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setData(response.data);
        setError('');
      } else {
        setError('Error uploading file. Please try again.');
      }
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Upload Your Resume</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h2>Resume Data:</h2>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Mobile Number:</strong> {data.mobile_number}</p>
          <p><strong>Skills:</strong> {data.skills?.join(', ')}</p>
          <p><strong>College Name:</strong> {data.college_name}</p>
          <p><strong>Degree:</strong> {data.degree}</p>
          <p><strong>Designation:</strong> {data.designation}</p>
          <p><strong>Company Names:</strong> {data.company_names?.join(', ')}</p>
          <p><strong>No Of Pages:</strong> {data.no_of_pages}</p>
          <p><strong>Total Experience:</strong> {data.total_experience}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
