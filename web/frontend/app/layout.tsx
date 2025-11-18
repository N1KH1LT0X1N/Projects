import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CS50 AI Portfolio | Interactive Demos',
  description: 'Explore 12 interactive AI projects from CS50 AI - from game theory to deep learning',
  keywords: 'AI, Machine Learning, CS50, Portfolio, Interactive Demos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CS50 AI Portfolio
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/N1KH1LT0X1N/Projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-slate-600 dark:text-slate-400">
              <p className="mb-2">
                Built by <a href="https://github.com/N1KH1LT0X1N" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">N1KH1LT0X1N</a>
              </p>
              <p className="text-sm">
                CS50 AI Projects - Harvard University
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
