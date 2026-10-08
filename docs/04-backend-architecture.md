# Backend Architecture

**Technology Stack:** Node.js, Express, TypeScript, MySQL (Prisma or TypeORM), JWT, BullMQ, Redis.

## Architecture Pattern
We will use a **Layered Architecture** (Controller-Service-Repository) to separate concerns and make the codebase highly testable.

## Folder Structure
```text
apps/api/
├── src/
│   ├── config/           # Environment variables, database connection
│   ├── controllers/      # HTTP request handling, response formatting
│   ├── services/         # Core business logic
│   ├── repositories/     # Database abstraction layer (queries)
│   ├── routes/           # Express route definitions
│   ├── middleware/       # Auth, error handling, validation
│   ├── models/           # DB schemas / ORM entities
│   ├── validators/       # Zod schemas for request payload validation
│   ├── jobs/             # BullMQ background job processors
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions, loggers
```

## Layer Responsibilities
1. **Routes**: Maps HTTP verbs and endpoints to specific controllers. Applies route-level middleware.
2. **Controllers**: Extracts data from requests (body, params, query), passes it to the Service layer, and formats the HTTP response (status codes, JSON payload). *No business logic here.*
3. **Services**: Contains the core business rules. Example: When calculating a skill gap, the service fetches current skills from the repo, fetches target skills from the repo, calculates the difference, and calls the repo to save the result.
4. **Repositories**: The only layer that interacts directly with the database. Makes swapping the DB or ORM easier in the future.

## Error Handling
A centralized global error handling middleware will catch all exceptions and format them into a consistent JSON response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```
