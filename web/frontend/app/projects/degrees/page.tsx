'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function DegreesPage() {
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [dataset, setDataset] = useState('small')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!source || !target) {
      setError('Please enter both actors')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await api.findConnection(source, target, dataset)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to find connection')
    } finally {
      setLoading(false)
    }
  }

  const handleRandomChallenge = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.getRandomChallenge(dataset)
      setSource(data.actor1.name)
      setTarget(data.actor2.name)
    } catch (err: any) {
      setError(err.message || 'Failed to get random challenge')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          🔍 Degrees of Separation
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Find the shortest connection between any two actors using BFS graph search
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Find Connection</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Source Actor</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Tom Hanks"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Actor</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g., Kevin Bacon"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Dataset</label>
          <select
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="small">Small (faster)</option>
            <option value="large">Large (more actors)</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Searching...' : 'Find Connection'}
          </button>

          <button
            onClick={handleRandomChallenge}
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Random Challenge
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {result.degrees} Degree{result.degrees !== 1 ? 's' : ''} of Separation
          </h2>

          {result.path.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-300">Same person!</p>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-medium">{result.source}</p>

              {result.path.map((step: any, index: number) => (
                <div key={index} className="ml-4 border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    ↓ starred in <span className="font-semibold text-blue-600 dark:text-blue-400">{step.movie_title}</span> with
                  </p>
                  <p className="text-lg font-medium mt-1">{step.person_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300">
          This project uses <strong>Breadth-First Search (BFS)</strong> to find the shortest path between actors.
          Each actor is a node, and movies create edges between actors who starred together. BFS guarantees
          finding the shortest path in an unweighted graph.
        </p>
      </div>
    </div>
  )
}
