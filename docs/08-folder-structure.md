# Folder Structure

This project uses a monorepo structure to keep everything unified.

```text
placement-readiness-platform/
├── apps/
│   ├── web/                  # React + Vite frontend
│   └── api/                  # Node.js + Express backend
├── services/
│   └── ml-service/           # Python + FastAPI ML backend
├── packages/
│   ├── shared-types/         # TypeScript interfaces shared between web and api
│   ├── validation/           # Shared Zod validation schemas
│   └── ui/                   # (Optional) Shared UI components
├── database/
│   ├── migrations/           # DB schema changes
│   └── seeds/                # Demo data generation scripts
├── infrastructure/
│   ├── docker/               # Dockerfiles and configs
│   └── nginx/                # Reverse proxy config (if needed)
├── docs/                     # Architectural documentation (Current folder)
├── .github/
│   └── workflows/            # CI/CD pipelines
├── docker-compose.yml        # Local development orchestration
├── package.json              # Monorepo root package file
└── README.md                 # Main project overview
```
