from pydantic import BaseModel, Field

class StudentFeatures(BaseModel):
    cgpa: float = Field(..., ge=0, le=10, description="Cumulative Grade Point Average")
    dsa_score: float = Field(..., ge=0, le=100, description="Data Structures and Algorithms score")
    react_score: float = Field(..., ge=0, le=100, description="React / Frontend score")
    sql_score: float = Field(..., ge=0, le=100, description="SQL / Database score")
    aptitude_score: float = Field(..., ge=0, le=100, description="General Aptitude score")
    communication_score: float = Field(..., ge=0, le=100, description="Communication skills score")
    projects_count: int = Field(..., ge=0, description="Number of technical projects")
    internships_count: int = Field(..., ge=0, description="Number of internships completed")

class ReadinessResponse(BaseModel):
    readiness_score: float
    readiness_category: str
    shap_values: dict
    top_gaps: list[dict]
    recommendations: list[str]
