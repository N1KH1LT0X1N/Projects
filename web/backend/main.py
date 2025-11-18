"""
CS50 AI Portfolio - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sys
import os

# Add parent directory to path to import original projects
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

# Import API routers
from api import (
    degrees_api,
    knights_api,
    nim_api,
    parser_api,
    shopping_api,
    heredity_api,
    pagerank_api,
    crossword_api,
    attention_api,
    traffic_api
)

# Create FastAPI app
app = FastAPI(
    title="CS50 AI Portfolio API",
    description="REST API for interactive CS50 AI projects",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(degrees_api.router, prefix="/api/degrees", tags=["Degrees"])
app.include_router(knights_api.router, prefix="/api/knights", tags=["Knights"])
app.include_router(nim_api.router, prefix="/api/nim", tags=["Nim"])
app.include_router(parser_api.router, prefix="/api/parser", tags=["Parser"])
app.include_router(shopping_api.router, prefix="/api/shopping", tags=["Shopping"])
app.include_router(heredity_api.router, prefix="/api/heredity", tags=["Heredity"])
app.include_router(pagerank_api.router, prefix="/api/pagerank", tags=["PageRank"])
app.include_router(crossword_api.router, prefix="/api/crossword", tags=["Crossword"])
app.include_router(attention_api.router, prefix="/api/attention", tags=["Attention"])
app.include_router(traffic_api.router, prefix="/api/traffic", tags=["Traffic"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CS50 AI Portfolio API",
        "docs": "/api/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
