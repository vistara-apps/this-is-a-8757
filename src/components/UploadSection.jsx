import React, { useRef, useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import clsx from 'clsx'

export function UploadSection({ onImageUpload }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      onImageUpload(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-surface mb-lg">
        Upload Your Product Image
      </h2>
      <p className="text-xl text-surface text-opacity-80 mb-xxl max-w-2xl mx-auto">
        Start by uploading a product image. Our AI will analyze it and generate multiple ad variations optimized for different social platforms.
      </p>
      
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-xxl transition-all duration-base cursor-pointer',
          dragActive 
            ? 'border-accent bg-accent bg-opacity-10 scale-105' 
            : 'border-surface border-opacity-30 hover:border-accent hover:bg-surface hover:bg-opacity-10'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-lg">
            <img 
              src={preview} 
              alt="Product preview" 
              className="max-w-xs max-h-64 mx-auto rounded-lg shadow-card"
            />
            <p className="text-surface text-opacity-80">
              Perfect! Click "Continue" to select your target platforms.
            </p>
          </div>
        ) : (
          <div className="space-y-lg">
            <div className="mx-auto w-16 h-16 bg-accent bg-opacity-20 rounded-xl flex items-center justify-center">
              {dragActive ? (
                <Upload className="w-8 h-8 text-accent" />
              ) : (
                <ImageIcon className="w-8 h-8 text-accent" />
              )}
            </div>
            <div>
              <p className="text-xl font-semibold text-surface mb-sm">
                {dragActive ? 'Drop your image here' : 'Choose or drag your product image'}
              </p>
              <p className="text-surface text-opacity-60">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {preview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-lg bg-accent text-surface font-semibold py-md px-xl rounded-lg hover:bg-opacity-90 transition-all duration-base"
        >
          Choose Different Image
        </button>
      )}
    </div>
  )
}