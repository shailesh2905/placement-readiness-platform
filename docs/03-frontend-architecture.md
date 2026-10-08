# Frontend Architecture

**Technology Stack:** React.js, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, React Hook Form, Zod, Recharts.

## Architecture Pattern
We will use a **Feature-Sliced Design** (FSD) inspired folder structure to keep the codebase modular and scalable.

## Folder Structure
```text
apps/web/
├── src/
│   ├── api/              # Axios instance and API client configurations
│   ├── assets/           # Static assets (images, fonts, global CSS)
│   ├── components/       # Global reusable UI components (Button, Card, Input)
│   ├── features/         # Feature-specific modules
│   │   ├── auth/         # Login, Register, JWT handling
│   │   ├── dashboard/    # Overview charts, quick stats
│   │   ├── profile/      # Student profile management
│   │   ├── assessments/  # Taking tests, viewing results
│   │   ├── readiness/    # ML Readiness score, SHAP explanations
│   │   ├── recommendations/# Learning paths, skill gaps
│   │   └── admin/        # Admin management tables
│   ├── hooks/            # Global custom React hooks
│   ├── layouts/          # Page layouts (SidebarLayout, AuthLayout)
│   ├── pages/            # Route components combining features
│   ├── store/            # Global Zustand stores (e.g., UI state, user session)
│   ├── types/            # Global TypeScript definitions
│   └── utils/            # Helper functions, formatting, constants
```

## State Management Strategy
1. **Server State (TanStack Query)**: Used for all API data fetching, caching, and background updates. This prevents the need to manually store API responses in global state.
2. **Client State (Zustand)**: Used for lightweight, truly global client state (e.g., sidebar toggles, theme, current user session info).
3. **Local State (React `useState`)**: Used for isolated component state (e.g., modal open/close, form input before submission).

## Styling Strategy
- **Tailwind CSS**: Utility-first CSS for rapid, consistent styling.
- **CSS Variables**: Define core brand colors in `index.css` for easy theming (light/dark mode).
- **Component Library**: Build custom components (don't rely entirely on a UI library) to ensure a unique, premium SaaS look.
