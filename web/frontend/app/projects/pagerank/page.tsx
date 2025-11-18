'use client'

export default function PageRankPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          📊 PageRank Algorithm
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Rank web pages by importance using Google's PageRank algorithm
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Calculate PageRank</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Select a corpus to calculate PageRank using both sampling and iterative methods.
        </p>
        <div className="flex gap-4 mb-6">
          <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition">
            Corpus 0
          </button>
          <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition">
            Corpus 1
          </button>
          <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition">
            Corpus 2
          </button>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Implements Google's <strong>PageRank algorithm</strong> using two different approaches:
          random walk sampling and iterative calculation.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Sampling Method</strong>: Random walk simulation (10,000 samples)</li>
          <li><strong>Iterative Method</strong>: PR(p) = (1-d)/N + d·Σ(PR(i)/links(i))</li>
          <li><strong>Damping Factor</strong>: 0.85 (85% follow links, 15% random jump)</li>
          <li><strong>Convergence</strong>: Iterate until ranks stabilize</li>
        </ul>
      </div>
    </div>
  )
}
