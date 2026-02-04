const AppointmentCard = ({ appointment, onCancel, onReschedule, isPast = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#d5f4e6', color: '#27ae60', border: '#27ae60' };
      case 'pending':
        return { bg: '#fff3cd', color: '#f39c12', border: '#f39c12' };
      case 'completed':
        return { bg: '#d6eaf8', color: '#3498db', border: '#3498db' };
      case 'cancelled':
        return { bg: '#fadbd8', color: '#e74c3c', border: '#e74c3c' };
      default:
        return { bg: '#ecf0f1', color: '#95a5a6', border: '#95a5a6' };
    }
  };

  const statusStyle = getStatusColor(appointment.status);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = !isPast;

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      opacity: appointment.status === 'cancelled' ? 0.7 : 1,
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    }}>
      
      {/* Header with Doctor Info */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <img
          src={appointment.doctorImage}
          alt={appointment.doctorName}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#2c3e50' }}>
            {appointment.doctorName}
          </h3>
          <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '14px' }}>
            {appointment.specialty}
          </p>
          <p style={{ margin: '0', color: '#95a5a6', fontSize: '13px' }}>
            📍 {appointment.location}
          </p>
        </div>
        <div style={{
          padding: '5px 15px',
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          height: 'fit-content',
          textTransform: 'capitalize',
          border: `1px solid ${statusStyle.border}`
        }}>
          {appointment.status}
        </div>
      </div>

      {/* Appointment Details */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '3px' }}>
              📅 Date
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
              {formatDate(appointment.date)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '3px' }}>
              🕐 Time
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
              {appointment.time}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '3px' }}>
            📋 Reason
          </div>
          <div style={{ fontSize: '14px', color: '#2c3e50' }}>
            {appointment.reason}
          </div>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '3px' }}>
            💰 Consultation Fee
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#27ae60' }}>
            ${appointment.fee}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isUpcoming && appointment.status !== 'cancelled' && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onReschedule(appointment)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Reschedule
          </button>
          <button
            onClick={() => onCancel(appointment)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'white',
              color: '#e74c3c',
              border: '2px solid #e74c3c',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e74c3c';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#e74c3c';
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {appointment.status === 'completed' && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d6eaf8',
          color: '#2c3e50',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          ✓ Appointment Completed
        </div>
      )}

      {appointment.status === 'cancelled' && (
        <div style={{
          padding: '10px',
          backgroundColor: '#fadbd8',
          color: '#e74c3c',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          ✗ Appointment Cancelled
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
