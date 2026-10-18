from fastapi.testclient import TestClient
from app.main import app

def test_ml_prediction_endpoint():
    with TestClient(app) as client:
        payload = {
            "cgpa": 8.5,
            "dsa_score": 75.0,
            "react_score": 70.0,
            "sql_score": 65.0,
            "aptitude_score": 80.0,
            "communication_score": 75.0,
            "projects_count": 3,
            "internships_count": 1
        }
        response = client.post("/predict-readiness", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "readiness_score" in data
        assert 0.0 <= data["readiness_score"] <= 100.0
        assert "shap_values" in data
        assert "top_gaps" in data
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)

def test_empty_resume_handling():
    with TestClient(app) as client:
        # Sending invalid/empty payload to parse-resume should return 422 or 400
        response = client.post("/parse-resume")
        assert response.status_code in [400, 422]
