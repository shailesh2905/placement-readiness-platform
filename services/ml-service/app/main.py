from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import shap
import os
from app.schemas import StudentFeatures, ReadinessResponse

app = FastAPI(
    title="Placement Readiness ML API",
    description="ML service with SHAP-based Explainable AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model globally
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'artifacts', 'readiness_model.pkl')
model = None

@app.on_event("startup")
def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}")

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/predict-readiness", response_model=ReadinessResponse)
def predict_readiness(features: StudentFeatures):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
        
    # Convert features to DataFrame
    feature_dict = features.dict()
    df = pd.DataFrame([feature_dict])
    
    # 1. Predict Readiness Score
    pred = model.predict(df)[0]
    readiness_score = round(float(pred), 2)
    
    # Category
    if readiness_score >= 80:
        category = "Placement Ready"
    elif readiness_score >= 60:
        category = "Needs Refinement"
    else:
        category = "Needs Significant Preparation"
        
    # 2. Explainable AI with SHAP
    # Using TreeExplainer for RandomForest
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df)
    
    # Extract feature importance for this specific student
    # shap_values is an array for the single prediction
    sv = shap_values[0]
    
    feature_impacts = {}
    for i, col in enumerate(df.columns):
        feature_impacts[col] = float(sv[i])
        
    # 3. Identify Top Gaps (features pushing the score down the most)
    sorted_impacts = sorted(feature_impacts.items(), key=lambda x: x[1])
    top_gaps = []
    
    for feature_name, impact in sorted_impacts:
        if impact < 0: # Negative impact means it's a gap lowering the score
            top_gaps.append({
                "feature": feature_name,
                "impact_score": round(impact, 2),
                "current_value": feature_dict[feature_name]
            })
            
    # Limit to top 3 gaps
    top_gaps = top_gaps[:3]
    
    # 4. Generate AI Recommendations based on gaps
    recommendations = []
    for gap in top_gaps:
        feature = gap["feature"]
        val = gap["current_value"]
        if feature == 'dsa_score':
            recommendations.append(f"Your DSA score is {val}. Focus on solving medium/hard LeetCode problems, especially Trees and Dynamic Programming.")
        elif feature == 'react_score':
            recommendations.append(f"Your React score is {val}. Build an end-to-end project using React Hooks and state management.")
        elif feature == 'sql_score':
            recommendations.append(f"Your SQL score is {val}. Practice complex joins and window functions.")
        elif feature == 'aptitude_score':
            recommendations.append(f"Your Aptitude score is {val}. Practice daily quantitative and logical reasoning questions.")
        elif feature == 'communication_score':
            recommendations.append(f"Your Communication score is {val}. Conduct mock HR interviews to improve fluency.")
        elif feature == 'projects_count':
            recommendations.append(f"You only have {val} projects. Add at least 2 full-stack projects to your resume.")
        elif feature == 'internships_count':
            recommendations.append(f"Consider applying for 1-2 month remote internships to gain industrial exposure.")
        elif feature == 'cgpa':
            recommendations.append(f"Your CGPA is {val}. Focus on maintaining or slightly improving it to clear initial ATS filters.")

    # Fallback positive recommendation
    if not recommendations:
        recommendations.append("You are doing great! Keep practicing mock interviews to maintain your readiness.")

    return {
        "readiness_score": readiness_score,
        "readiness_category": category,
        "shap_values": feature_impacts,
        "top_gaps": top_gaps,
        "recommendations": recommendations
    }
