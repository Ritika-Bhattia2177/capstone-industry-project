import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, cancelAppointment, categorizeAppointments } from '../services/appointmentService';
import AppointmentCard from '../components/AppointmentCard';
import { showNotification } from '../components/NotificationContainer';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const queryClient = useQueryClient();

  // Fetch appointments with React Query
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      showNotification('✓ Appointment cancelled successfully!', 'success');
    },
    onError: (error) => {
      showNotification('Failed to cancel appointment: ' + error.message, 'error');
    }
  });

  const handleCancel = (appointment) => {
    if (window.confirm(`Are you sure you want to cancel your appointment with ${appointment.doctorName}?`)) {
      cancelMutation.mutate(appointment.id);
    }
  };

  const handleReschedule = (appointment) => {
    // Navigate to booking page with appointment data
    showNotification('ℹ️ Redirecting to booking page...', 'info');
  };

  if (isLoading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#7f8c8d' }}>
          Loading your appointments...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '30px' }}>
        <div style={{
          backgroundColor: '#fadbd8',
          padding: '20px',
          borderRadius: '8px',
          color: '#e74c3c',
          textAlign: 'center'
        }}>
          <h3>Error loading appointments</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const { upcoming, past } = categorizeAppointments(appointments || []);

  return (
    <div style={{ padding: '20px', maxWidth: '100%', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px', color: '#2c3e50' }}>My Appointments</h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Manage your healthcare appointments
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        marginBottom: '30px',
        maxWidth: '100%'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#ebf5fb',
          borderRadius: '10px',
          borderLeft: '4px solid #3498db'
        }}>
          <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
            Total Appointments
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#2c3e50' }}>
            {appointments?.length || 0}
          </div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#d5f4e6',
          borderRadius: '10px',
          borderLeft: '4px solid #27ae60'
        }}>
          <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
            Upcoming
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#27ae60' }}>
            {upcoming.length}
          </div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          borderLeft: '4px solid #95a5a6'
        }}>
          <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '5px' }}>
            Past
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#2c3e50' }}>
            {past.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '10px 30px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeTab === 'upcoming' ? '#3498db' : 'transparent',
              color: activeTab === 'upcoming' ? 'white' : '#7f8c8d',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📅 Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '10px 30px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeTab === 'past' ? '#3498db' : 'transparent',
              color: activeTab === 'past' ? 'white' : '#7f8c8d',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📁 Past ({past.length})
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {activeTab === 'upcoming' && (
        <div>
          {upcoming.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📅</div>
              <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                No Upcoming Appointments
              </h3>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                You don't have any scheduled appointments
              </p>
              <button
                onClick={() => window.location.href = '/search'}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Find a Doctor
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
              gap: '20px',
              maxWidth: '100%'
            }}>
              {upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancel}
                  onReschedule={handleReschedule}
                  isPast={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'past' && (
        <div>
          {past.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📁</div>
              <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                No Past Appointments
              </h3>
              <p style={{ color: '#7f8c8d' }}>
                Your appointment history will appear here
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
              gap: '20px',
              maxWidth: '100%'
            }}>
              {past.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancel}
                  onReschedule={handleReschedule}
                  isPast={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;
