"""
Degrees API - Six Degrees of Kevin Bacon
Find shortest path between actors using BFS
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import sys
import os

# Import original degrees module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'degrees'))
from degrees import load_data, shortest_path, person_id_for_name

router = APIRouter()

# Global storage for loaded data
data_cache = {}

class SearchRequest(BaseModel):
    source: str
    target: str
    dataset: str = "small"

class PathStep(BaseModel):
    movie_id: str
    movie_title: str
    person_id: str
    person_name: str

class SearchResponse(BaseModel):
    degrees: int
    path: List[PathStep]
    source: str
    target: str

@router.on_event("startup")
async def startup_event():
    """Load datasets on startup"""
    global data_cache

    # Load small dataset
    small_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'degrees', 'small')
    if os.path.exists(small_path):
        data_cache['small'] = load_data(small_path)

    # Load large dataset
    large_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'degrees', 'large')
    if os.path.exists(large_path):
        data_cache['large'] = load_data(large_path)

@router.get("/datasets")
async def get_datasets():
    """Get available datasets"""
    return {
        "datasets": list(data_cache.keys()),
        "loaded": len(data_cache) > 0
    }

@router.get("/search-actors/{dataset}/{query}")
async def search_actors(dataset: str, query: str):
    """Search for actors by name (autocomplete)"""
    if dataset not in data_cache:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset}' not loaded")

    people, movies, _ = data_cache[dataset]

    # Find matching actors
    matches = []
    query_lower = query.lower()

    for person_id, name in people.items():
        if query_lower in name.lower():
            matches.append({"id": person_id, "name": name})
            if len(matches) >= 10:  # Limit to 10 results
                break

    return {"matches": matches, "count": len(matches)}

@router.post("/search", response_model=SearchResponse)
async def find_connection(request: SearchRequest):
    """Find shortest path between two actors"""
    if request.dataset not in data_cache:
        raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset}' not loaded")

    people, movies, connections = data_cache[request.dataset]

    # Find person IDs
    source_id = person_id_for_name(request.source, people)
    target_id = person_id_for_name(request.target, people)

    if source_id is None:
        raise HTTPException(status_code=404, detail=f"Actor '{request.source}' not found")
    if target_id is None:
        raise HTTPException(status_code=404, detail=f"Actor '{request.target}' not found")

    if source_id == target_id:
        return SearchResponse(
            degrees=0,
            path=[],
            source=request.source,
            target=request.target
        )

    # Find shortest path
    path = shortest_path(source_id, target_id, connections)

    if path is None:
        raise HTTPException(status_code=404, detail="No connection found")

    # Build response with human-readable names
    path_steps = []
    for movie_id, person_id in path:
        path_steps.append(PathStep(
            movie_id=movie_id,
            movie_title=movies[movie_id],
            person_id=person_id,
            person_name=people[person_id]
        ))

    return SearchResponse(
        degrees=len(path),
        path=path_steps,
        source=request.source,
        target=request.target
    )

@router.get("/random/{dataset}")
async def get_random_challenge(dataset: str):
    """Get two random actors for a challenge"""
    import random

    if dataset not in data_cache:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset}' not loaded")

    people, _, _ = data_cache[dataset]

    # Get two random people
    person_ids = list(people.keys())
    if len(person_ids) < 2:
        raise HTTPException(status_code=500, detail="Not enough actors in dataset")

    random_ids = random.sample(person_ids, 2)

    return {
        "actor1": {"id": random_ids[0], "name": people[random_ids[0]]},
        "actor2": {"id": random_ids[1], "name": people[random_ids[1]]}
    }
