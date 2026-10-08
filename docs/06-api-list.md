# REST API List

All endpoints will be prefixed with `/api/v1`.

## Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and get JWT
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile

## Students & Profile
- `GET /students/profile` - Get student profile details
- `PUT /students/profile` - Update profile (education, etc.)
- `POST /students/skills` - Add/update self-reported skills
- `POST /students/projects` - Add a project
- `PUT /students/target-roles` - Update target job roles

## Assessments
- `GET /assessments` - List available assessments
- `GET /assessments/:id` - Get assessment details
- `POST /assessments/:id/start` - Start an attempt (starts timer)
- `POST /assessments/:id/submit` - Submit answers and calculate score
- `GET /assessments/history` - Get past attempt results

## Readiness & ML
- `GET /readiness/current` - Get the latest readiness score & SHAP explanation
- `POST /readiness/predict` - Trigger a new prediction (calls ML service)
- `GET /readiness/history` - Get readiness trend over time

## Skill Gap & Recommendations
- `GET /skill-gaps` - Analyze gap between current skills and target role
- `GET /recommendations` - Get personalized learning path based on skill gaps
- `POST /recommendations/:id/complete` - Mark a learning resource as completed

## Resume
- `POST /resumes/upload` - Upload PDF resume for analysis
- `GET /resumes/analysis` - Get ATS score and missing keywords

## Mentor / Admin
- `GET /admin/students` - List all students with filters
- `GET /admin/analytics/batch` - Get overall batch readiness statistics
- `GET /admin/analytics/skills` - Get most common skill gaps
