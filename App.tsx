import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { pdfjs } from 'react-pdf';
import PdfEditorUI from './components/PdfEditorUI';
import { UploadCloud } from 'lucide-react';

// Configure the PDF.js worker by fetching it and creating a blob URL.
// This is a more robust method to avoid cross-origin issues with web workers.
(async () => {
  try {
    const workerSrc = 'https://esm.sh/pdfjs-dist@4.4.188/build/pdf.worker.min.js';
    const response = await fetch(workerSrc);
    if (!response.ok) {
        throw new Error(`Failed to fetch worker: ${response.statusText}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    pdfjs.GlobalWorkerOptions.workerSrc = blobUrl;
  } catch (error) {
    console.error('Failed to setup PDF.js worker:', error);
    alert('Critical error: Could not load the PDF rendering engine. Please refresh the page.');
  }
})();

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleFileClose = () => {
    setPdfFile(null);
  };

  if (pdfFile) {
    return <PdfEditorUI file={pdfFile} onClose={handleFileClose} />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl mx-4 p-8 sm:p-16 border-4 border-dashed rounded-2xl cursor-pointer transition-colors duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-400 bg-slate-50 hover:border-blue-500 hover:bg-blue-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloud className="w-16 h-16 text-slate-500 mb-4" />
          <p className="text-xl font-semibold text-slate-700">
            {isDragActive ? 'Drop the PDF here ...' : "Drag 'n' drop a PDF here, or click to select a file"}
          </p>
          <p className="text-slate-500 mt-2">Your file will be processed entirely in your browser.</p>
        </div>
      </div>
    </div>
  );
};

export default App;