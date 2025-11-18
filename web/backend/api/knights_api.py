"""
Knights API - Logic Puzzle Solver
Solve Knights and Knaves puzzles using model checking
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import sys
import os

# Import original logic and puzzle modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'knights'))
from logic import Symbol, And, Or, Not, Implication, Biconditional, model_check
import puzzle

router = APIRouter()

class PuzzleInfo(BaseModel):
    id: int
    description: str
    characters: List[str]

class SolutionResult(BaseModel):
    character: str
    is_knight: bool

class PuzzleSolution(BaseModel):
    puzzle_id: int
    solution: List[SolutionResult]
    knowledge_base: str

# Puzzle definitions
PUZZLES = [
    {
        "id": 0,
        "description": "A says 'I am both a knight and a knave.'",
        "characters": ["A"],
        "knowledge": puzzle.knowledge0,
        "symbols": [puzzle.AKnight, puzzle.AKnave]
    },
    {
        "id": 1,
        "description": "A says 'We are both knaves.' B says nothing.",
        "characters": ["A", "B"],
        "knowledge": puzzle.knowledge1,
        "symbols": [puzzle.AKnight, puzzle.AKnave, puzzle.BKnight, puzzle.BKnave]
    },
    {
        "id": 2,
        "description": "A says 'We are the same kind.' B says 'We are of different kinds.'",
        "characters": ["A", "B"],
        "knowledge": puzzle.knowledge2,
        "symbols": [puzzle.AKnight, puzzle.AKnave, puzzle.BKnight, puzzle.BKnave]
    },
    {
        "id": 3,
        "description": "A says either 'I am a knight.' or 'I am a knave.', but you don't know which. B says 'A said \"I am a knave\".'. B then says 'C is a knave.'. C says 'A is a knight.'",
        "characters": ["A", "B", "C"],
        "knowledge": puzzle.knowledge3,
        "symbols": [puzzle.AKnight, puzzle.AKnave, puzzle.BKnight, puzzle.BKnave, puzzle.CKnight, puzzle.CKnave]
    }
]

@router.get("/puzzles", response_model=List[PuzzleInfo])
async def get_puzzles():
    """Get all available puzzles"""
    return [
        PuzzleInfo(
            id=p["id"],
            description=p["description"],
            characters=p["characters"]
        )
        for p in PUZZLES
    ]

@router.get("/solve/{puzzle_id}", response_model=PuzzleSolution)
async def solve_puzzle(puzzle_id: int):
    """Solve a specific puzzle"""
    if puzzle_id < 0 or puzzle_id >= len(PUZZLES):
        raise HTTPException(status_code=404, detail=f"Puzzle {puzzle_id} not found")

    puzzle_data = PUZZLES[puzzle_id]
    knowledge = puzzle_data["knowledge"]
    symbols = puzzle_data["symbols"]

    # Solve puzzle using model checking
    solution_results = []

    for i, char in enumerate(puzzle_data["characters"]):
        knight_symbol = symbols[i * 2]  # e.g., AKnight
        knave_symbol = symbols[i * 2 + 1]  # e.g., AKnave

        # Check if character is a knight
        if model_check(knowledge, knight_symbol):
            solution_results.append(SolutionResult(
                character=char,
                is_knight=True
            ))
        elif model_check(knowledge, knave_symbol):
            solution_results.append(SolutionResult(
                character=char,
                is_knight=False
            ))
        else:
            # Shouldn't happen with valid puzzles
            solution_results.append(SolutionResult(
                character=char,
                is_knight=False  # Default
            ))

    return PuzzleSolution(
        puzzle_id=puzzle_id,
        solution=solution_results,
        knowledge_base=str(knowledge)
    )

@router.get("/puzzle/{puzzle_id}")
async def get_puzzle_details(puzzle_id: int):
    """Get detailed information about a puzzle"""
    if puzzle_id < 0 or puzzle_id >= len(PUZZLES):
        raise HTTPException(status_code=404, detail=f"Puzzle {puzzle_id} not found")

    puzzle_data = PUZZLES[puzzle_id]

    return {
        "id": puzzle_data["id"],
        "description": puzzle_data["description"],
        "characters": puzzle_data["characters"],
        "knowledge_base": str(puzzle_data["knowledge"])
    }
