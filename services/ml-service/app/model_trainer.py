import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    cgpa = np.random.uniform(5.0, 10.0, num_samples)
    dsa_score = np.random.uniform(0, 100, num_samples)
    react_score = np.random.uniform(0, 100, num_samples)
    sql_score = np.random.uniform(0, 100, num_samples)
    aptitude_score = np.random.uniform(0, 100, num_samples)
    communication_score = np.random.uniform(0, 100, num_samples)
    projects_count = np.random.randint(0, 5, num_samples)
    internships_count = np.random.randint(0, 3, num_samples)
    
    # Calculate readiness score based on weights
    readiness = (
        (cgpa / 10) * 15 +
        (dsa_score / 100) * 20 +
        (react_score / 100) * 15 +
        (sql_score / 100) * 10 +
        (aptitude_score / 100) * 15 +
        (communication_score / 100) * 10 +
        (projects_count / 5) * 10 +
        (internships_count / 3) * 5
    )
    
    # Add some noise
    noise = np.random.normal(0, 3, num_samples)
    readiness = np.clip(readiness + noise, 0, 100)
    
    data = pd.DataFrame({
        'cgpa': cgpa,
        'dsa_score': dsa_score,
        'react_score': react_score,
        'sql_score': sql_score,
        'aptitude_score': aptitude_score,
        'communication_score': communication_score,
        'projects_count': projects_count,
        'internships_count': internships_count,
        'readiness': readiness
    })
    
    return data

def train_and_save_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(2000)
    
    X = df.drop('readiness', axis=1)
    y = df['readiness']
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    artifacts_dir = os.path.join(os.path.dirname(__file__), '..', 'artifacts')
    os.makedirs(artifacts_dir, exist_ok=True)
    
    model_path = os.path.join(artifacts_dir, 'readiness_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
