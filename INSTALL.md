# Installation Instructions

Due to npm configuration issues in some environments, follow these steps:

## Backend Installation

```bash
cd backend
npm install express cors dotenv pg bcryptjs jsonwebtoken express-validator helmet morgan
npm install --save-dev @types/express @types/node @types/cors @types/bcryptjs @types/jsonwebtoken @types/pg @types/morgan @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest ts-jest ts-node tsx typescript supertest @types/supertest
```

## Frontend Installation

```bash
cd frontend
npm install react react-dom react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form @hookform/resolvers zod @tanstack/react-query recharts date-fns jspdf axios
npm install --save-dev @types/react @types/react-dom @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitejs/plugin-react typescript vite eslint eslint-plugin-react-hooks eslint-plugin-react-refresh @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom ts-jest
```

## Root Installation

```bash
npm install concurrently
```

