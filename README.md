# InvoiceFlow

> A modern, minimalist invoice management platform for small businesses. Built with React, TypeScript, Node.js, and PostgreSQL.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

## Overview

InvoiceFlow is a comprehensive invoice management system designed for small businesses. It provides a clean, modern interface for creating invoices, managing clients, tracking payments, and generating professional PDFs. Built with a focus on accessibility, test-driven development, and modern best practices.

## Features

### Core Functionality

- **Multi-Step Invoice Builder** - Intuitive wizard for creating professional invoices
  - Client selection with autocomplete
  - Dynamic line item management
  - Real-time calculations (subtotal, tax, discounts, total)
  - Payment terms configuration (Net 15, 30, 45, 60)
  - Invoice preview before finalizing

- **Dashboard & Analytics**
  - Revenue trends by month (last 6 months)
  - Payment status breakdown (pie chart)
  - Key metrics: Total Outstanding, Paid This Month, Total Invoices, Overdue
  - Recent activity feed

- **Client Management**
  - Full CRUD operations
  - Client contact information
  - Outstanding balance tracking
  - Invoice history per client
  - Quick invoice creation from client profile

- **Invoice Management**
  - Sortable, filterable data table
  - Status filtering (Draft, Sent, Viewed, Paid, Overdue)
  - Date range filtering
  - Search by invoice number or client name
  - Status workflow management

- **PDF Generation**
  - Professional invoice PDFs
  - Download functionality
  - Formatted with company branding
  - Includes all invoice details and line items

### Advanced Features

- **Authentication** - JWT-based secure authentication
- **Accessibility** - WCAG 2.1 AA compliant
- **Responsive Design** - Mobile-first approach
- **Test-Driven Development** - Comprehensive test coverage
- **Real-time Updates** - Status changes without page refresh
- **Automatic Overdue Detection** - Invoices past due date auto-marked

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI v5** - Component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **React Router v6** - Navigation
- **Recharts** - Data visualization
- **jsPDF** - PDF generation
- **Vite** - Build tool
- **Jest + React Testing Library** - Testing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **express-validator** - Input validation
- **bcryptjs** - Password hashing
- **Jest** - Testing

### DevOps
- **GitHub Actions** - CI/CD
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/invoiceflow.git
   cd invoiceflow
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Backend (`.env`):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=invoiceflow
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```
   
   Frontend (`.env`):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Set up database**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   
   Or separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Login with: `demo@invoiceflow.com` / `password123`

## Project Structure

```
invoiceflow/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, migrations, seeding
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities (calculator, auth, status)
│   │   └── index.ts       # Express app entry point
│   ├── tests/             # Backend tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities (calculator, PDF)
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
├── .github/workflows/     # CI/CD pipelines
└── README.md
```

## Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

### Run All Tests
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices (with filters)
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice (supports partial updates)
- `DELETE /api/invoices/:id` - Delete invoice

## Design Philosophy

InvoiceFlow follows a **minimalist, modern design** inspired by YC AI startups:
- Clean black/white/grey color scheme
- Inter font family for modern typography
- Subtle shadows and borders
- Generous white space
- Smooth interactions and hover effects
- Mobile-first responsive design

## Accessibility

- WCAG 2.1 AA compliant
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader announcements
- Semantic HTML structure
- Color contrast compliance

## Invoice Status Workflow

```
Draft → Sent → Viewed → Paid
  ↓
Overdue (automatic if past due date)
```

Status can be updated:
- Via dropdown in invoice review step
- Using quick action buttons
- Automatically (overdue detection)

## Deployment

### Backend
The backend can be deployed to:
- Heroku
- Railway
- AWS EC2
- DigitalOcean

### Frontend
The frontend can be deployed to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

