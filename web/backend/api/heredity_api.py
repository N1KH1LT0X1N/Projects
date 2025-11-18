"""
Heredity API - Genetic Inheritance Probability
Calculate gene and trait probabilities using Bayesian inference
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Dict, Optional, List
import sys
import os
import tempfile
import csv

# Import original heredity module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'heredity'))
from heredity import load_data, joint_probability, update, normalize, PROBS

router = APIRouter()

class PersonData(BaseModel):
    name: str
    mother: Optional[str]
    father: Optional[str]
    trait: Optional[bool]

class FamilyData(BaseModel):
    people: List[PersonData]

class PersonProbabilities(BaseModel):
    name: str
    gene: Dict[int, float]  # {0: prob, 1: prob, 2: prob}
    trait: Dict[bool, float]  # {True: prob, False: prob}

class HeredityResponse(BaseModel):
    probabilities: List[PersonProbabilities]
    probability_constants: Dict[str, any]

@router.post("/calculate")
async def calculate_probabilities(file: UploadFile = File(...)):
    """Calculate gene and trait probabilities from CSV"""

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.csv', mode='w') as tmp:
        content = await file.read()
        tmp.write(content.decode('utf-8'))
        tmp_path = tmp.name

    try:
        # Load data
        people = load_data(tmp_path)

        # Calculate probabilities
        probabilities = {
            person: {
                "gene": {
                    2: 0,
                    1: 0,
                    0: 0
                },
                "trait": {
                    True: 0,
                    False: 0
                }
            }
            for person in people
        }

        # Update probabilities
        from itertools import product

        # Get all possible gene/trait combinations
        names = list(people.keys())
        gene_counts = [0, 1, 2]
        trait_values = [True, False]

        # Generate all possible combinations
        for genes in product(gene_counts, repeat=len(names)):
            for traits in product(trait_values, repeat=len(names)):
                # Create one_gene and two_genes sets
                one_gene = {names[i] for i in range(len(names)) if genes[i] == 1}
                two_genes = {names[i] for i in range(len(names)) if genes[i] == 2}
                have_trait = {names[i] for i in range(len(names)) if traits[i]}

                # Calculate joint probability
                p = joint_probability(people, one_gene, two_genes, have_trait)

                # Update probabilities
                update(probabilities, one_gene, two_genes, have_trait, p)

        # Normalize
        normalize(probabilities)

        # Format response
        results = []
        for person in people:
            results.append(PersonProbabilities(
                name=person,
                gene={
                    0: probabilities[person]["gene"][0],
                    1: probabilities[person]["gene"][1],
                    2: probabilities[person]["gene"][2]
                },
                trait={
                    True: probabilities[person]["trait"][True],
                    False: probabilities[person]["trait"][False]
                }
            ))

        return HeredityResponse(
            probabilities=results,
            probability_constants={
                "mutation": PROBS["mutation"],
                "gene": PROBS["gene"],
                "trait": PROBS["trait"]
            }
        )

    finally:
        # Clean up temp file
        os.unlink(tmp_path)

@router.get("/examples")
async def get_example_families():
    """Get example family data files"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'heredity', 'data')

    examples = []

    if os.path.exists(data_dir):
        for filename in os.listdir(data_dir):
            if filename.endswith('.csv'):
                filepath = os.path.join(data_dir, filename)
                # Load and return family data
                people = load_data(filepath)

                family_people = []
                for name, data in people.items():
                    family_people.append({
                        "name": name,
                        "mother": data.get("mother"),
                        "father": data.get("father"),
                        "trait": data.get("trait")
                    })

                examples.append({
                    "filename": filename,
                    "people": family_people
                })

    return {"examples": examples, "count": len(examples)}

@router.post("/calculate/{example_id}")
async def calculate_example(example_id: int):
    """Calculate probabilities for a preset example family"""
    csv_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'heredity', 'data', f'family{example_id}.csv')

    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail=f"Family example {example_id} not found")

    # Load data
    people = load_data(csv_path)

    # Calculate probabilities (same logic as above)
    probabilities = {
        person: {
            "gene": {2: 0, 1: 0, 0: 0},
            "trait": {True: 0, False: 0}
        }
        for person in people
    }

    from itertools import product
    names = list(people.keys())
    gene_counts = [0, 1, 2]
    trait_values = [True, False]

    for genes in product(gene_counts, repeat=len(names)):
        for traits in product(trait_values, repeat=len(names)):
            one_gene = {names[i] for i in range(len(names)) if genes[i] == 1}
            two_genes = {names[i] for i in range(len(names)) if genes[i] == 2}
            have_trait = {names[i] for i in range(len(names)) if traits[i]}

            p = joint_probability(people, one_gene, two_genes, have_trait)
            update(probabilities, one_gene, two_genes, have_trait, p)

    normalize(probabilities)

    results = []
    for person in people:
        results.append(PersonProbabilities(
            name=person,
            gene={
                0: probabilities[person]["gene"][0],
                1: probabilities[person]["gene"][1],
                2: probabilities[person]["gene"][2]
            },
            trait={
                True: probabilities[person]["trait"][True],
                False: probabilities[person]["trait"][False]
            }
        ))

    return HeredityResponse(
        probabilities=results,
        probability_constants={
            "mutation": PROBS["mutation"],
            "gene": PROBS["gene"],
            "trait": PROBS["trait"]
        }
    )
