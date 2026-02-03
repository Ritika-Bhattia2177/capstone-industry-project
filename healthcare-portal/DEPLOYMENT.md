# Deployment Guide

## Project Structure

The project has been reorganized into:

```
healthcare-portal/
├── frontend/           # React application
│   ├── src/           # React components and pages
│   ├── api/           # Vercel serverless API functions
│   ├── public/        # Static assets
│   └── package.json
├── backend/           # Development backend
│   ├── api/          # API logic (synced to frontend/api)
│   ├── db.json       # Development database
│   └── server.js     # JSON Server
└── package.json      # Root scripts
```

## Fixed Issues

✅ **404 API Error Fixed**: 
- Added user authentication data to `api/data.js`
- Implemented proper request body parsing for Vercel serverless functions
- Added query parameter filtering for GET requests (e.g., `?email=user@email.com`)

✅ **Project Organization**:
- Separated frontend and backend into distinct folders
- Each folder has its own dependencies
- API functions are copied to frontend for Vercel deployment

## Development

### Install Dependencies
```bash
# From root directory
npm run install:all

# Or individually
npm run install:frontend
npm run install:backend
```

### Run Development Servers
```bash
# Run both (from root)
npm run dev

# Or individually
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3001
```

## Deployment to Vercel

### Method 1: From Root (Recommended)
```bash
npm run deploy
```

### Method 2: From Frontend Directory
```bash
cd frontend
vercel --prod
```

### Environment Variables
Create `.env.local` in frontend folder (optional):
```
VITE_API_URL=/api
```

## API Endpoints

All API routes are available at `/api/*`:

- `GET /api/users?email=<email>` - Find user by email
- `POST /api/users` - Create new user
- `GET /api/doctors` - Get all doctors
- `GET /api/appointments` - Get appointments
- And more...

## Current Deployment

🚀 **Production URL**: https://frontend-lemon-ten-90.vercel.app

## Testing the Fix

1. Visit the deployed site
2. Try signing up with a new email
3. The 404 error should be resolved
4. User should be created and logged in successfully

## Notes

- Backend API functions in `backend/api/` are synced to `frontend/api/` for deployment
- Changes to API logic should be made in `backend/api/` and copied to `frontend/api/`
- The `users` array now has initial data and properly handles POST requests
- Body parsing is now async to work with Vercel serverless functions
