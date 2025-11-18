"""
Shopping API - Purchase Prediction ML
Predict customer purchases using k-NN classifier
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
import sys
import os
import tempfile
import csv

# Import original shopping module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shopping'))
from shopping import load_data, train_model

router = APIRouter()

# Global model storage
models = {}

class SessionFeatures(BaseModel):
    administrative: int
    administrative_duration: float
    informational: int
    informational_duration: float
    product_related: int
    product_related_duration: float
    bounce_rates: float
    exit_rates: float
    page_values: float
    special_day: float
    month: str
    operating_systems: int
    browser: int
    region: int
    traffic_type: int
    visitor_type: str
    weekend: bool

class PredictionRequest(BaseModel):
    features: SessionFeatures
    model_id: str = "default"

class PredictionResponse(BaseModel):
    will_purchase: bool
    model_id: str

class ModelMetrics(BaseModel):
    sensitivity: float
    specificity: float
    correct: int
    incorrect: int
    total: int
    accuracy: float

class TrainResponse(BaseModel):
    model_id: str
    metrics: ModelMetrics
    training_samples: int
    testing_samples: int

@router.post("/train", response_model=TrainResponse)
async def train_shopping_model(file: UploadFile = File(...), model_id: str = "default"):
    """Train a model from uploaded CSV"""
    import sklearn.neighbors

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Load data
        evidence, labels = load_data(tmp_path)

        # Train model
        model = train_model(evidence, labels)

        # Split for testing (same as original)
        from sklearn.model_selection import train_test_split
        X_train, X_test, y_train, y_test = train_test_split(
            evidence, labels, test_size=0.4
        )

        # Make predictions
        predictions = model.predict(X_test)

        # Calculate metrics
        correct = (y_test == predictions).sum()
        incorrect = (y_test != predictions).sum()
        total = len(predictions)

        # Calculate sensitivity and specificity
        true_positive = ((predictions == 1) & (y_test == 1)).sum()
        true_negative = ((predictions == 0) & (y_test == 0)).sum()
        false_positive = ((predictions == 1) & (y_test == 0)).sum()
        false_negative = ((predictions == 0) & (y_test == 1)).sum()

        sensitivity = true_positive / (true_positive + false_negative) if (true_positive + false_negative) > 0 else 0
        specificity = true_negative / (true_negative + false_positive) if (true_negative + false_positive) > 0 else 0

        # Store model
        models[model_id] = model

        metrics = ModelMetrics(
            sensitivity=float(sensitivity),
            specificity=float(specificity),
            correct=int(correct),
            incorrect=int(incorrect),
            total=int(total),
            accuracy=float(correct / total)
        )

        return TrainResponse(
            model_id=model_id,
            metrics=metrics,
            training_samples=len(X_train),
            testing_samples=len(X_test)
        )

    finally:
        # Clean up temp file
        os.unlink(tmp_path)

@router.post("/train-default", response_model=TrainResponse)
async def train_default_model():
    """Train model using the default shopping.csv"""
    csv_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'shopping', 'shopping.csv')

    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Default shopping.csv not found")

    # Load data
    evidence, labels = load_data(csv_path)

    # Train model
    model = train_model(evidence, labels)

    # Split for testing
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(
        evidence, labels, test_size=0.4
    )

    # Make predictions
    predictions = model.predict(X_test)

    # Calculate metrics
    correct = (y_test == predictions).sum()
    incorrect = (y_test != predictions).sum()
    total = len(predictions)

    true_positive = ((predictions == 1) & (y_test == 1)).sum()
    true_negative = ((predictions == 0) & (y_test == 0)).sum()
    false_positive = ((predictions == 1) & (y_test == 0)).sum()
    false_negative = ((predictions == 0) & (y_test == 1)).sum()

    sensitivity = true_positive / (true_positive + false_negative) if (true_positive + false_negative) > 0 else 0
    specificity = true_negative / (true_negative + false_positive) if (true_negative + false_positive) > 0 else 0

    # Store model
    models["default"] = model

    metrics = ModelMetrics(
        sensitivity=float(sensitivity),
        specificity=float(specificity),
        correct=int(correct),
        incorrect=int(incorrect),
        total=int(total),
        accuracy=float(correct / total)
    )

    return TrainResponse(
        model_id="default",
        metrics=metrics,
        training_samples=len(X_train),
        testing_samples=len(X_test)
    )

@router.post("/predict", response_model=PredictionResponse)
async def predict_purchase(request: PredictionRequest):
    """Predict if customer will make a purchase"""
    if request.model_id not in models:
        raise HTTPException(status_code=404, detail=f"Model '{request.model_id}' not found. Train a model first.")

    model = models[request.model_id]

    # Convert features to format expected by model
    # Map month to index
    months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    month_index = months.index(request.features.month) if request.features.month in months else 0

    # Map visitor type
    visitor_map = {"Returning_Visitor": 1, "New_Visitor": 0, "Other": 2}
    visitor_index = visitor_map.get(request.features.visitor_type, 0)

    # Create feature vector
    feature_vector = [[
        request.features.administrative,
        request.features.administrative_duration,
        request.features.informational,
        request.features.informational_duration,
        request.features.product_related,
        request.features.product_related_duration,
        request.features.bounce_rates,
        request.features.exit_rates,
        request.features.page_values,
        request.features.special_day,
        month_index,
        request.features.operating_systems,
        request.features.browser,
        request.features.region,
        request.features.traffic_type,
        visitor_index,
        1 if request.features.weekend else 0
    ]]

    # Make prediction
    prediction = model.predict(feature_vector)[0]

    return PredictionResponse(
        will_purchase=bool(prediction),
        model_id=request.model_id
    )

@router.get("/models")
async def list_models():
    """List all trained models"""
    return {
        "models": list(models.keys()),
        "count": len(models)
    }
