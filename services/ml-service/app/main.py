from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import shap
import os
import re
import PyPDF2
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

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    # 1. Read PDF
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=400, detail="The PDF file appears to be empty or unscannable.")

    text_lower = text.lower()

    # 2. Comprehensive Skill Database
    skills_map = {
        "Python": r'\bpython\b',
        "Java": r'\bjava\b',
        "C++": r'\bc\+\+\b',
        "C": r'\bc\b',
        "JavaScript": r'\bjavascript\b|\bjs\b',
        "TypeScript": r'\btypescript\b|\bts\b',
        "React": r'\breact\b|\breact\.?js\b',
        "Node.js": r'\bnode\b|\bnode\.?js\b',
        "Express": r'\bexpress\b|\bexpress\.?js\b',
        "SQL": r'\bsql\b',
        "MySQL": r'\bmysql\b',
        "PostgreSQL": r'\bpostgres(ql)?\b',
        "MongoDB": r'\bmongodb\b|\bmongo\b',
        "Docker": r'\bdocker\b',
        "Kubernetes": r'\bkubernetes\b|\bk8s\b',
        "AWS": r'\baws\b|\bamazon web services\b',
        "Machine Learning": r'\bmachine learning\b|\bml\b',
        "Deep Learning": r'\bdeep learning\b|\bdl\b',
        "Data Structures & Algorithms": r'\bdsa\b|\bdata structures\b',
        "HTML/CSS": r'\bhtml\b|\bcss\b',
        "Git": r'\bgit\b|\bgithub\b',
        "Linux": r'\blinux\b|\bunix\b',
        "FastAPI": r'\bfastapi\b',
        "Django": r'\bdjango\b',
        "Flask": r'\bflask\b',
        "Pandas": r'\bpandas\b',
        "NumPy": r'\bnumpy\b',
        "Tailwind CSS": r'\btailwind\b',
        "Next.js": r'\bnext\.?js\b'
    }

    extracted_skills = []
    for skill_name, pattern in skills_map.items():
        if re.search(pattern, text_lower):
            extracted_skills.append(skill_name)

    # 3. Heuristic Extraction for Projects & Experience
    projects_count = max(len(re.findall(r'\b(project|projects|capstone)\b', text_lower)), 0)
    internships_count = max(len(re.findall(r'\b(intern|internship|trainee|apprentice)\b', text_lower)), 0)
    certifications_count = max(len(re.findall(r'\b(certified|certification|certificate|credential)\b', text_lower)), 0)

    # Normalized estimates
    estimated_projects = min(max(projects_count // 2, 1) if "project" in text_lower else 0, 8)
    estimated_internships = min(max(internships_count // 2, 1) if "intern" in text_lower else 0, 5)

    # 4. Extract Contact Info
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    phone_match = re.search(r'(?:\+?91[\-\s]?)?[6-9]\d{9}', text) or re.search(r'\+?\d{10,13}', text)

    email = email_match.group(0) if email_match else None
    phone = phone_match.group(0) if phone_match else None

    # 5. Extract Education Degree
    education_degree = None
    if re.search(r'\bm\.?tech\b|\bmaster of technology\b', text_lower):
        education_degree = "M.Tech"
    elif re.search(r'\bb\.?tech\b|\bbachelor of technology\b|\bb\.?e\b', text_lower):
        education_degree = "B.Tech"
    elif re.search(r'\bmca\b|\bmaster of computer applications\b', text_lower):
        education_degree = "MCA"
    elif re.search(r'\bbca\b|\bbachelor of computer applications\b', text_lower):
        education_degree = "BCA"
    elif re.search(r'\bb\.?sc\b|\bbachelor of science\b', text_lower):
        education_degree = "B.Sc"

    # 6. Extract CGPA/Percentage if mentioned
    cgpa_match = re.search(r'\b(?:cgpa|gpa|pointer)[\s:]*([0-9]\.[0-9]{1,2}|10(?:\.0)?)\b', text_lower)
    extracted_cgpa = float(cgpa_match.group(1)) if cgpa_match else None

    return {
        "success": True,
        "data": {
            "email": email,
            "phone": phone,
            "skills": extracted_skills,
            "education_degree": education_degree,
            "extracted_cgpa": extracted_cgpa,
            "projects_estimated": estimated_projects,
            "internships_estimated": estimated_internships,
            "certifications_estimated": certifications_count,
            "raw_text_length": len(text)
        }
    }


