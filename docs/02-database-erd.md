# Database Architecture

The platform uses a relational database (MySQL) to ensure data integrity and complex querying capabilities.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS {
        int id PK
        string email
        string password_hash
        string role "STUDENT, MENTOR, ADMIN, SUPER_ADMIN"
        datetime created_at
    }
    
    STUDENTS {
        int id PK
        int user_id FK
        string first_name
        string last_name
        string phone
        string target_role_id FK
        float current_readiness_score
    }
    
    MENTORS {
        int id PK
        int user_id FK
        string department_id FK
    }
    
    JOB_ROLES {
        int id PK
        string title
        string description
    }
    
    SKILLS {
        int id PK
        string name
        string category "TECHNICAL, APTITUDE, COMMUNICATION"
    }
    
    ROLE_SKILLS {
        int role_id FK
        int skill_id FK
        int required_level "1-5"
    }
    
    STUDENT_SKILLS {
        int student_id FK
        int skill_id FK
        int current_level "1-5"
    }
    
    ASSESSMENTS {
        int id PK
        string title
        string category
        int time_limit
    }
    
    QUESTIONS {
        int id PK
        int assessment_id FK
        int skill_id FK
        string question_text
        string difficulty
    }
    
    ATTEMPTS {
        int id PK
        int student_id FK
        int assessment_id FK
        float total_score
        datetime submitted_at
    }
    
    READINESS_PREDICTIONS {
        int id PK
        int student_id FK
        int model_version_id FK
        float readiness_score
        string category "Not Ready, Moderately Ready, etc."
        json shap_explanation
        datetime created_at
    }
    
    RECOMMENDATIONS {
        int id PK
        int student_id FK
        string resource_title
        string resource_url
        string skill_gap_addressed
        string status "PENDING, COMPLETED"
    }

    USERS ||--o| STUDENTS : has
    USERS ||--o| MENTORS : has
    STUDENTS }|--|| JOB_ROLES : targets
    JOB_ROLES ||--|{ ROLE_SKILLS : requires
    SKILLS ||--|{ ROLE_SKILLS : belongs_to
    STUDENTS ||--|{ STUDENT_SKILLS : possesses
    SKILLS ||--|{ STUDENT_SKILLS : measured_by
    ASSESSMENTS ||--|{ QUESTIONS : contains
    STUDENTS ||--|{ ATTEMPTS : takes
    ASSESSMENTS ||--|{ ATTEMPTS : records
    STUDENTS ||--|{ READINESS_PREDICTIONS : receives
    STUDENTS ||--|{ RECOMMENDATIONS : receives
```

## Key Design Principles
- **Normalization**: Tables are normalized to 3NF to avoid data redundancy.
- **Role-Based Users**: A single `users` table handles authentication, while role-specific details are in `students`, `mentors`, etc.
- **Historical Tracking**: Predictions, assessments, and recommendations are timestamped to track progress over time.
- **JSON Storage**: SHAP explanations from the ML model are stored as JSON in the database for flexibility since feature importance varies per prediction.
