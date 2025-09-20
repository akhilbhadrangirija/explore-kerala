"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

const FileInput = React.forwardRef(({ 
  className, 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB
  value, 
  disabled = false,
  isUploading = false,
  uploadProgress = 0,
  ...props 
}, ref) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [preview, setPreview] = React.useState(null);
  const [error, setError] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return false;
    }
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onFileSelect?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect?.(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-input">Cover Image</Label>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-green-500 bg-green-50" : "border-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500 bg-red-50",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        
        {isUploading ? (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Uploading image...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearFile}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-green-600 hover:text-green-500">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

FileInput.displayName = "FileInput";

export { FileInput };
