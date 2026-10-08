# Machine Learning Architecture

**Technology Stack:** Python, FastAPI, Scikit-learn, XGBoost, SHAP, Pandas.

## Architecture Overview
The ML Service is a standalone microservice. Decoupling ML from the Node.js backend allows for Python's rich data science ecosystem, independent scaling, and distinct deployment pipelines.

## ML Pipeline
```text
1. Data Ingestion: Fetch historical student data and assessment results.
2. Data Preprocessing: Handle missing values, normalize scores.
3. Feature Engineering: Create composite metrics (e.g., tech_avg, consistency_score).
4. Model Training: Train XGBoost / Random Forest models using Cross-Validation.
5. Model Evaluation: Track F1-Score, ROC-AUC, Precision, Recall.
6. Model Registry: Save the best model artifact (e.g., .pkl or .joblib).
7. Inference API (FastAPI): Serve predictions via REST.
```

## Folder Structure
```text
services/ml-service/
├── app/
│   ├── api/              # FastAPI endpoints (/predict, /explain)
│   ├── core/             # Config, security
│   ├── models/           # Pydantic schemas for request/response validation
│   ├── services/         # Inference logic, calling loaded models
│   ├── ml/
│   │   ├── preprocessing/# Data scaling, encoding
│   │   ├── training/     # Training scripts (run offline)
│   │   └── explain/      # SHAP logic
├── artifacts/            # Saved model files (.pkl)
├── notebooks/            # Jupyter notebooks for experimentation
└── tests/                # Pytest unit tests
```

## Explainability (SHAP)
Instead of a "black box" prediction, the `/predict` endpoint will return:
1. **Prediction Score**: e.g., 72/100
2. **Category**: "Moderately Ready"
3. **Explanation (SHAP)**:
   - Positive Contributors: `{"sql_score": +5, "projects": +3}`
   - Negative Contributors: `{"dsa_score": -4}`

## API Endpoints
- `POST /api/v1/predict`: Accepts a student's feature vector, returns readiness score and SHAP explanation.
- `GET /api/v1/health`: Service health check.
