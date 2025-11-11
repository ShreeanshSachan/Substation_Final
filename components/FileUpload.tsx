
import React, { useCallback, useState } from 'react';
import { Icon } from './Icon';

interface FileUploadProps {
  onFileChange: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-4 md:p-8">
      <div 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative w-full max-w-2xl h-80 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors duration-300 ${isDragging ? 'border-sky-400 bg-sky-900/30' : 'border-slate-600 hover:border-slate-500'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          accept=".txt,.md,.pdf,.doc,.docx"
        />
        <div className="text-center pointer-events-none">
          <Icon name="upload" className="w-16 h-16 mx-auto text-slate-500" />
          <p className="mt-4 text-xl font-semibold text-slate-300">
            Drop your knowledge base document here
          </p>
          <p className="mt-2 text-slate-400">or</p>
          <label 
            htmlFor="file-upload"
            className="mt-2 inline-block px-6 py-2 text-sm font-medium text-white bg-sky-600 rounded-md cursor-pointer hover:bg-sky-700 transition-colors pointer-events-auto"
          >
            Select a File
          </label>
           <p className="mt-4 text-xs text-slate-500">
            Supported formats: TXT, MD, PDF, DOC, DOCX
          </p>
        </div>
      </div>
    </div>
  );
};
