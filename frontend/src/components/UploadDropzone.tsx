'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadDropzoneProps {
  onUploadComplete: (contractData: any) => void;
  userId?: string; // Optional, defaults to localStorage user_id
}

export default function UploadDropzone({ onUploadComplete, userId }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Kun PDF og billeder er tilladt');
      return;
    }

    // Upload
    setIsUploading(true);
    setUploadStatus('idle');
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Get user ID
    const effectiveUserId = userId || localStorage.getItem('user_id') || 'user_123';

    try {
      // Direct axios call because our apiClient wrapper might not handle FormData correctly 
      // without specific config, or we can add a method to apiClient.
      // Let's assume we need to use the endpoint /upload/bill
      
      // We'll use the fetch API for simplicity here to bypass any client wrapper issues with FormData
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/v1/upload/bill?user_id=${effectiveUserId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setUploadStatus('success');
      toast.success('Regning analyseret!');
      onUploadComplete(data);
      
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      toast.error('Kunne ikke analysere filen. Prøv igen eller indtast manuelt.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
        ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : ''}
        ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />

      <div className="flex flex-col items-center justify-center gap-3">
        {isUploading ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-blue-600 font-medium">Analyserer din regning med AI...</p>
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <CheckCircle className="w-10 h-10 text-green-600" />
            <p className="text-green-600 font-medium">Succes! Data fundet.</p>
          </>
        ) : uploadStatus === 'error' ? (
          <>
            <XCircle className="w-10 h-10 text-red-600" />
            <p className="text-red-600 font-medium">Fejl. Prøv igen.</p>
          </>
        ) : (
          <>
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Upload din regning</p>
              <p className="text-sm text-gray-500">Træk filen herind eller klik for at vælge</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">PDF, JPG eller PNG</p>
          </>
        )}
      </div>
    </div>
  );
}





