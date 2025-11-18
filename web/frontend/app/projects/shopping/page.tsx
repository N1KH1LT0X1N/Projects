'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function ShoppingPage() {
  const [modelTrained, setModelTrained] = useState(false)
  const [training, setTraining] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)

  const [features, setFeatures] = useState({
    administrative: 0,
    administrative_duration: 0,
    informational: 0,
    informational_duration: 0,
    product_related: 1,
    product_related_duration: 0,
    bounce_rates: 0,
    exit_rates: 0,
    page_values: 0,
    special_day: 0,
    month: 'Nov',
    operating_systems: 1,
    browser: 1,
    region: 1,
    traffic_type: 1,
    visitor_type: 'Returning_Visitor',
    weekend: false,
  })

  const handleTrainModel = async () => {
    setTraining(true)

    try {
      const result = await api.trainShoppingModel()
      setMetrics(result.metrics)
      setModelTrained(true)
    } catch (err: any) {
      alert('Failed to train model: ' + err.message)
    } finally {
      setTraining(false)
    }
  }

  const handlePredict = async () => {
    if (!modelTrained) {
      alert('Please train the model first')
      return
    }

    setPredicting(true)

    try {
      const result = await api.predictPurchase(features)
      setPrediction(result)
    } catch (err: any) {
      alert('Failed to make prediction: ' + err.message)
    } finally {
      setPredicting(false)
    }
  }

  const updateFeature = (key: string, value: any) => {
    setFeatures(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center mb-4">
          ← Back to Projects
        </a>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
          🛒 Shopping Purchase Predictor
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Predict whether an online shopper will make a purchase using k-NN machine learning
        </p>
      </div>

      {!modelTrained && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Train Model</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            First, train a k-nearest neighbors model on the shopping dataset (12,000+ sessions)
          </p>
          <button
            onClick={handleTrainModel}
            disabled={training}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition"
          >
            {training ? 'Training Model...' : 'Train Model'}
          </button>
        </div>
      )}

      {metrics && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Model Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(metrics.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(metrics.sensitivity * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Sensitivity (TPR)</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(metrics.specificity * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Specificity (TNR)</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {metrics.correct}/{metrics.total}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Correct</div>
            </div>
          </div>
        </div>
      )}

      {modelTrained && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Make Prediction</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Adjust session features to predict purchase likelihood
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Bounce Rate</label>
              <input
                type="number"
                step="0.01"
                value={features.bounce_rates}
                onChange={(e) => updateFeature('bounce_rates', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exit Rate</label>
              <input
                type="number"
                step="0.01"
                value={features.exit_rates}
                onChange={(e) => updateFeature('exit_rates', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Page Values</label>
              <input
                type="number"
                step="0.1"
                value={features.page_values}
                onChange={(e) => updateFeature('page_values', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <select
                value={features.month}
                onChange={(e) => updateFeature('month', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Visitor Type</label>
              <select
                value={features.visitor_type}
                onChange={(e) => updateFeature('visitor_type', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700"
              >
                <option value="Returning_Visitor">Returning Visitor</option>
                <option value="New_Visitor">New Visitor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Weekend</label>
              <select
                value={features.weekend.toString()}
                onChange={(e) => updateFeature('weekend', e.target.value === 'true')}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={predicting}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50 transition"
          >
            {predicting ? 'Predicting...' : 'Predict Purchase'}
          </button>
        </div>
      )}

      {prediction && (
        <div className={`rounded-xl shadow-lg p-6 ${
          prediction.will_purchase
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
            : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
        }`}>
          <h2 className="text-2xl font-bold mb-2">
            {prediction.will_purchase ? '✅ Will Purchase' : '❌ Will Not Purchase'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Based on the session features, the k-NN model predicts the customer
            {prediction.will_purchase ? ' will' : ' will not'} make a purchase.
          </p>
        </div>
      )}

      <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">How it works</h3>
        <p className="text-slate-600 dark:text-slate-300">
          This uses <strong>k-Nearest Neighbors (k-NN)</strong> classification. The algorithm finds similar
          past shopping sessions and predicts based on their outcomes. Features include browsing behavior,
          page values, bounce rates, and visitor characteristics.
        </p>
      </div>
    </div>
  )
}
