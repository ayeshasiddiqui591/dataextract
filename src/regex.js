// src/components/ResumeUpload.js
import React, { useState } from 'react';
import FileBase64 from 'react-file-base64';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import PersonalDetailsForm from './PersonalDetailsForm';

// Setting the workerSrc to the correct path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ResumeUpload = () => {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleResumeUpload = async (file) => {
    try {
      const pdfData = await pdfjsLib.getDocument({ data: atob(file.base64.split(',')[1]) }).promise;
      const text = await extractTextFromPDF(pdfData);
      const extractedData = extractFormDataFromResume(text);
      setFormData(extractedData);
      setResumeUploaded(true);
    } catch (error) {
      console.error('Error parsing PDF:', error);
    }
  };

  const extractTextFromPDF = async (pdf) => {
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const pageText = await page.getTextContent();
      text += pageText.items.map(item => item.str).join(' ');
    }
    return text;
  };

  const extractFormDataFromResume = (data) => {
    const firstLine = data.split('\n')[0].trim();

    // Split the first line into name components
    const nameParts = firstLine.split(/\s+/);
    const firstName = nameParts[0] || '';
    
    // Join the rest of the parts as the last name
    const lastName = nameParts[1] || '';
    const phonePattern = /(\+?\d{1,4}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/m;
    const emailPattern = /(?:Email\s*:\s*)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/im;
    const addressPattern = /(?:Address\s*:\s*)?((?:[0-9a-zA-Z#.,-]+(?:\s|\S)*?){1,5}(?:\s*\d{5}(?:-\d{4})?))/m;
    const summaryPattern = /SUMMARY\s*[\r\n]+([\s\S]*?)(?=\n[A-Z]|\n{2}|\z)/i;

    const phone = (data.match(phonePattern) || [])[0] || '';
    const email = (data.match(emailPattern) || [])[0] || '';
    const address = (data.match(addressPattern) || [])[1] || '';
    const summary = (data.match(summaryPattern) || [])[1]?.trim() || '';
    console.log(summary);
    return {
      firstName,
      lastName,
      summary,
      phone,
      email,
      address,
    };
  };

  const handleShowForm = () => {
    setResumeUploaded(false);
  };

  return (
    <div>
      {!formData ? (
        <>
          <h2>Upload Resume</h2>
          <FileBase64 multiple={false} onDone={handleResumeUpload} />
          {resumeUploaded && <button onClick={handleShowForm}>Submit</button>}
        </>
      ) : (
        <PersonalDetailsForm formData={formData} />
      )}
    </div>
  );
};

export default ResumeUpload;