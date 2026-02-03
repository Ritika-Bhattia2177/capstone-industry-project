# Healthcare Portal - API Setup

## JSON Server Mock API

This project uses JSON Server to provide a mock REST API for development.

### Starting the API

Run one of the following commands:

```bash
# Start API server only
npm run api

# Start both API and dev server
npm run dev:all
```

The API will run on: `http://localhost:3001`

### Available Endpoints

#### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors?specialty=Cardiology` - Filter by specialty
- `GET /doctors?location=New York` - Filter by location
- `GET /doctors/:id` - Get doctor by ID

#### Appointments
- `GET /appointments` - Get all appointments
- `GET /appointments?userId=1` - Get user's appointments
- `POST /appointments` - Create new appointment
- `PATCH /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

#### Profile
- `GET /profile` - Get user profile data
- `PATCH /profile` - Update profile data

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### Sample API Calls

```javascript
// Get all doctors
fetch('http://localhost:3001/doctors')
  .then(res => res.json())
  .then(data => console.log(data));

// Get appointments for user
fetch('http://localhost:3001/appointments?userId=1')
  .then(res => res.json())
  .then(data => console.log(data));

// Create new appointment
fetch('http://localhost:3001/appointments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    doctorId: 1,
    date: '2026-03-01',
    time: '10:00 AM',
    status: 'pending'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Data Structure

All mock data is stored in `db.json` and includes:
- **8 Doctors** with specialties, locations, ratings
- **9 Appointments** with various statuses
- **User Profile** with medical history, lab results, vitals
- **Lab Results** with normal ranges and status indicators
- **Vitals History** for trend tracking
