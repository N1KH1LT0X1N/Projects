'use client'

import { useState } from 'react'
import Link from 'next/link'

const projects = [
  {
    id: 'tictactoe',
    title: 'TicTacToe',
    description: 'Play against an unbeatable AI using the Minimax algorithm',
    category: 'Game Theory',
    tags: ['Minimax', 'Adversarial Search', 'Game AI'],
    color: 'from-red-500 to-pink-500',
    icon: '🎮'
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'AI solver using logical constraint propagation',
    category: 'Logic',
    tags: ['Constraint Satisfaction', 'Logic', 'Inference'],
    color: 'from-yellow-500 to-orange-500',
    icon: '💣'
  },
  {
    id: 'degrees',
    title: 'Degrees',
    description: 'Find connections between actors using BFS search',
    category: 'Search',
    tags: ['Graph Search', 'BFS', 'Six Degrees'],
    color: 'from-green-500 to-emerald-500',
    icon: '🔍'
  },
  {
    id: 'knights',
    title: 'Knights & Knaves',
    description: 'Logic puzzle solver using model checking',
    category: 'Logic',
    tags: ['Propositional Logic', 'Model Checking', 'Puzzles'],
    color: 'from-purple-500 to-indigo-500',
    icon: '♟️'
  },
  {
    id: 'nim',
    title: 'Nim',
    description: 'Q-Learning AI that learns optimal strategy through self-play',
    category: 'Reinforcement Learning',
    tags: ['Q-Learning', 'RL', 'Self-Play'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🎲'
  },
  {
    id: 'parser',
    title: 'Parser',
    description: 'Parse English sentences with context-free grammar',
    category: 'NLP',
    tags: ['CFG', 'Syntax Trees', 'NLP'],
    color: 'from-pink-500 to-rose-500',
    icon: '📝'
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Predict customer purchases using k-NN classifier',
    category: 'Machine Learning',
    tags: ['k-NN', 'Classification', 'Prediction'],
    color: 'from-teal-500 to-green-500',
    icon: '🛒'
  },
  {
    id: 'heredity',
    title: 'Heredity',
    description: 'Calculate gene inheritance probabilities with Bayesian inference',
    category: 'Probability',
    tags: ['Bayesian', 'Genetics', 'Probability'],
    color: 'from-indigo-500 to-purple-500',
    icon: '🧬'
  },
  {
    id: 'pagerank',
    title: 'PageRank',
    description: 'Rank web pages by importance using Google\'s algorithm',
    category: 'Graph Algorithms',
    tags: ['PageRank', 'Graph Theory', 'Web Search'],
    color: 'from-orange-500 to-red-500',
    icon: '📊'
  },
  {
    id: 'crossword',
    title: 'Crossword',
    description: 'Solve crossword puzzles using CSP and backtracking',
    category: 'Constraint Satisfaction',
    tags: ['CSP', 'Backtracking', 'Arc Consistency'],
    color: 'from-cyan-500 to-blue-500',
    icon: '🔤'
  },
  {
    id: 'attention',
    title: 'Attention',
    description: 'Visualize transformer attention patterns in BERT',
    category: 'Deep Learning',
    tags: ['Transformers', 'BERT', 'Attention'],
    color: 'from-violet-500 to-purple-500',
    icon: '👁️'
  },
  {
    id: 'traffic',
    title: 'Traffic Signs',
    description: 'Classify traffic signs with convolutional neural networks',
    category: 'Computer Vision',
    tags: ['CNN', 'Image Classification', 'Deep Learning'],
    color: 'from-red-500 to-orange-500',
    icon: '🚦'
  },
]

const categories = Array.from(new Set(projects.map(p => p.category)))

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category === selectedCategory)
    : projects

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          CS50 AI Portfolio
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
          Explore 12 interactive AI projects covering game theory, search algorithms,
          machine learning, natural language processing, and deep learning
        </p>
        <div className="flex justify-center items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            12 Projects
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            100% Interactive
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Open Source
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full transition ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          All Projects
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-105">
              <div className={`h-2 bg-gradient-to-r ${project.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{project.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{project.category}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
