"""
Crossword API - CSP Puzzle Solver
Solve crossword puzzles using constraint satisfaction
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import sys
import os

# Import original crossword modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'crossword'))
from crossword import Crossword, Variable
from generate import CrosswordCreator

router = APIRouter()

class VariableInfo(BaseModel):
    i: int
    j: int
    direction: str
    length: int

class CrosswordStructure(BaseModel):
    id: str
    height: int
    width: int
    variables: List[VariableInfo]

class SolutionResponse(BaseModel):
    structure_id: str
    solution: Dict[str, str]  # variable_id -> word
    success: bool

@router.get("/structures")
async def list_structures():
    """List available crossword structures"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'crossword', 'data')

    structures = []

    if os.path.exists(data_dir):
        for filename in os.listdir(data_dir):
            if filename.startswith('structure') and filename.endswith('.txt'):
                structure_id = filename.replace('.txt', '')
                structures.append(structure_id)

    return {"structures": structures, "count": len(structures)}

@router.get("/structure/{structure_id}")
async def get_structure(structure_id: str):
    """Get information about a crossword structure"""
    structure_path = os.path.join(
        os.path.dirname(__file__), '..', '..', '..', 'crossword', 'data', f'{structure_id}.txt'
    )

    if not os.path.exists(structure_path):
        raise HTTPException(status_code=404, detail=f"Structure '{structure_id}' not found")

    # Load crossword (with a dummy words file)
    words_path = os.path.join(
        os.path.dirname(__file__), '..', '..', '..', 'crossword', 'data', 'words0.txt'
    )

    crossword = Crossword(structure_path, words_path)

    # Get variable information
    variables_info = []
    for var in crossword.variables:
        variables_info.append(VariableInfo(
            i=var.i,
            j=var.j,
            direction=var.direction.name,
            length=var.length
        ))

    return CrosswordStructure(
        id=structure_id,
        height=crossword.height,
        width=crossword.width,
        variables=variables_info
    )

@router.post("/solve", response_model=SolutionResponse)
async def solve_crossword(structure_id: str, words_id: str = "words0"):
    """Solve a crossword puzzle"""
    structure_path = os.path.join(
        os.path.dirname(__file__), '..', '..', '..', 'crossword', 'data', f'{structure_id}.txt'
    )
    words_path = os.path.join(
        os.path.dirname(__file__), '..', '..', '..', 'crossword', 'data', f'{words_id}.txt'
    )

    if not os.path.exists(structure_path):
        raise HTTPException(status_code=404, detail=f"Structure '{structure_id}' not found")

    if not os.path.exists(words_path):
        raise HTTPException(status_code=404, detail=f"Words '{words_id}' not found")

    # Create crossword
    crossword = Crossword(structure_path, words_path)

    # Solve
    creator = CrosswordCreator(crossword)
    assignment = creator.solve()

    if assignment is None:
        return SolutionResponse(
            structure_id=structure_id,
            solution={},
            success=False
        )

    # Convert solution to serializable format
    solution_dict = {}
    for var, word in assignment.items():
        var_key = f"{var.i},{var.j},{var.direction.name}"
        solution_dict[var_key] = word

    return SolutionResponse(
        structure_id=structure_id,
        solution=solution_dict,
        success=True
    )

@router.get("/words")
async def list_word_lists():
    """List available word lists"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'crossword', 'data')

    word_lists = []

    if os.path.exists(data_dir):
        for filename in os.listdir(data_dir):
            if filename.startswith('words') and filename.endswith('.txt'):
                words_id = filename.replace('.txt', '')
                word_lists.append(words_id)

    return {"word_lists": word_lists, "count": len(word_lists)}
