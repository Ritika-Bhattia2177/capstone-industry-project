import { useState, useEffect } from 'react';

const Step2DateTime = ({ formData, setFormData }) => {
  const [selectedDate, setSelectedDate] = useState(formData.appointmentDate || '');
  const [selectedTime, setSelectedTime] = useState(formData.appointmentTime || '');

  const doctor = formData.selectedDoctor;

  // Generate next 14 days
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const availableDates = generateAvailableDates();

  useEffect(() => {
    setFormData({
      ...formData,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime
    });
  }, [selectedDate, selectedTime]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDateSelected = (date) => {
    return selectedDate === date.toISOString().split('T')[0];
  };

  return (
    <div role="region" aria-labelledby="step2-heading">
      <h2 id="step2-heading" style={{ marginBottom: '10px', color: '#2c3e50' }}>Choose Date & Time</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
        Booking with <strong>{doctor?.name}</strong> - {doctor?.specialty}
      </p>

      {/* Doctor Availability Info */}
      {doctor?.availability && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong style={{ color: '#856404' }}>Doctor's Availability:</strong>
          <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: '#856404' }}>
            {doctor.availability.map((slot, index) => (
              <li key={index} style={{ fontSize: '14px' }}>{slot}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Date Selection */}
      <div style={{ marginBottom: '30px' }}>
        <h3 id="date-selection-heading" style={{ fontSize: '16px', marginBottom: '15px', color: '#34495e' }}>
          📅 Select Date
        </h3>
        <div 
          role="list"
          aria-labelledby="date-selection-heading"
          style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px'
        }}>
          {availableDates.map((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            const isSelected = isDateSelected(date);
            
            return (
              <button
                key={index}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-label={`${formatDate(date)}`}
                onClick={() => setSelectedDate(dateString)}
                style={{
                  padding: '15px 10px',
                  border: isSelected ? '2px solid #3498db' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#ebf5fb' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  fontWeight: isSelected ? '600' : '400'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#3498db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#ddd';
                  }
                }}
              >
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', margin: '5px 0' }}>
                  {date.getDate()}
                </div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 id="time-selection-heading" style={{ fontSize: '16px', marginBottom: '15px', color: '#34495e' }}>
            🕐 Select Time
          </h3>
          <div 
            role="list"
            aria-labelledby="time-selection-heading"
            style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '10px'
          }}>
            {timeSlots.map((time, index) => {
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={index}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`Time slot ${time}`}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '12px',
                    border: isSelected ? '2px solid #3498db' : '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#ebf5fb' : 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: isSelected ? '600' : '400',
                    transition: 'all 0.2s',
                    color: isSelected ? '#3498db' : '#2c3e50'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.borderColor = '#3498db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#ddd';
                    }
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div style={{
          marginTop: '25px',
          padding: '15px',
          backgroundColor: '#d5f4e6',
          borderRadius: '8px',
          borderLeft: '4px solid #27ae60'
        }}>
          <strong style={{ color: '#27ae60' }}>Selected:</strong> {formatDate(new Date(selectedDate))} at {selectedTime}
        </div>
      )}
    </div>
  );
};

export default Step2DateTime;
