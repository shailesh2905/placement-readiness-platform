# AI-Powered Placement Readiness & Skill Gap Recommendation Platform

A comprehensive, full-stack, production-ready AI SaaS platform designed for students, mentors, and placement cells. 

This platform evaluates placement readiness, identifies skill gaps, offers personalized recommendations, and provides rich analytics to track progress over time.

## Technology Stack

* **Frontend**: React (JS), Vite, Tailwind CSS, Zustand, TanStack Query, React Router, Recharts, Lucide React
* **Backend API**: Node.js, Express, JavaScript (ES modules)
* **ML Service**: Python, FastAPI, Scikit-Learn, XGBoost, SHAP
* **Database**: MySQL (planned)
* **Caching & Queue**: Redis, BullMQ (planned)

## Project Structure

* `/apps/web`: React Frontend application
* `/apps/api`: Express.js backend REST API
* `/services/ml-service`: Python FastAPI Machine Learning service for predictions and recommendations
* `/docs`: System architecture, database diagrams, and project documentation

## Quick Start

### Web Frontend
```bash
cd apps/web
npm install
npm run dev
```

### Backend API
```bash
cd apps/api
npm install
npm run dev
```

### ML Service
```bash
cd services/ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt # (Dependencies like fastapi, uvicorn, scikit-learn, xgboost, shap)
uvicorn app.main:app --reload
```
