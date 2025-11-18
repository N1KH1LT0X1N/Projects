'use client'

export default function ParserPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          📝 Sentence Parser
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Parse English sentences using context-free grammar and extract syntactic structure
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Parse Sentence</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Enter Sentence</label>
          <input
            type="text"
            placeholder="e.g., Holmes sat in the armchair"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <button className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition">
          Parse Sentence
        </button>
      </div>

      <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Uses a <strong>Context-Free Grammar (CFG)</strong> with terminals (words) and nonterminals (syntax categories).
          NLTK's ChartParser generates all valid parse trees for the sentence.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Terminals</strong>: Word categories (N, V, Det, Adj, etc.)</li>
          <li><strong>Nonterminals</strong>: Phrase structures (NP, VP, S, etc.)</li>
          <li><strong>Parse Trees</strong>: Hierarchical structure showing syntax</li>
          <li><strong>Noun Phrases</strong>: Extracted maximal NP chunks</li>
        </ul>
      </div>
    </div>
  )
}
