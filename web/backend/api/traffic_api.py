"""
Traffic API - Traffic Sign Classification
Classify traffic signs using CNN
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
import numpy as np
from io import BytesIO

# Import original traffic module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'traffic'))

router = APIRouter()

# Global model storage
traffic_model = None

# Traffic sign categories (43 categories for GTSRB dataset)
CATEGORIES = {
    0: "Speed limit (20km/h)",
    1: "Speed limit (30km/h)",
    2: "Speed limit (50km/h)",
    3: "Speed limit (60km/h)",
    4: "Speed limit (70km/h)",
    5: "Speed limit (80km/h)",
    6: "End of speed limit (80km/h)",
    7: "Speed limit (100km/h)",
    8: "Speed limit (120km/h)",
    9: "No passing",
    10: "No passing for vehicles over 3.5 metric tons",
    11: "Right-of-way at the next intersection",
    12: "Priority road",
    13: "Yield",
    14: "Stop",
    15: "No vehicles",
    16: "Vehicles over 3.5 metric tons prohibited",
    17: "No entry",
    18: "General caution",
    19: "Dangerous curve to the left",
    20: "Dangerous curve to the right",
    21: "Double curve",
    22: "Bumpy road",
    23: "Slippery road",
    24: "Road narrows on the right",
    25: "Road work",
    26: "Traffic signals",
    27: "Pedestrians",
    28: "Children crossing",
    29: "Bicycles crossing",
    30: "Beware of ice/snow",
    31: "Wild animals crossing",
    32: "End of all speed and passing limits",
    33: "Turn right ahead",
    34: "Turn left ahead",
    35: "Ahead only",
    36: "Go straight or right",
    37: "Go straight or left",
    38: "Keep right",
    39: "Keep left",
    40: "Roundabout mandatory",
    41: "End of no passing",
    42: "End of no passing by vehicles over 3.5 metric tons"
}

class PredictionResult(BaseModel):
    category: int
    name: str
    confidence: float

class ClassificationResponse(BaseModel):
    top_prediction: PredictionResult
    top_5: List[PredictionResult]
    all_probabilities: Optional[List[float]] = None

@router.on_event("startup")
async def load_model():
    """Load trained model on startup"""
    global traffic_model

    try:
        import tensorflow as tf
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'traffic_model.h5')

        if os.path.exists(model_path):
            traffic_model = tf.keras.models.load_model(model_path)
            print(f"Loaded traffic model from {model_path}")
        else:
            print(f"Traffic model not found at {model_path}. Classification will not be available.")
    except Exception as e:
        print(f"Error loading traffic model: {e}")

@router.post("/classify", response_model=ClassificationResponse)
async def classify_image(file: UploadFile = File(...)):
    """Classify a traffic sign image"""
    if traffic_model is None:
        raise HTTPException(
            status_code=503,
            detail="Traffic model not loaded. Please train a model first."
        )

    try:
        import cv2
        import tensorflow as tf

        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Preprocess image
        img = cv2.resize(img, (30, 30))
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=0)

        # Make prediction
        predictions = traffic_model.predict(img)[0]

        # Get top prediction
        top_category = int(np.argmax(predictions))
        top_confidence = float(predictions[top_category])

        # Get top 5
        top_5_indices = np.argsort(predictions)[-5:][::-1]
        top_5 = [
            PredictionResult(
                category=int(idx),
                name=CATEGORIES.get(int(idx), f"Category {idx}"),
                confidence=float(predictions[idx])
            )
            for idx in top_5_indices
        ]

        return ClassificationResponse(
            top_prediction=PredictionResult(
                category=top_category,
                name=CATEGORIES.get(top_category, f"Category {top_category}"),
                confidence=top_confidence
            ),
            top_5=top_5,
            all_probabilities=predictions.tolist()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")

@router.get("/categories")
async def get_categories():
    """Get all traffic sign categories"""
    return {
        "categories": CATEGORIES,
        "count": len(CATEGORIES)
    }

@router.get("/model-info")
async def get_model_info():
    """Get information about the model"""
    return {
        "loaded": traffic_model is not None,
        "architecture": "CNN",
        "input_shape": [30, 30, 3],
        "output_classes": 43,
        "dataset": "GTSRB (German Traffic Sign Recognition Benchmark)"
    }
