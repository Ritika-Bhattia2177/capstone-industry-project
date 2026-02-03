import { useQuery } from '@tanstack/react-query';
import { fetchDoctors, getSpecialties, getLocations } from '../../services/doctorService';
import { useState } from 'react';

const Step1SelectDoctor = ({ formData, setFormData }) => {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const specialties = getSpecialties();
  const locations = getLocations();

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', '', specialty, location],
    queryFn: () => fetchDoctors({ searchTerm: '', specialty, location }),
  });

  const handleSelectDoctor = (doctor) => {
    setFormData({ ...formData, selectedDoctor: doctor });
  };

  return (
    <div role="region" aria-labelledby="step1-heading">
      <h2 id="step1-heading" style={{ marginBottom: '20px', color: '#2c3e50' }}>Select a Doctor</h2>
      
      {/* Filters */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <label 
            htmlFor="specialty-filter"
            style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#34495e',
              fontSize: '14px'
            }}>
            Specialty
          </label>
          <select
            id="specialty-filter"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            aria-label="Filter doctors by specialty"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          >
            <option value="">All Specialties</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div>
          <label 
            htmlFor="location-filter"
            style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#34495e',
              fontSize: '14px'
            }}>
            Location
          </label>
          <select
            id="location-filter"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Filter doctors by location"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }} role="status" aria-live="polite">Loading doctors...</div>
      ) : (
        <div 
          role="list"
          aria-label="Available doctors"
          style={{ 
            display: 'grid',
            gap: '15px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '5px'
          }}>
          {doctors?.map((doctor) => (
            <div
              key={doctor.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectDoctor(doctor)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectDoctor(doctor);
                }
              }}
              aria-pressed={formData.selectedDoctor?.id === doctor.id}
              aria-label={`Select ${doctor.name}, ${doctor.specialty} in ${doctor.location}, fee $${doctor.consultationFee}`}
              style={{
                padding: '15px',
                border: formData.selectedDoctor?.id === doctor.id 
                  ? '3px solid #3498db' 
                  : '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: formData.selectedDoctor?.id === doctor.id 
                  ? '#ebf5fb' 
                  : 'white',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <img 
                src={doctor.image} 
                alt={doctor.name}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                  {doctor.name}
                </h4>
                <p style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>
                  {doctor.specialty} • {doctor.location}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#27ae60', fontWeight: '600' }}>
                  ${doctor.consultationFee} • ★ {doctor.rating}
                </p>
              </div>
              {formData.selectedDoctor?.id === doctor.id && (
                <div style={{ 
                  color: '#3498db', 
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {formData.selectedDoctor && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d5f4e6',
          borderRadius: '8px',
          borderLeft: '4px solid #27ae60'
        }}>
          <strong style={{ color: '#27ae60' }}>Selected:</strong> {formData.selectedDoctor.name} - {formData.selectedDoctor.specialty}
        </div>
      )}
    </div>
  );
};

export default Step1SelectDoctor;
