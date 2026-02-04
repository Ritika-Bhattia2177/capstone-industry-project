// Local storage service for data persistence
const STORAGE_KEYS = {
  APPOINTMENTS: 'healthcare_appointments',
  PROFILE: 'healthcare_profile',
  BOOKED_APPOINTMENTS: 'healthcare_booked_appointments'
};

// Get appointments from localStorage
export const getLocalAppointments = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading appointments from localStorage:', error);
    return null;
  }
};

// Save appointments to localStorage
export const saveLocalAppointments = (appointments) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return true;
  } catch (error) {
    console.error('Error saving appointments to localStorage:', error);
    return false;
  }
};

// Get booked appointments (user's own bookings)
export const getLocalBookedAppointments = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKED_APPOINTMENTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading booked appointments from localStorage:', error);
    return [];
  }
};

// Save booked appointment
export const saveLocalBookedAppointment = (appointment) => {
  try {
    const existing = getLocalBookedAppointments();
    const updated = [...existing, appointment];
    localStorage.setItem(STORAGE_KEYS.BOOKED_APPOINTMENTS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving booked appointment to localStorage:', error);
    return false;
  }
};

// Update appointment status (cancel, reschedule)
export const updateLocalAppointment = (appointmentId, updates) => {
  try {
    const appointments = getLocalBookedAppointments();
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, ...updates } : apt
    );
    localStorage.setItem(STORAGE_KEYS.BOOKED_APPOINTMENTS, JSON.stringify(updatedAppointments));
    return true;
  } catch (error) {
    console.error('Error updating appointment in localStorage:', error);
    return false;
  }
};

// Delete appointment
export const deleteLocalAppointment = (appointmentId) => {
  try {
    const appointments = getLocalBookedAppointments();
    const filtered = appointments.filter(apt => apt.id !== appointmentId);
    localStorage.setItem(STORAGE_KEYS.BOOKED_APPOINTMENTS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting appointment from localStorage:', error);
    return false;
  }
};

// Get profile from localStorage
export const getLocalProfile = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading profile from localStorage:', error);
    return null;
  }
};

// Save profile to localStorage
export const saveLocalProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
    return false;
  }
};

// Clear all local storage
export const clearLocalStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Merge local and remote data
export const mergeAppointments = (remoteAppointments, localAppointments) => {
  if (!localAppointments || localAppointments.length === 0) {
    return remoteAppointments;
  }
  
  // Create a map of remote appointments by ID
  const remoteMap = new Map(remoteAppointments.map(apt => [apt.id, apt]));
  
  // Add local appointments that don't exist in remote
  localAppointments.forEach(localApt => {
    if (!remoteMap.has(localApt.id)) {
      remoteAppointments.push(localApt);
    }
  });
  
  return remoteAppointments;
};
