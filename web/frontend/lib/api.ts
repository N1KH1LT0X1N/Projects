/**
 * API client for CS50 AI Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class APIClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Degrees API
  async searchActors(dataset: string, query: string) {
    return this.request(`/api/degrees/search-actors/${dataset}/${encodeURIComponent(query)}`)
  }

  async findConnection(source: string, target: string, dataset: string = 'small') {
    return this.request('/api/degrees/search', {
      method: 'POST',
      body: JSON.stringify({ source, target, dataset }),
    })
  }

  async getRandomChallenge(dataset: string = 'small') {
    return this.request(`/api/degrees/random/${dataset}`)
  }

  // Knights API
  async getKnightsPuzzles() {
    return this.request('/api/knights/puzzles')
  }

  async solveKnightsPuzzle(puzzleId: number) {
    return this.request(`/api/knights/solve/${puzzleId}`)
  }

  // Nim API
  async trainNimAI(games: number = 10000, aiId: string = 'default') {
    return this.request('/api/nim/train', {
      method: 'POST',
      body: JSON.stringify({ games, ai_id: aiId }),
    })
  }

  async getNimQValues(aiId: string = 'default') {
    return this.request(`/api/nim/ai/${aiId}/qvalues`)
  }

  // Parser API
  async parseSentence(sentence: string) {
    return this.request('/api/parser/parse', {
      method: 'POST',
      body: JSON.stringify({ sentence }),
    })
  }

  async getGrammar() {
    return this.request('/api/parser/grammar')
  }

  async getParserExamples() {
    return this.request('/api/parser/examples')
  }

  // Shopping API
  async trainShoppingModel() {
    return this.request('/api/shopping/train-default', {
      method: 'POST',
    })
  }

  async predictPurchase(features: any, modelId: string = 'default') {
    return this.request('/api/shopping/predict', {
      method: 'POST',
      body: JSON.stringify({ features, model_id: modelId }),
    })
  }

  // Heredity API
  async calculateHeredity(exampleId: number) {
    return this.request(`/api/heredity/calculate/${exampleId}`, {
      method: 'POST',
    })
  }

  async getHeredityExamples() {
    return this.request('/api/heredity/examples')
  }

  // PageRank API
  async getCorpora() {
    return this.request('/api/pagerank/corpora')
  }

  async calculatePageRank(corpusId: string, samples: number = 10000, damping: number = 0.85) {
    return this.request(`/api/pagerank/calculate/${corpusId}?samples=${samples}&damping=${damping}`, {
      method: 'POST',
    })
  }

  // Crossword API
  async getCrosswordStructures() {
    return this.request('/api/crossword/structures')
  }

  async solveCrossword(structureId: string, wordsId: string = 'words0') {
    return this.request(`/api/crossword/solve?structure_id=${structureId}&words_id=${wordsId}`, {
      method: 'POST',
    })
  }

  // Attention API
  async getPrecomputedAttention() {
    return this.request('/api/attention/precomputed')
  }

  async getAttentionImage(layer: number, head: number) {
    return this.request(`/api/attention/precomputed/${layer}/${head}`)
  }

  // Traffic API
  async classifyTrafficSign(imageFile: File) {
    const formData = new FormData()
    formData.append('file', imageFile)

    const response = await fetch(`${this.baseURL}/api/traffic/classify`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return response.json()
  }

  async getTrafficCategories() {
    return this.request('/api/traffic/categories')
  }
}

export const api = new APIClient()
