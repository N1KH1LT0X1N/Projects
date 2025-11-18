'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function KnightsPage() {
  const [puzzles, setPuzzles] = useState<any[]>([])
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null)
  const [solution, setSolution] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPuzzles()
  }, [])

  const loadPuzzles = async () => {
    try {
      const data = await api.getKnightsPuzzles()
      setPuzzles(data)
    } catch (err) {
      console.error('Failed to load puzzles:', err)
    }
  }

  const solvePuzzle = async (puzzleId: number) => {
    setLoading(true)
    setSelectedPuzzle(puzzleId)
    setSolution(null)

    try {
      const data = await api.solveKnightsPuzzle(puzzleId)
      setSolution(data)
    } catch (err: any) {
      alert('Failed to solve puzzle: ' + err.message)
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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          ♟️ Knights and Knaves
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Solve classic logic puzzles using propositional logic and model checking
        </p>
      </div>

      <div className="space-y-6">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Puzzle {puzzle.id}</h2>
                <p className="text-slate-600 dark:text-slate-300">{puzzle.description}</p>
                <div className="mt-2 flex gap-2">
                  {puzzle.characters.map((char: string) => (
                    <span key={char} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => solvePuzzle(puzzle.id)}
                disabled={loading && selectedPuzzle === puzzle.id}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition"
              >
                {loading && selectedPuzzle === puzzle.id ? 'Solving...' : 'Solve'}
              </button>
            </div>

            {selectedPuzzle === puzzle.id && solution && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-3">Solution:</h3>
                <div className="space-y-2">
                  {solution.solution.map((result: any) => (
                    <div
                      key={result.character}
                      className={`p-3 rounded-lg ${
                        result.is_knight
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      <span className="font-semibold">{result.character}</span> is a{' '}
                      <span className="font-bold">{result.is_knight ? 'Knight' : 'Knave'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          This uses <strong>propositional logic</strong> and <strong>model checking</strong>. Knights always tell
          the truth, Knaves always lie. The solver tests all possible truth assignments to find which scenario is
          consistent with the statements.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Knowledge Base</strong>: Logical sentences encoding the puzzle</li>
          <li><strong>Model Checking</strong>: Exhaustive search through truth assignments</li>
          <li><strong>Entailment</strong>: KB ⊨ α (knowledge base entails query)</li>
        </ul>
      </div>
    </div>
  )
}
