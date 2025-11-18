"""
Parser API - Natural Language Processing
Parse sentences using context-free grammar
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import sys
import os

# Import original parser module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'parser'))
import parser as parser_module

router = APIRouter()

class ParseRequest(BaseModel):
    sentence: str

class TreeNode(BaseModel):
    label: str
    children: List[Any]  # Can be TreeNode or str
    is_terminal: bool

class ParseResult(BaseModel):
    sentence: str
    trees: List[Dict]
    noun_phrases: List[List[str]]
    num_trees: int

def tree_to_dict(tree) -> Dict:
    """Convert NLTK tree to dictionary"""
    if isinstance(tree, str):
        return {"label": tree, "is_terminal": True, "children": []}

    return {
        "label": tree.label(),
        "is_terminal": False,
        "children": [tree_to_dict(child) if hasattr(child, 'label') else child for child in tree]
    }

@router.post("/parse", response_model=ParseResult)
async def parse_sentence(request: ParseRequest):
    """Parse a sentence and return syntax trees"""
    sentence = request.sentence.strip()

    if not sentence:
        raise HTTPException(status_code=400, detail="Sentence cannot be empty")

    # Preprocess and parse
    s = parser_module.preprocess(sentence)
    trees = list(parser_module.parser.parse(s))

    if not trees:
        raise HTTPException(status_code=400, detail="Could not parse sentence. It may not match the grammar.")

    # Extract noun phrases from all trees
    all_noun_phrases = []
    for tree in trees:
        np_chunks = parser_module.np_chunk(tree)
        # Convert chunks to list of words
        phrases = [[word for word in chunk.leaves()] for chunk in np_chunks]
        all_noun_phrases.append(phrases)

    # Convert trees to dictionaries
    tree_dicts = [tree_to_dict(tree) for tree in trees]

    return ParseResult(
        sentence=sentence,
        trees=tree_dicts,
        noun_phrases=all_noun_phrases,
        num_trees=len(trees)
    )

@router.get("/grammar")
async def get_grammar():
    """Get the grammar rules"""
    grammar_str = str(parser_module.parser.grammar())

    return {
        "grammar": grammar_str,
        "terminals": list(parser_module.TERMINALS.keys()),
        "nonterminals": list(parser_module.NONTERMINALS.keys()) if hasattr(parser_module, 'NONTERMINALS') else []
    }

@router.get("/examples")
async def get_example_sentences():
    """Get example sentences"""
    examples_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'parser', 'sentences')

    examples = []

    if os.path.exists(examples_dir):
        for i in range(1, 11):  # sentences 1-10
            filepath = os.path.join(examples_dir, f"{i}.txt")
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    sentence = f.read().strip()
                    examples.append({"id": i, "sentence": sentence})

    return {"examples": examples, "count": len(examples)}
