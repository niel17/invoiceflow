# InvoiceFlow

A modern invoice management platform I built to help small businesses handle their invoicing workflow. Think of it as a simpler, cleaner alternative to QuickBooks - focused on what actually matters for small teams.

## What I Built

This started as a project to showcase my full-stack skills, but I ended up building something I'd actually want to use. It's a complete invoice management system with a clean interface, solid architecture, and attention to detail.

### Core Features

**Invoice Builder** - A step-by-step wizard that makes creating invoices actually pleasant. You pick a client, add line items, set payment terms, and see everything calculated in real-time. No surprises when you hit "create."

**Dashboard** - Quick overview of what matters: how much you're owed, what got paid this month, what's overdue. Charts show revenue trends and payment status breakdowns so you can see the big picture at a glance.

**Client Management** - Keep track of all your clients in one place. See their invoice history, outstanding balances, and create new invoices right from their profile. Simple CRUD, but done right.

**Invoice List** - All your invoices in a sortable, filterable table. Filter by status, date range, or search by invoice number. Change statuses as invoices move through their lifecycle (draft → sent → viewed → paid).

**PDF Generation** - Download professional-looking invoice PDFs. Clean formatting, all the details, ready to send to clients.

### The Technical Stuff

I built this with a modern stack that I actually enjoy working with:

**Frontend:**
- React 18 with TypeScript for type safety
- Material-UI for components (but heavily customized)
- React Hook Form + Zod for form validation
- TanStack Query for data fetching and caching
- Recharts for the dashboard visualizations
- jsPDF for generating invoice PDFs

**Backend:**
- Node.js + Express with TypeScript
- PostgreSQL for the database
- JWT for authentication
- Proper validation and error handling

**Testing & Quality:**
- Jest + React Testing Library for tests
- ESLint + Prettier for code quality
- Test-driven development approach

**Accessibility:**
- WCAG 2.1 AA compliant
- Keyboard navigation throughout
- Screen reader support
- Proper ARIA labels

## Why I Built It This Way

I wanted to practice building something end-to-end, not just a tutorial project. So I focused on:

- **Clean code** - TypeScript everywhere, proper error handling, organized structure
- **User experience** - Modern, minimalist design that doesn't get in the way
- **Accessibility** - Everyone should be able to use this, so I made sure it works with screen readers and keyboards
- **Testing** - Wrote tests as I built features, not as an afterthought
- **Real-world features** - Things like automatic overdue detection, status workflows, and proper calculations

## Getting Started

If you want to run this locally:

```bash
# Backend
cd backend
npm install
# Set up your .env file with database credentials
npm run db:migrate
npm run db:seed
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:3001`.

## Project Structure

```
invoiceflow/
├── frontend/          # React + TypeScript frontend
├── backend/          # Node.js + Express API
└── README.md         # This file
```

Pretty straightforward. Frontend and backend are separate, which makes deployment easier and keeps things organized.

## What's Next

I'm always tweaking things. Currently thinking about:
- Email notifications when invoices are sent
- Recurring invoice templates
- Better mobile experience
- Export functionality for accounting software

## Tech Stack

- **Frontend:** React 18, TypeScript, Material-UI, React Hook Form, TanStack Query, Recharts, jsPDF
- **Backend:** Node.js, Express, TypeScript, PostgreSQL, JWT
- **Testing:** Jest, React Testing Library
- **Tools:** ESLint, Prettier, Vite

## License

MIT - feel free to use this however you want.

---

Built with React, TypeScript, and a lot of coffee.
