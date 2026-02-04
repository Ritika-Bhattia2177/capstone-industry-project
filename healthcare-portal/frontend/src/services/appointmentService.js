import { fetchAPI } from './api';
import { 
  getLocalBookedAppointments, 
  saveLocalBookedAppointment, 
  updateLocalAppointment, 
  deleteLocalAppointment,
  mergeAppointments 
} from './localStorageService';

export const fetchAppointments = async (userId) => {
  // If no userId provided, fetch from localStorage
  if (!userId) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userId = user?.id || 1;
      } else {
        userId = 1; // Default fallback
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      userId = 1; // Default fallback
    }
  }
  
  // Ensure userId is a number
  userId = Number(userId) || 1;
  
  try {
    // Fetch from API
    const remoteAppointments = await fetchAPI(`/appointments?userId=${userId}`);
    
    // Get local appointments
    const localAppointments = getLocalBookedAppointments();
    
    // Merge remote and local data
    const allAppointments = mergeAppointments(remoteAppointments, localAppointments);
    
    // Sort by date (newest first)
    return allAppointments.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // If API fails, return local appointments
    const localAppointments = getLocalBookedAppointments();
    return localAppointments.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB - dateA;
    });
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    // Try to save to API
    const result = await fetchAPI('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
    
    // Also save to localStorage
    saveLocalBookedAppointment(result);
    
    return result;
  } catch (error) {
    console.error('API error, saving to localStorage only:', error);
    // If API fails, save to localStorage with generated ID
    const newAppointment = {
      ...appointmentData,
      id: Date.now(), // Generate unique ID
      createdAt: new Date().toISOString()
    };
    saveLocalBookedAppointment(newAppointment);
    return newAppointment;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    // Try to update via API
    const result = await fetchAPI(`/appointments/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
    
    // Also update in localStorage
    updateLocalAppointment(appointmentId, { status: 'cancelled' });
    
    return result;
  } catch (error) {
    console.error('API error, updating localStorage only:', error);
    // If API fails, update localStorage
    updateLocalAppointment(appointmentId, { status: 'cancelled' });
    return { id: appointmentId, status: 'cancelled' };
  }
};

export const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
  try {
    // Try to update via API
    const result = await fetchAPI(`/appointments/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ date: newDate, time: newTime }),
    });
    
    // Also update in localStorage
    updateLocalAppointment(appointmentId, { date: newDate, time: newTime });
    
    return result;
  } catch (error) {
    console.error('API error, updating localStorage only:', error);
    // If API fails, update localStorage
    updateLocalAppointment(appointmentId, { date: newDate, time: newTime });
    return { id: appointmentId, date: newDate, time: newTime };
  }
};

// Helper function to categorize appointments
export const categorizeAppointments = (appointments) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcoming = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return (aptDate >= today && apt.status !== 'cancelled' && apt.status !== 'completed');
  });
  
  const past = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return (aptDate < today || apt.status === 'completed' || apt.status === 'cancelled');
  });
  
  // Sort upcoming: earliest first
  upcoming.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateA - dateB;
  });
  
  // Sort past: most recent first
  past.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateB - dateA;
  });
  
  return { upcoming, past };
};
