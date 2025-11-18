'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function TrafficPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [classifying, setClassifying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClassify = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setClassifying(true)
    setError(null)

    try {
      const data = await api.classifyTrafficSign(selectedFile)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to classify image')
    } finally {
      setClassifying(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          🚦 Traffic Sign Classifier
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Classify traffic signs using a Convolutional Neural Network trained on the GTSRB dataset
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Traffic Sign Image</h2>

        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 object-contain" />
              ) : (
                <>
                  <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG (recommended: 30×30 pixels or larger)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        <button
          onClick={handleClassify}
          disabled={!selectedFile || classifying}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {classifying ? 'Classifying...' : 'Classify Traffic Sign'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Classification Result</h2>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg mb-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Top Prediction</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {result.top_prediction.name}
            </div>
            <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              Confidence: {(result.top_prediction.confidence * 100).toFixed(1)}%
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Top 5 Predictions</h3>
            <div className="space-y-2">
              {result.top_5.map((pred: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 text-sm text-slate-500 dark:text-slate-400">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{pred.name}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-red-600 dark:bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${pred.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          This uses a <strong>Convolutional Neural Network (CNN)</strong> trained on the GTSRB dataset with 43
          traffic sign categories. The network consists of:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li>2 Convolutional layers with ReLU activation and MaxPooling</li>
          <li>Flattening layer</li>
          <li>Dense layer with 128 neurons and Dropout (0.5)</li>
          <li>Output layer with 43 categories (Softmax activation)</li>
        </ul>
      </div>
    </div>
  )
}
