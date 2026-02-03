// In-memory database for Vercel serverless functions
// Note: Data will reset on each deployment and function cold start

const initialData = {
  "doctors": [
    {
      "id": 1,
      "name": "Dr. Sarah Smith",
      "specialty": "Cardiology",
      "location": "New York",
      "experience": 15,
      "rating": 4.8,
      "image": "https://ui-avatars.com/api/?name=Sarah+Smith&background=0D8ABC&color=fff&size=200",
      "availability": [
        "Monday 9:00 AM - 5:00 PM",
        "Wednesday 9:00 AM - 5:00 PM",
        "Friday 9:00 AM - 2:00 PM"
      ],
      "nextAvailable": "2026-02-05",
      "consultationFee": 150,
      "education": "MD from Harvard Medical School",
      "about": "Specializing in cardiovascular diseases with over 15 years of experience."
    },
    {
      "id": 2,
      "name": "Dr. Michael Jones",
      "specialty": "Pediatrics",
      "location": "Los Angeles",
      "experience": 12,
      "rating": 4.9,
      "image": "https://ui-avatars.com/api/?name=Michael+Jones&background=27AE60&color=fff&size=200",
      "availability": [
        "Tuesday 10:00 AM - 6:00 PM",
        "Thursday 10:00 AM - 6:00 PM"
      ],
      "nextAvailable": "2026-02-04",
      "consultationFee": 120,
      "education": "MD from Stanford University",
      "about": "Expert in pediatric care, passionate about child health and development."
    },
    {
      "id": 3,
      "name": "Dr. Emily Wilson",
      "specialty": "General Practice",
      "location": "New York",
      "experience": 8,
      "rating": 4.7,
      "image": "https://ui-avatars.com/api/?name=Emily+Wilson&background=E74C3C&color=fff&size=200",
      "availability": [
        "Monday 8:00 AM - 4:00 PM",
        "Tuesday 8:00 AM - 4:00 PM",
        "Wednesday 8:00 AM - 4:00 PM"
      ],
      "nextAvailable": "2026-02-03",
      "consultationFee": 100,
      "education": "MD from Johns Hopkins University",
      "about": "Primary care physician focused on preventive medicine and wellness."
    },
    {
      "id": 4,
      "name": "Dr. James Brown",
      "specialty": "Dermatology",
      "location": "Chicago",
      "experience": 20,
      "rating": 4.9,
      "image": "https://ui-avatars.com/api/?name=James+Brown&background=9B59B6&color=fff&size=200",
      "availability": [
        "Monday 1:00 PM - 7:00 PM",
        "Friday 1:00 PM - 7:00 PM"
      ],
      "nextAvailable": "2026-02-06",
      "consultationFee": 180,
      "education": "MD from Yale School of Medicine",
      "about": "Board-certified dermatologist specializing in skin conditions and cosmetic procedures."
    },
    {
      "id": 5,
      "name": "Dr. Lisa Martinez",
      "specialty": "Orthopedics",
      "location": "Los Angeles",
      "experience": 18,
      "rating": 4.8,
      "image": "https://ui-avatars.com/api/?name=Lisa+Martinez&background=F39C12&color=fff&size=200",
      "availability": [
        "Wednesday 9:00 AM - 5:00 PM",
        "Thursday 9:00 AM - 5:00 PM"
      ],
      "nextAvailable": "2026-02-05",
      "consultationFee": 160,
      "education": "MD from Columbia University",
      "about": "Orthopedic surgeon with expertise in sports medicine and joint replacement."
    },
    {
      "id": 6,
      "name": "Dr. Robert Taylor",
      "specialty": "Cardiology",
      "location": "Chicago",
      "experience": 22,
      "rating": 4.9,
      "image": "https://ui-avatars.com/api/?name=Robert+Taylor&background=16A085&color=fff&size=200",
      "availability": [
        "Tuesday 8:00 AM - 3:00 PM",
        "Thursday 8:00 AM - 3:00 PM"
      ],
      "nextAvailable": "2026-02-04",
      "consultationFee": 170,
      "education": "MD from University of Pennsylvania",
      "about": "Senior cardiologist specializing in interventional cardiology and heart disease."
    },
    {
      "id": 7,
      "name": "Dr. Jennifer Davis",
      "specialty": "Pediatrics",
      "location": "New York",
      "experience": 10,
      "rating": 4.7,
      "image": "https://ui-avatars.com/api/?name=Jennifer+Davis&background=E67E22&color=fff&size=200",
      "availability": [
        "Monday 10:00 AM - 6:00 PM",
        "Wednesday 10:00 AM - 6:00 PM",
        "Friday 10:00 AM - 6:00 PM"
      ],
      "nextAvailable": "2026-02-03",
      "consultationFee": 130,
      "education": "MD from Duke University",
      "about": "Pediatrician dedicated to providing comprehensive care for children of all ages."
    },
    {
      "id": 8,
      "name": "Dr. David Anderson",
      "specialty": "General Practice",
      "location": "Los Angeles",
      "experience": 7,
      "rating": 4.6,
      "image": "https://ui-avatars.com/api/?name=David+Anderson&background=34495E&color=fff&size=200",
      "availability": [
        "Tuesday 9:00 AM - 5:00 PM",
        "Thursday 9:00 AM - 5:00 PM"
      ],
      "nextAvailable": "2026-02-04",
      "consultationFee": 90,
      "education": "MD from UCLA School of Medicine",
      "about": "Family medicine doctor committed to holistic patient care."
    }
  ],
  "appointments": [],
  "users": [],
  "profile": {}
};

// In-memory storage
let db = JSON.parse(JSON.stringify(initialData));

module.exports = {
  getDb: () => db,
  resetDb: () => {
    db = JSON.parse(JSON.stringify(initialData));
  }
};
