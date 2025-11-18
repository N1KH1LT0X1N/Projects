"""
PageRank API - Web Page Ranking Algorithm
Calculate PageRank using sampling and iteration methods
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import sys
import os

# Import original pagerank module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'pagerank'))
from pagerank import crawl, sample_pagerank, iterate_pagerank

router = APIRouter()

class PageRankResult(BaseModel):
    page: str
    rank: float

class PageRankResponse(BaseModel):
    corpus_id: str
    sampling_results: List[PageRankResult]
    iteration_results: List[PageRankResult]
    sampling_samples: int
    damping_factor: float

class CorpusInfo(BaseModel):
    id: str
    pages: List[str]
    links: Dict[str, List[str]]

@router.get("/corpora")
async def list_corpora():
    """List available corpus datasets"""
    pagerank_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'pagerank')

    corpora = []

    for i in range(3):  # corpus0, corpus1, corpus2
        corpus_dir = os.path.join(pagerank_dir, f'corpus{i}')
        if os.path.exists(corpus_dir):
            corpora.append(f'corpus{i}')

    return {"corpora": corpora, "count": len(corpora)}

@router.get("/corpus/{corpus_id}")
async def get_corpus_info(corpus_id: str):
    """Get information about a corpus"""
    corpus_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'pagerank', corpus_id)

    if not os.path.exists(corpus_dir):
        raise HTTPException(status_code=404, detail=f"Corpus '{corpus_id}' not found")

    # Crawl corpus
    corpus = crawl(corpus_dir)

    return CorpusInfo(
        id=corpus_id,
        pages=list(corpus.keys()),
        links=corpus
    )

@router.post("/calculate/{corpus_id}", response_model=PageRankResponse)
async def calculate_pagerank(corpus_id: str, samples: int = 10000, damping: float = 0.85):
    """Calculate PageRank for a corpus using both methods"""
    corpus_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'pagerank', corpus_id)

    if not os.path.exists(corpus_dir):
        raise HTTPException(status_code=404, detail=f"Corpus '{corpus_id}' not found")

    # Crawl corpus
    corpus = crawl(corpus_dir)

    # Calculate PageRank using sampling
    sampling_ranks = sample_pagerank(corpus, damping, samples)

    # Calculate PageRank using iteration
    iteration_ranks = iterate_pagerank(corpus, damping)

    # Format results
    sampling_results = [
        PageRankResult(page=page, rank=rank)
        for page, rank in sorted(sampling_ranks.items(), key=lambda x: x[1], reverse=True)
    ]

    iteration_results = [
        PageRankResult(page=page, rank=rank)
        for page, rank in sorted(iteration_ranks.items(), key=lambda x: x[1], reverse=True)
    ]

    return PageRankResponse(
        corpus_id=corpus_id,
        sampling_results=sampling_results,
        iteration_results=iteration_results,
        sampling_samples=samples,
        damping_factor=damping
    )
