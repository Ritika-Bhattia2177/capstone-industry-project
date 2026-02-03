import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Step3PatientInfo = ({ formData, setFormData }) => {
  const { user } = useAuth();

  const [patientInfo, setPatientInfo] = useState({
    fullName: formData.patientInfo?.fullName || user?.name || '',
    email: formData.patientInfo?.email || user?.email || '',
    phone: formData.patientInfo?.phone || '',
    dateOfBirth: formData.patientInfo?.dateOfBirth || '',
    gender: formData.patientInfo?.gender || '',
    address: formData.patientInfo?.address || '',
    reason: formData.patientInfo?.reason || '',
    notes: formData.patientInfo?.notes || ''
  });

  useEffect(() => {
    setFormData({
      ...formData,
      patientInfo
    });
  }, [patientInfo]);

  const handleChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };

  const doctor = formData.selectedDoctor;
  const appointmentDate = formData.appointmentDate 
    ? new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div role="region" aria-labelledby="step3-heading">
      <h2 id="step3-heading" style={{ marginBottom: '10px', color: '#2c3e50' }}>Patient Information</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
        Please provide your information to complete the booking
      </p>

      {/* Appointment Summary */}
      <div style={{
        backgroundColor: '#ebf5fb',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
        borderLeft: '4px solid #3498db'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Appointment Summary</h4>
        <div style={{ fontSize: '14px', color: '#34495e' }}>
          <p style={{ margin: '5px 0' }}><strong>Doctor:</strong> {doctor?.name}</p>
          <p style={{ margin: '5px 0' }}><strong>Specialty:</strong> {doctor?.specialty}</p>
          <p style={{ margin: '5px 0' }}><strong>Date:</strong> {appointmentDate}</p>
          <p style={{ margin: '5px 0' }}><strong>Time:</strong> {formData.appointmentTime}</p>
          <p style={{ margin: '5px 0' }}><strong>Fee:</strong> ${doctor?.consultationFee}</p>
        </div>
      </div>

      {/* Patient Form */}
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label 
              htmlFor="fullName-input"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '600',
                color: '#34495e',
                fontSize: '14px'
              }}>
              Full Name *
            </label>
            <input
              id="fullName-input"
              type="text"
              name="fullName"
              value={patientInfo.fullName}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Full name"
              placeholder="Enter your full name"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="email-input-patient"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '600',
                color: '#34495e',
                fontSize: '14px'
              }}>
              Email *
            </label>
            <input
              id="email-input-patient"
              type="email"
              name="email"
              value={patientInfo.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-label="Email address"
              placeholder="Enter your email"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#34495e',
              fontSize: '14px'
            }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={patientInfo.phone}
              onChange={handleChange}
              required
              placeholder="(555) 123-4567"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#34495e',
              fontSize: '14px'
            }}>
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={patientInfo.dateOfBirth}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600',
            color: '#34495e',
            fontSize: '14px'
          }}>
            Gender *
          </label>
          <select
            name="gender"
            value={patientInfo.gender}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600',
            color: '#34495e',
            fontSize: '14px'
          }}>
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={patientInfo.address}
            onChange={handleChange}
            required
            placeholder="123 Main St, City, State ZIP"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600',
            color: '#34495e',
            fontSize: '14px'
          }}>
            Reason for Visit *
          </label>
          <input
            type="text"
            name="reason"
            value={patientInfo.reason}
            onChange={handleChange}
            required
            placeholder="e.g., Annual checkup, Follow-up visit"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600',
            color: '#34495e',
            fontSize: '14px'
          }}>
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={patientInfo.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Any additional information the doctor should know..."
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3PatientInfo;
