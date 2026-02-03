import { fetchAPI } from './api';

// Fetch doctors with optional filters
export const fetchDoctors = async ({ searchTerm = '', specialty = '', location = '' }) => {
  let endpoint = '/doctors';
  const params = new URLSearchParams();
  
  if (specialty) params.append('specialty', specialty);
  if (location) params.append('location', location);
  
  const queryString = params.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }
  
  const doctors = await fetchAPI(endpoint);
  
  // Client-side filtering for name search (JSON Server doesn't support nested search easily)
  if (searchTerm) {
    return doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return doctors;
};

export const fetchDoctorById = async (id) => {
  return fetchAPI(`/doctors/${id}`);
};

// Create a new doctor
export const createDoctor = async (doctorData) => {
  try {
    const newDoctor = await fetchAPI('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData)
    });
    return newDoctor;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

// Update doctor information
export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const updatedDoctor = await fetchAPI(`/doctors/${doctorId}`, {
      method: 'PATCH',
      body: JSON.stringify(doctorData)
    });
    return updatedDoctor;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (doctorId) => {
  try {
    await fetchAPI(`/doctors/${doctorId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};

export const getSpecialties = () => {
  return [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'General Practice',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry'
  ];
};

export const getLocations = () => {
  return [
    'Boston',
    'Cambridge',
    'Chicago',
    'Los Angeles',
    'New York',
    'San Francisco',
    'Seattle'
  ];
};
