'use client'

export default function CrosswordPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          🔤 Crossword Solver
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Solve crossword puzzles using constraint satisfaction and backtracking
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Solve Puzzle</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Select a puzzle structure and word list to generate a solution.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Structure</label>
            <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
              <option>structure0</option>
              <option>structure1</option>
              <option>structure2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Words</label>
            <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
              <option>words0</option>
              <option>words1</option>
              <option>words2</option>
            </select>
          </div>
        </div>
        <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition">
          Solve Crossword
        </button>
      </div>

      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Uses <strong>Constraint Satisfaction Problem (CSP)</strong> techniques with backtracking search
          and arc consistency to fill the crossword grid.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Variables</strong>: Each word slot in the grid</li>
          <li><strong>Domains</strong>: Possible words that fit each slot</li>
          <li><strong>Constraints</strong>: Overlapping letters must match</li>
          <li><strong>Arc Consistency (AC-3)</strong>: Reduce domains before search</li>
          <li><strong>Backtracking</strong>: Try assignments systematically</li>
        </ul>
      </div>
    </div>
  )
}
