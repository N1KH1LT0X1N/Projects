"""
Attention API - Transformer Attention Visualization
Visualize BERT attention patterns and masked token prediction
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import sys
import os
import base64
from io import BytesIO

# Import original attention module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'attention'))
try:
    from mask import generate, get_attention, get_predictions, MASK_TOKEN
    import tensorflow as tf
except ImportError:
    # Graceful degradation if TensorFlow not available
    pass

router = APIRouter()

class AttentionRequest(BaseModel):
    text: str
    masked_index: int = -1  # Index of masked token, -1 for auto-detect

class TokenPrediction(BaseModel):
    token: str
    probability: float

class AttentionVisualization(BaseModel):
    layer: int
    head: int
    image_base64: str

class AttentionResponse(BaseModel):
    text: str
    tokens: List[str]
    predictions: List[TokenPrediction]
    masked_token_index: int

@router.post("/visualize")
async def visualize_attention(request: AttentionRequest):
    """Generate attention visualizations and predictions for text"""
    try:
        # This would use the mask.py module to generate attention
        # For now, returning a placeholder since it requires BERT model
        raise HTTPException(
            status_code=501,
            detail="Attention visualization requires BERT model to be loaded. Use precomputed visualizations instead."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/precomputed")
async def get_precomputed_attention():
    """Get list of precomputed attention visualizations"""
    attention_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'attention')

    visualizations = []

    if os.path.exists(attention_dir):
        for filename in os.listdir(attention_dir):
            if filename.endswith('.png') and 'Attention' in filename:
                # Parse filename like "Attention_Layer5_Head3.png"
                parts = filename.replace('.png', '').split('_')
                if len(parts) >= 3:
                    try:
                        layer = int(parts[1].replace('Layer', ''))
                        head = int(parts[2].replace('Head', ''))
                        visualizations.append({
                            "layer": layer,
                            "head": head,
                            "filename": filename
                        })
                    except ValueError:
                        continue

    return {
        "visualizations": visualizations,
        "count": len(visualizations),
        "layers": 12,
        "heads_per_layer": 12
    }

@router.get("/precomputed/{layer}/{head}")
async def get_precomputed_image(layer: int, head: int):
    """Get a specific precomputed attention visualization"""
    attention_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'attention')

    # Find matching file
    filename = f"Attention_Layer{layer}_Head{head}.png"
    filepath = os.path.join(attention_dir, filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"Visualization for Layer {layer}, Head {head} not found")

    # Read and encode image
    with open(filepath, 'rb') as f:
        image_data = f.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')

    return {
        "layer": layer,
        "head": head,
        "image_base64": image_base64,
        "content_type": "image/png"
    }

@router.get("/info")
async def get_model_info():
    """Get information about the attention model"""
    return {
        "model": "BERT-base-uncased",
        "layers": 12,
        "attention_heads": 12,
        "hidden_size": 768,
        "vocabulary_size": 30522,
        "max_sequence_length": 512
    }
