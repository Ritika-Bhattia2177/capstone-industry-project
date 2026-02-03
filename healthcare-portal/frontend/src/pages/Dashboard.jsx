import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAppointments, categorizeAppointments } from '../services/appointmentService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch appointments to show next appointment
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    staleTime: 2 * 60 * 1000,
  });

  const { upcoming } = categorizeAppointments(appointments || []);
  const nextAppointment = upcoming.length > 0 ? upcoming[0] : null;

  const healthTips = [
    {
      id: 1,
      icon: '💧',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily to maintain optimal health.',
      color: '#3498db'
    },
    {
      id: 2,
      icon: '🏃',
      title: 'Exercise Regularly',
      description: 'Aim for 30 minutes of moderate exercise at least 5 days a week.',
      color: '#e74c3c'
    },
    {
      id: 3,
      icon: '🥗',
      title: 'Eat Balanced Diet',
      description: 'Include fruits, vegetables, proteins, and whole grains in your meals.',
      color: '#27ae60'
    },
    {
      id: 4,
      icon: '😴',
      title: 'Get Enough Sleep',
      description: 'Adults should aim for 7-9 hours of quality sleep each night.',
      color: '#9b59b6'
    },
    {
      id: 5,
      icon: '🧘',
      title: 'Manage Stress',
      description: 'Practice meditation, yoga, or deep breathing to reduce stress levels.',
      color: '#f39c12'
    },
    {
      id: 6,
      icon: '🩺',
      title: 'Regular Checkups',
      description: 'Schedule annual health screenings and preventive care visits.',
      color: '#16a085'
    }
  ];

  const quickActions = [
    {
      id: 1,
      icon: '🔍',
      title: 'Find Doctors',
      description: 'Search for specialists by location and specialty',
      link: '/search',
      color: '#3498db',
      bgColor: '#ebf5fb'
    },
    {
      id: 2,
      icon: '📅',
      title: 'Book Appointment',
      description: 'Schedule a visit with your preferred doctor',
      link: '/book',
      color: '#27ae60',
      bgColor: '#d5f4e6'
    },
    {
      id: 3,
      icon: '📋',
      title: 'My Appointments',
      description: 'View and manage your upcoming appointments',
      link: '/appointments',
      color: '#e74c3c',
      bgColor: '#fadbd8'
    },
    {
      id: 4,
      icon: '👤',
      title: 'My Profile',
      description: 'Update your personal and health information',
      link: '/profile',
      color: '#9b59b6',
      bgColor: '#f4ecf7'
    }
  ];

  return (
    <div style={{ padding: '30px 50px', width: '100%' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '10px', 
          color: '#2c3e50',
          fontWeight: '700'
        }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          Here's an overview of your healthcare dashboard
        </p>
      </div>

      {/* Next Appointment Summary */}
      {isLoading ? (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#7f8c8d' }}>Loading your appointments...</p>
        </div>
      ) : nextAppointment ? (
        <div style={{
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #3498db'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🏥</span>
            <h2 style={{ 
              fontSize: '22px', 
              color: '#2c3e50', 
              margin: 0,
              fontWeight: '600'
            }}>
              Your Next Appointment
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr auto',
            gap: '20px',
            alignItems: 'center'
          }}>
            <img
              src={nextAppointment.doctorImage}
              alt={nextAppointment.doctorName}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            
            <div>
              <h3 style={{ 
                margin: '0 0 5px 0', 
                fontSize: '20px', 
                color: '#2c3e50' 
              }}>
                {nextAppointment.doctorName}
              </h3>
              <p style={{ 
                margin: '0 0 8px 0', 
                color: '#7f8c8d',
                fontSize: '15px'
              }}>
                {nextAppointment.specialty} • {nextAppointment.location}
              </p>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                <span style={{ color: '#3498db', fontWeight: '600' }}>
                  📅 {new Date(nextAppointment.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span style={{ color: '#3498db', fontWeight: '600' }}>
                  🕐 {nextAppointment.time}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/appointments')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              View Details
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '25px',
          backgroundColor: '#fff3cd',
          borderRadius: '12px',
          marginBottom: '30px',
          borderLeft: '4px solid #f39c12'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>
            No Upcoming Appointments
          </h3>
          <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
            You don't have any scheduled appointments. Book one now!
          </p>
          <button
            onClick={() => navigate('/search')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Find a Doctor
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '20px', 
          color: '#2c3e50',
          fontWeight: '600'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {quickActions.map((action) => (
            <Link
              key={action.id}
              to={action.link}
              style={{
                textDecoration: 'none',
                padding: '25px',
                backgroundColor: action.bgColor,
                borderRadius: '12px',
                border: `2px solid ${action.color}20`,
                transition: 'all 0.2s',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>
                {action.icon}
              </div>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: action.color,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {action.title}
              </h3>
              <p style={{ 
                margin: 0, 
                color: '#7f8c8d',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div>
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '20px', 
          color: '#2c3e50',
          fontWeight: '600'
        }}>
          Health Tips 💡
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {healthTips.map((tip) => (
            <div
              key={tip.id}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${tip.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                {tip.icon}
              </div>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                color: '#2c3e50',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {tip.title}
              </h4>
              <p style={{ 
                margin: 0, 
                color: '#7f8c8d',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
