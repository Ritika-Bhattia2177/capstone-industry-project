import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/book', { state: { doctor } });
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
        <img 
          src={doctor.image} 
          alt={doctor.name}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
            {doctor.name}
          </h3>
          <p style={{ margin: '5px 0', color: '#2c3e50', fontWeight: '500' }}>
            {doctor.specialty}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <span style={{ color: '#f39c12', fontSize: '18px' }}>★</span>
            <span style={{ fontWeight: 'bold' }}>{doctor.rating}</span>
            <span style={{ color: '#7f8c8d' }}>|</span>
            <span style={{ color: '#7f8c8d' }}>{doctor.experience} years exp.</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '15px' }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: '600', color: '#34495e' }}>📍 Location: </span>
          <span style={{ color: '#7f8c8d' }}>{doctor.location}</span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: '600', color: '#34495e' }}>💰 Fee: </span>
          <span style={{ color: '#27ae60', fontWeight: '600' }}>${doctor.consultationFee}</span>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontWeight: '600', color: '#34495e' }}>📅 Next Available: </span>
          <span style={{ color: '#e74c3c', fontWeight: '500' }}>
            {new Date(doctor.nextAvailable).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        <details style={{ marginBottom: '15px' }}>
          <summary style={{ 
            cursor: 'pointer', 
            fontWeight: '600', 
            color: '#34495e',
            userSelect: 'none'
          }}>
            📋 View Availability
          </summary>
          <ul style={{ 
            marginTop: '10px', 
            paddingLeft: '20px',
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            {doctor.availability.map((slot, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>{slot}</li>
            ))}
          </ul>
        </details>

        <button
          onClick={handleBookAppointment}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
