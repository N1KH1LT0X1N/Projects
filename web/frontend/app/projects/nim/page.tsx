'use client'

export default function NimPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          🎲 Nim - Q-Learning AI
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Play Nim against an AI that learns optimal strategy through reinforcement learning
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Interactive Game</h2>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Real-time Nim game using WebSocket
          </p>
          <div className="aspect-square max-w-md mx-auto bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">
              [WebSocket Connection Required]<br/>
              Connect to: <code className="bg-slate-300 dark:bg-slate-700 px-2 py-1 rounded">ws://localhost:8000/api/nim/ws/game</code>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          The AI uses <strong>Q-Learning</strong>, a reinforcement learning technique. It learns by
          playing against itself thousands of times, updating Q-values for state-action pairs.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Q-Table</strong>: Maps (state, action) → expected value</li>
          <li><strong>Epsilon-Greedy</strong>: Balances exploration vs exploitation</li>
          <li><strong>Self-Play</strong>: AI improves by playing against itself</li>
          <li><strong>Reward Structure</strong>: +1 for winning, -1 for losing</li>
        </ul>
      </div>
    </div>
  )
}
