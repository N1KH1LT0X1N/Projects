"""
Degrees API - Six Degrees of Kevin Bacon
Find shortest path between actors using BFS
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Set
import sys
import os
import csv

# Import original degrees util module for Node and QueueFrontier
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'degrees'))
from util import Node, QueueFrontier

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

def load_degrees_data(directory: str):
    """Load data from CSV files into memory"""
    names = {}
    people = {}
    movies = {}

    # Load people
    with open(f"{directory}/people.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            people[row["id"]] = {
                "name": row["name"],
                "birth": row["birth"],
                "movies": set()
            }
            if row["name"].lower() not in names:
                names[row["name"].lower()] = {row["id"]}
            else:
                names[row["name"].lower()].add(row["id"])

    # Load movies
    with open(f"{directory}/movies.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            movies[row["id"]] = {
                "title": row["title"],
                "year": row["year"],
                "stars": set()
            }

    # Load stars
    with open(f"{directory}/stars.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                people[row["person_id"]]["movies"].add(row["movie_id"])
                movies[row["movie_id"]]["stars"].add(row["person_id"])
            except KeyError:
                pass

    return names, people, movies

def person_id_for_name_api(name: str, names: dict) -> Optional[str]:
    """Returns the IMDB id for a person's name (first match)"""
    person_ids = list(names.get(name.lower(), set()))
    if len(person_ids) == 0:
        return None
    return person_ids[0]

def neighbors_for_person(person_id: str, people: dict, movies: dict) -> Set:
    """Returns (movie_id, person_id) pairs for people who starred with a given person"""
    movie_ids = people[person_id]["movies"]
    neighbors = set()
    for movie_id in movie_ids:
        for pid in movies[movie_id]["stars"]:
            neighbors.add((movie_id, pid))
    return neighbors

def shortest_path_api(source: str, target: str, people: dict, movies: dict) -> Optional[List]:
    """Returns the shortest list of (movie_id, person_id) pairs that connect source to target"""
    start = Node(state=source, parent=None, action=None)
    frontier = QueueFrontier()
    frontier.add(start)
    explored = set()

    while True:
        if frontier.empty():
            return None

        node = frontier.remove()

        if node.state == target:
            path = []
            while node.parent is not None:
                path.append((node.action, node.state))
                node = node.parent
            path.reverse()
            return path

        explored.add(node.state)

        # Find neighbors
        neighbors = neighbors_for_person(node.state, people, movies)

        # Add neighbors to frontier
        for action, state in neighbors:
            if not frontier.contains_state(state) and state not in explored:
                child = Node(state=state, parent=node, action=action)
                if child.state == target:
                    path = []
                    while child.parent is not None:
                        path.append((child.action, child.state))
                        child = child.parent
                    path.reverse()
                    return path
                frontier.add(child)

@router.on_event("startup")
async def startup_event():
    """Load datasets on startup"""
    global data_cache

    # Load small dataset
    small_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'degrees', 'small')
    if os.path.exists(small_path):
        data_cache['small'] = load_degrees_data(small_path)

    # Load large dataset
    large_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'degrees', 'large')
    if os.path.exists(large_path):
        data_cache['large'] = load_degrees_data(large_path)

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

    names, people, movies = data_cache[dataset]

    # Find matching actors
    matches = []
    query_lower = query.lower()

    for name_key, person_ids in names.items():
        if query_lower in name_key:
            for person_id in person_ids:
                matches.append({"id": person_id, "name": people[person_id]["name"]})
                if len(matches) >= 10:
                    break
        if len(matches) >= 10:
            break

    return {"matches": matches, "count": len(matches)}

@router.post("/search", response_model=SearchResponse)
async def find_connection(request: SearchRequest):
    """Find shortest path between two actors"""
    if request.dataset not in data_cache:
        raise HTTPException(status_code=404, detail=f"Dataset '{request.dataset}' not loaded")

    names, people, movies = data_cache[request.dataset]

    # Find person IDs
    source_id = person_id_for_name_api(request.source, names)
    target_id = person_id_for_name_api(request.target, names)

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
    path = shortest_path_api(source_id, target_id, people, movies)

    if path is None:
        raise HTTPException(status_code=404, detail="No connection found")

    # Build response with human-readable names
    path_steps = []
    for movie_id, person_id in path:
        path_steps.append(PathStep(
            movie_id=movie_id,
            movie_title=movies[movie_id]["title"],
            person_id=person_id,
            person_name=people[person_id]["name"]
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

    names, people, movies = data_cache[dataset]

    # Get two random people
    person_ids = list(people.keys())
    if len(person_ids) < 2:
        raise HTTPException(status_code=500, detail="Not enough actors in dataset")

    random_ids = random.sample(person_ids, 2)

    return {
        "actor1": {"id": random_ids[0], "name": people[random_ids[0]]["name"]},
        "actor2": {"id": random_ids[1], "name": people[random_ids[1]]["name"]}
    }
