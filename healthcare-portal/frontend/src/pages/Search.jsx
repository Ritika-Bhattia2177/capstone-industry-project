import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors, getSpecialties, getLocations } from '../services/doctorService';
import DoctorCard from '../components/DoctorCard';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const specialties = getSpecialties();
  const locations = getLocations();

  // React Query to fetch doctors
  const { data: doctors, isLoading, isError, error } = useQuery({
    queryKey: ['doctors', searchTerm, specialty, location],
    queryFn: () => fetchDoctors({ searchTerm, specialty, location }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleReset = () => {
    setSearchTerm('');
    setSpecialty('');
    setLocation('');
  };

  return (
    <div style={{ padding: '30px 50px', width: '100%' }}>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>Search Doctors</h1>
      
      {/* Search and Filters */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '15px'
        }}>
          {/* Search by Name */}
          <div>
            <label 
              htmlFor="search-doctor-name"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '600',
                color: '#34495e'
              }}>
              Search by Name
            </label>
            <input
              id="search-doctor-name"
              type="text"
              placeholder="Enter doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search doctors by name"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Filter by Specialty */}
          <div>
            <label 
              htmlFor="specialty-select"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '600',
                color: '#34495e'
              }}>
              Specialty
            </label>
            <select
              id="specialty-select"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              aria-label="Filter by specialty"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Filter by Location */}
          <div>
            <label 
              htmlFor="location-select"
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '600',
                color: '#34495e'
              }}>
              Location
            </label>
            <select
              id="location-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter by location"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
        >
          Clear Filters
        </button>
      </div>

      {/* Results Section */}
      <div>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px' }} role="status" aria-live="polite">
            <p style={{ fontSize: '18px', color: '#7f8c8d' }}>Loading doctors...</p>
          </div>
        )}

        {isError && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#e74c3c',
            backgroundColor: '#fadbd8',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px' }}>Error: {error.message}</p>
          </div>
        )}

        {doctors && doctors.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#7f8c8d' }}>
              No doctors found matching your criteria.
            </p>
          </div>
        )}

        {doctors && doctors.length > 0 && (
          <>
            <div style={{ 
              marginBottom: '20px',
              fontSize: '16px',
              color: '#7f8c8d'
            }}>
              Found <strong style={{ color: '#2c3e50' }}>{doctors.length}</strong> doctor{doctors.length !== 1 ? 's' : ''}
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
