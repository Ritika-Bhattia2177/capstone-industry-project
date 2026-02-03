import { useReducer, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createAppointment } from '../services/appointmentService';
import ProgressIndicator from '../components/ProgressIndicator';
import Step1SelectDoctor from '../components/booking/Step1SelectDoctor';
import Step2DateTime from '../components/booking/Step2DateTime';
import Step3PatientInfo from '../components/booking/Step3PatientInfo';

// Reducer for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return { ...state, ...action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 3) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case 'RESET_FORM':
      return action.payload;
    default:
      return state;
  }
};

const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const preselectedDoctor = location.state?.doctor;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialState = {
    currentStep: 1,
    selectedDoctor: preselectedDoctor || null,
    appointmentDate: '',
    appointmentTime: '',
    patientInfo: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      reason: '',
      notes: ''
    }
  };

  const [formData, dispatch] = useReducer(formReducer, initialState);

  const setFormData = (data) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
  };

  const handleNext = () => {
    // Validation for each step
    if (formData.currentStep === 1 && !formData.selectedDoctor) {
      alert('Please select a doctor to continue');
      return;
    }
    if (formData.currentStep === 2 && (!formData.appointmentDate || !formData.appointmentTime)) {
      alert('Please select both date and time to continue');
      return;
    }
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Step 3
    const { fullName, email, phone, dateOfBirth, gender, address, reason } = formData.patientInfo;
    if (!fullName || !email || !phone || !dateOfBirth || !gender || !address || !reason) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create appointment object
      const appointmentData = {
        userId: user?.id || 1,
        doctorId: formData.selectedDoctor.id,
        doctorName: formData.selectedDoctor.name,
        doctorSpecialty: formData.selectedDoctor.specialty,
        doctorImage: formData.selectedDoctor.image,
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        status: 'scheduled',
        patientInfo: formData.patientInfo,
        createdAt: new Date().toISOString()
      };

      // Save to backend
      await createAppointment(appointmentData);
      
      alert('🎉 Appointment booked successfully!\n\n' +
        `Doctor: ${formData.selectedDoctor.name}\n` +
        `Date: ${new Date(formData.appointmentDate).toLocaleDateString()}\n` +
        `Time: ${formData.appointmentTime}\n` +
        `Patient: ${formData.patientInfo.fullName}`
      );
      
      // Navigate to appointments page
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Select Doctor', 'Date & Time', 'Patient Info'];

  return (
    <div style={{ 
      padding: '30px 50px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minHeight: '600px'
    }}>
      <h1 style={{ marginBottom: '10px', color: '#2c3e50' }}>Book Appointment</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Complete the {steps.length}-step process to book your appointment
      </p>

      {/* Progress Indicator */}
      <ProgressIndicator 
        currentStep={formData.currentStep} 
        totalSteps={3}
        steps={steps}
      />

      {/* Form Steps */}
      <form onSubmit={handleSubmit}>
        <div style={{ minHeight: '400px', marginBottom: '30px' }}>
          {formData.currentStep === 1 && (
            <Step1SelectDoctor formData={formData} setFormData={setFormData} />
          )}
          
          {formData.currentStep === 2 && (
            <Step2DateTime formData={formData} setFormData={setFormData} />
          )}
          
          {formData.currentStep === 3 && (
            <Step3PatientInfo formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          paddingTop: '20px',
          borderTop: '2px solid #ecf0f1'
        }}>
          <button
            type="button"
            onClick={handleBack}
            disabled={formData.currentStep === 1}
            style={{
              padding: '12px 30px',
              backgroundColor: formData.currentStep === 1 ? '#ecf0f1' : '#95a5a6',
              color: formData.currentStep === 1 ? '#7f8c8d' : 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: formData.currentStep === 1 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (formData.currentStep !== 1) e.target.style.backgroundColor = '#7f8c8d';
            }}
            onMouseLeave={(e) => {
              if (formData.currentStep !== 1) e.target.style.backgroundColor = '#95a5a6';
            }}
          >
            ← Back
          </button>

          {formData.currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: '12px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 30px',
                backgroundColor: isSubmitting ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.target.style.backgroundColor = '#229954';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.target.style.backgroundColor = '#27ae60';
              }}
            >
              {isSubmitting ? 'Booking...' : '✓ Confirm Booking'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Book;
