'use client'

export default function TicTacToePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          🎮 TicTacToe - Minimax AI
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Play against an unbeatable AI using the Minimax algorithm with alpha-beta pruning
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pygame Game (Web Version)</h2>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This game runs in the browser using Pygbag (Python to WebAssembly)
          </p>
          <div className="aspect-square max-w-md mx-auto bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">
              [Pygbag Build Required]<br/>
              Run: <code className="bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded">pygbag --build tictactoe_web</code>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          The AI uses the <strong>Minimax algorithm</strong>, which explores all possible game states to find
          the optimal move. Alpha-beta pruning optimizes this by eliminating branches that cannot affect the final decision.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Minimax</strong>: Recursive game tree search</li>
          <li><strong>Alpha-Beta Pruning</strong>: Optimization technique</li>
          <li><strong>Utility Function</strong>: +1 (X wins), -1 (O wins), 0 (tie)</li>
          <li><strong>Perfect Play</strong>: AI never loses</li>
        </ul>
      </div>
    </div>
  )
}
