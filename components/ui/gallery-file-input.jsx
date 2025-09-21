"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Label } from "./label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

const GalleryFileInput = React.forwardRef(({ 
  className, 
  onFilesSelect, 
  onImageRemove,
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB
  value = [], // Array of image URLs
  disabled = false,
  isUploading = false,
  uploadProgress = 0,
  ...props 
}, ref) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select valid image files only');
      return false;
    }
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length > 0) {
      onFilesSelect?.(validFiles);
    }
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    onImageRemove?.(index);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="gallery-file-input">Gallery Images</Label>
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
          id="gallery-file-input"
          type="file"
          accept={accept}
          multiple
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
              <p className="text-sm text-gray-600">Uploading images...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : value.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {value.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-green-600 hover:text-green-500">
                  Click to add more images
                </span>{" "}
                or drag and drop
              </p>
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
                or drag and drop multiple images
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB each
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

GalleryFileInput.displayName = "GalleryFileInput";

export { GalleryFileInput };
