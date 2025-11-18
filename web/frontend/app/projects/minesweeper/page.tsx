'use client'

export default function MinesweeperPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          💣 Minesweeper AI Solver
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          AI that solves Minesweeper using logical constraint propagation and inference
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Interactive Game (Web Version)</h2>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Play Minesweeper or watch the AI solve it using logical reasoning
          </p>
          <div className="aspect-video max-w-2xl mx-auto bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">
              [Pygbag Build Required]<br/>
              Run: <code className="bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded">pygbag --build minesweeper_web</code>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          The AI maintains a <strong>knowledge base</strong> of logical sentences about the board.
          It uses <strong>constraint propagation</strong> to deduce safe moves and mine locations.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Sentences</strong>: Sets of cells with mine counts (e.g., {A,B,C} = 2 mines)</li>
          <li><strong>Direct Inference</strong>: If count=0 → all safe, if count=cells → all mines</li>
          <li><strong>Subset Inference</strong>: If {A,B} ⊆ {A,B,C} with same count → C is safe</li>
          <li><strong>Safe Moves</strong>: AI only clicks cells it knows are safe</li>
        </ul>
      </div>
    </div>
  )
}
