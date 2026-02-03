# Healthcare Portal

A modern healthcare management application with appointment booking, doctor search, and patient dashboard.

## Project Structure

```
healthcare-portal/
├── frontend/          # React + Vite frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json
├── backend/          # API and database
│   ├── api/         # Vercel serverless functions
│   ├── db.json      # Mock database
│   └── server.js    # Development server
└── package.json     # Root package manager
```

## Getting Started

### Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install individually
npm run install:frontend
npm run install:backend
```

### Development

```bash
# Run both frontend and backend
npm run dev

# Or run individually
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3001
```

### Build and Deploy

```bash
# Build frontend for production
npm run build:frontend

# Deploy to Vercel
npm run deploy
```

## Features

- **User Authentication**: Sign up and login functionality
- **Doctor Search**: Find doctors by specialty and location
- **Appointment Booking**: Book appointments with available doctors
- **Dashboard**: View upcoming appointments and health metrics
- **Profile Management**: Update personal and medical information
- **Health Charts**: Visualize vitals and health trends

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- TanStack Query
- Recharts

### Backend
- JSON Server (development)
- Vercel Serverless Functions (production)
- In-memory data storage

## Deployment

The application is configured for Vercel deployment:

1. Push changes to GitHub
2. Run `npm run deploy` or deploy through Vercel dashboard
3. Frontend is deployed with Vite
4. Backend API routes are handled by serverless functions

## API Endpoints

See [backend/API.md](backend/API.md) for complete API documentation.

## License

MIT
