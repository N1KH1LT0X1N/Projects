'use client'

export default function HeredityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🧬 Heredity - Gene Probability
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Calculate gene inheritance probabilities using Bayesian inference
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Calculate Probabilities</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Upload a family tree CSV or select an example family to calculate gene and trait probabilities.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
            Family 0
          </button>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
            Family 1
          </button>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
            Family 2
          </button>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Uses <strong>Bayesian inference</strong> to calculate probabilities of gene counts and trait expression
          based on family pedigrees and genetic inheritance rules.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Joint Probability</strong>: P(genes, traits | evidence)</li>
          <li><strong>Conditional Probability</strong>: P(trait | genes)</li>
          <li><strong>Mutation Rate</strong>: 1% chance of gene mutation during transmission</li>
          <li><strong>Normalization</strong>: Ensure probabilities sum to 1</li>
        </ul>
      </div>
    </div>
  )
}
