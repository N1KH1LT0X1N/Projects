'use client'

export default function AttentionPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          👁️ Attention Visualization
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Visualize BERT transformer attention patterns across all layers and heads
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Attention Heatmap Explorer</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          View precomputed attention visualizations from BERT (12 layers × 12 heads = 144 total)
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Layer (1-12)</label>
            <input
              type="number"
              min="1"
              max="12"
              defaultValue="1"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Head (1-12)</label>
            <input
              type="number"
              min="1"
              max="12"
              defaultValue="1"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
            />
          </div>
        </div>
        <button className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition">
          Load Attention Map
        </button>
      </div>

      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Uses <strong>BERT (Bidirectional Encoder Representations from Transformers)</strong> to analyze
          how the model attends to different tokens when processing text.
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
          <li><strong>Multi-Head Attention</strong>: 12 parallel attention mechanisms per layer</li>
          <li><strong>12 Layers</strong>: Hierarchical representation learning</li>
          <li><strong>Attention Scores</strong>: Which tokens influence each other</li>
          <li><strong>Masked Prediction</strong>: Predict missing [MASK] tokens</li>
        </ul>
      </div>
    </div>
  )
}
