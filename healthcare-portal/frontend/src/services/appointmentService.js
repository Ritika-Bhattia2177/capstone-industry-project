import { fetchAPI } from './api';

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
  
  const appointments = await fetchAPI(`/appointments?userId=${userId}`);
  
  // Sort by date (newest first)
  return appointments.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateB - dateA;
  });
};

export const createAppointment = async (appointmentData) => {
  return fetchAPI('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};

export const cancelAppointment = async (appointmentId) => {
  return fetchAPI(`/appointments/${appointmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'cancelled' }),
  });
};

export const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
  return fetchAPI(`/appointments/${appointmentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ date: newDate, time: newTime }),
  });
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
