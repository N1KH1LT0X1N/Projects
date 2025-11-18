# CS50 AI Portfolio - Web Application

A comprehensive full-stack web application showcasing all 12 CS50 AI projects with interactive demos.

## 🌟 Features

- **12 Interactive Projects**: All CS50 AI projects accessible through a modern web interface
- **Pygame to Web**: TicTacToe and Minesweeper converted to WebAssembly using Pygbag
- **RESTful API**: FastAPI backend serving all project algorithms
- **Modern Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and responsive design
- **Zero Code Changes**: Original projects remain untouched - web layer is a wrapper
- **Docker Support**: Containerized deployment for easy setup
- **Real-time Features**: WebSocket support for interactive games (Nim)

## 📁 Project Structure

```
web/
├── backend/                 # FastAPI backend
│   ├── api/                # API endpoints for each project
│   │   ├── degrees_api.py
│   │   ├── knights_api.py
│   │   ├── nim_api.py
│   │   ├── parser_api.py
│   │   ├── shopping_api.py
│   │   ├── heredity_api.py
│   │   ├── pagerank_api.py
│   │   ├── crossword_api.py
│   │   ├── attention_api.py
│   │   └── traffic_api.py
│   ├── models/             # Trained ML models
│   ├── main.py             # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js 14 app directory
│   │   ├── projects/      # Individual project pages
│   │   │   ├── tictactoe/
│   │   │   ├── degrees/
│   │   │   ├── shopping/
│   │   │   ├── traffic/
│   │   │   └── ... (all 12 projects)
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css
│   ├── components/        # Reusable React components
│   ├── lib/              # Utilities and API client
│   ├── package.json
│   └── Dockerfile
│
├── pygbag_projects/       # Pygame to Web conversions
│   ├── tictactoe_web/
│   └── minesweeper_web/
│
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- OR:
  - Python 3.11+
  - Node.js 18+
  - npm or yarn

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd /path/to/Projects
   ```

2. **Start services**
   ```bash
   cd web
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

### Option 2: Manual Setup

#### Backend

```bash
cd web/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt')"

# Run server
uvicorn main:app --reload
```

Backend will be available at http://localhost:8000

#### Frontend

```bash
cd web/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at http://localhost:3000

## 📚 Project Details

### Interactive Web Games (Pygbag)

#### 1. **TicTacToe** 🎮
- **Algorithm**: Minimax with alpha-beta pruning
- **Web Tech**: Pygame → WebAssembly (Pygbag)
- **Features**: Play against unbeatable AI

#### 2. **Minesweeper** 💣
- **Algorithm**: Logical constraint propagation
- **Web Tech**: Pygame → WebAssembly (Pygbag)
- **Features**: AI solver visualization

### API-Driven Projects

#### 3. **Degrees** 🔍
- **Algorithm**: Breadth-First Search (BFS)
- **Features**: Find actor connections, autocomplete search, random challenges
- **Endpoints**:
  - `POST /api/degrees/search` - Find connection
  - `GET /api/degrees/search-actors/{dataset}/{query}` - Autocomplete
  - `GET /api/degrees/random/{dataset}` - Random challenge

#### 4. **Knights & Knaves** ♟️
- **Algorithm**: Propositional logic model checking
- **Features**: Solve 4 logic puzzles with step-by-step reasoning
- **Endpoints**:
  - `GET /api/knights/puzzles` - List puzzles
  - `GET /api/knights/solve/{id}` - Solve puzzle

#### 5. **Nim** 🎲
- **Algorithm**: Q-Learning (Reinforcement Learning)
- **Features**: Train AI, play against AI, view Q-values
- **Tech**: WebSocket for real-time gameplay
- **Endpoints**:
  - `POST /api/nim/train` - Train new AI
  - `WS /api/nim/ws/game` - WebSocket game session
  - `GET /api/nim/ai/{id}/qvalues` - View Q-table

#### 6. **Parser** 📝
- **Algorithm**: Context-Free Grammar (CFG) parsing with NLTK
- **Features**: Parse sentences, visualize syntax trees, extract noun phrases
- **Endpoints**:
  - `POST /api/parser/parse` - Parse sentence
  - `GET /api/parser/grammar` - Get grammar rules
  - `GET /api/parser/examples` - Example sentences

#### 7. **Shopping** 🛒
- **Algorithm**: k-Nearest Neighbors (k-NN)
- **Features**: Train model, predict purchases, interactive feature sliders
- **Endpoints**:
  - `POST /api/shopping/train-default` - Train on default dataset
  - `POST /api/shopping/predict` - Predict purchase

#### 8. **Heredity** 🧬
- **Algorithm**: Bayesian probabilistic inference
- **Features**: Calculate gene/trait probabilities, family tree visualization
- **Endpoints**:
  - `POST /api/heredity/calculate/{id}` - Calculate for example family
  - `GET /api/heredity/examples` - List example families

#### 9. **PageRank** 📊
- **Algorithm**: Google's PageRank (sampling & iterative)
- **Features**: Compare both methods, visualize network
- **Endpoints**:
  - `GET /api/pagerank/corpora` - List corpora
  - `POST /api/pagerank/calculate/{id}` - Calculate ranks

#### 10. **Crossword** 🔤
- **Algorithm**: CSP with backtracking and arc consistency
- **Features**: Solve puzzles, step-by-step visualization
- **Endpoints**:
  - `GET /api/crossword/structures` - List structures
  - `POST /api/crossword/solve` - Solve puzzle

#### 11. **Attention** 👁️
- **Algorithm**: BERT transformer attention visualization
- **Features**: View precomputed attention heatmaps, 12 layers × 12 heads
- **Endpoints**:
  - `GET /api/attention/precomputed` - List visualizations
  - `GET /api/attention/precomputed/{layer}/{head}` - Get specific heatmap

#### 12. **Traffic Signs** 🚦
- **Algorithm**: Convolutional Neural Network (CNN)
- **Features**: Upload images, classify 43 sign categories, confidence scores
- **Endpoints**:
  - `POST /api/traffic/classify` - Classify image
  - `GET /api/traffic/categories` - List categories

## 🔧 API Documentation

Full interactive API documentation available at:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Example API Calls

#### Find Connection Between Actors
```bash
curl -X POST http://localhost:8000/api/degrees/search \
  -H "Content-Type: application/json" \
  -d '{"source": "Tom Hanks", "target": "Kevin Bacon", "dataset": "small"}'
```

#### Train Shopping Model
```bash
curl -X POST http://localhost:8000/api/shopping/train-default
```

#### Classify Traffic Sign
```bash
curl -X POST http://localhost:8000/api/traffic/classify \
  -F "file=@traffic_sign.jpg"
```

## 🎨 Frontend Pages

Each project has a dedicated page at `/projects/{project-id}`:

- `/projects/tictactoe` - TicTacToe game
- `/projects/minesweeper` - Minesweeper game
- `/projects/degrees` - Actor connection finder
- `/projects/knights` - Logic puzzle solver
- `/projects/nim` - Q-Learning game
- `/projects/parser` - Sentence parser
- `/projects/shopping` - Purchase predictor
- `/projects/heredity` - Gene probability calculator
- `/projects/pagerank` - Page ranking
- `/projects/crossword` - Crossword solver
- `/projects/attention` - Attention visualizer
- `/projects/traffic` - Traffic sign classifier

## 🚢 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Deployment Options

1. **Vercel** (Frontend)
   - Deploy Next.js app directly from GitHub
   - Set `NEXT_PUBLIC_API_URL` environment variable

2. **Railway/Render** (Backend)
   - Deploy FastAPI from GitHub
   - Automatic HTTPS and scaling

3. **Docker** (Both)
   - Use docker-compose for self-hosting
   - Deploy to AWS/GCP/Azure with container services

### Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit variables as needed for production.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🛠️ Development

### Adding a New Project

1. **Create API endpoint** in `backend/api/new_project_api.py`
2. **Register router** in `backend/main.py`
3. **Add to API client** in `frontend/lib/api.ts`
4. **Create page** in `frontend/app/projects/new_project/page.tsx`
5. **Update landing page** in `frontend/app/page.tsx`

### Code Style

- **Backend**: PEP 8 (use `black` for formatting)
- **Frontend**: ESLint + Prettier

### Hot Reload

Both frontend and backend support hot reload in development mode.

## 📊 Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────┐
│  Next.js Frontend       │
│  - React Components     │
│  - Tailwind CSS         │
│  - API Client           │
└──────┬──────────────────┘
       │ HTTP/WebSocket
       ↓
┌─────────────────────────┐
│  FastAPI Backend        │
│  - REST Endpoints       │
│  - WebSocket Support    │
│  - ML Model Serving     │
└──────┬──────────────────┘
       │ Python imports
       ↓
┌─────────────────────────┐
│  Original Projects      │
│  (Untouched!)           │
│  - degrees.py           │
│  - shopping.py          │
│  - etc.                 │
└─────────────────────────┘
```

## 🎯 Design Philosophy

### Zero Code Modifications
- Original CS50 AI projects remain **completely untouched**
- Web layer imports and wraps original functionality
- Any updates to original code automatically reflected in web version

### Separation of Concerns
- **Backend**: Algorithm execution, data processing
- **Frontend**: UI/UX, user interaction, visualization
- **Original Projects**: Core AI/ML logic

### Modern Stack
- **FastAPI**: Modern, fast, auto-documented API
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Type safety for frontend
- **Tailwind CSS**: Utility-first styling
- **Docker**: Containerization for consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project builds upon CS50 AI course materials. Please check individual project folders for specific licenses.

## 🙏 Acknowledgments

- **CS50 AI** - Harvard University
- **Original Projects** - CS50 AI Course Staff
- **N1KH1LT0X1N** - Implementation and web adaptation

## 📞 Contact

For questions or suggestions:
- GitHub: [@N1KH1LT0X1N](https://github.com/N1KH1LT0X1N)
- Repository: https://github.com/N1KH1LT0X1N/Projects

---

**Built with ❤️ for CS50 AI**
