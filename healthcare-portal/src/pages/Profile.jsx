import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProfileData } from '../services/profileService';
import VitalsChart from '../components/VitalsChart';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfileData,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>Loading profile...</p>
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
          color: '#e74c3c'
        }}>
          Error loading profile data
        </div>
      </div>
    );
  }

  const { personalInfo, medicalSummary, labResults, vitals } = profileData;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'controlled':
      case 'managed':
        return { bg: '#d5f4e6', color: '#27ae60' };
      case 'high':
      case 'elevated':
        return { bg: '#fadbd8', color: '#e74c3c' };
      case 'low':
        return { bg: '#fff3cd', color: '#f39c12' };
      default:
        return { bg: '#f8f9fa', color: '#7f8c8d' };
    }
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: '#f39c12' };
    if (bmi < 25) return { status: 'Normal', color: '#27ae60' };
    if (bmi < 30) return { status: 'Overweight', color: '#e67e22' };
    return { status: 'Obese', color: '#e74c3c' };
  };

  const bmiInfo = getBMIStatus(vitals.current.bmi.value);

  return (
    <div style={{ padding: '30px 50px', width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#2c3e50' }}>
          My Profile
        </h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
          View and manage your health information
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '4px',
          flexWrap: 'wrap'
        }}>
          {['overview', 'medical', 'labs', 'vitals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeTab === tab ? '#3498db' : 'transparent',
                color: activeTab === tab ? 'white' : '#7f8c8d',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Personal Information */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              👤 Personal Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <InfoItem label="Full Name" value={personalInfo.fullName} />
              <InfoItem label="Email" value={personalInfo.email} />
              <InfoItem label="Phone" value={personalInfo.phone} />
              <InfoItem label="Date of Birth" value={new Date(personalInfo.dateOfBirth).toLocaleDateString()} />
              <InfoItem label="Gender" value={personalInfo.gender} />
              <InfoItem label="Blood Type" value={personalInfo.bloodType} />
              <InfoItem label="Address" value={personalInfo.address} fullWidth />
            </div>
          </div>

          {/* Emergency Contact */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              🚨 Emergency Contact
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <InfoItem label="Name" value={personalInfo.emergencyContact.name} />
              <InfoItem label="Relationship" value={personalInfo.emergencyContact.relationship} />
              <InfoItem label="Phone" value={personalInfo.emergencyContact.phone} />
            </div>
          </div>
        </div>
      )}

      {/* Medical Summary Tab */}
      {activeTab === 'medical' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Conditions */}
          <MedicalSection
            title="🩺 Medical Conditions"
            icon="🩺"
            data={medicalSummary.conditions}
            renderItem={(condition) => (
              <div key={condition.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #3498db'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{condition.name}</h4>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <span>Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}</span>
                  <span style={{ 
                    marginLeft: '15px',
                    padding: '3px 10px',
                    backgroundColor: getStatusColor(condition.status).bg,
                    color: getStatusColor(condition.status).color,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {condition.status}
                  </span>
                </div>
              </div>
            )}
          />

          {/* Allergies */}
          <MedicalSection
            title="⚠️ Allergies"
            icon="⚠️"
            data={medicalSummary.allergies}
            renderItem={(allergy) => (
              <div key={allergy.id} style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                borderLeft: '4px solid #f39c12'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>{allergy.name}</h4>
                <div style={{ fontSize: '14px', color: '#856404' }}>
                  <div>Severity: <strong>{allergy.severity}</strong></div>
                  <div>Reaction: {allergy.reaction}</div>
                </div>
              </div>
            )}
          />

          {/* Current Medications */}
          <MedicalSection
            title="💊 Current Medications"
            icon="💊"
            data={medicalSummary.medications}
            renderItem={(med) => (
              <div key={med.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #27ae60'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{med.name}</h4>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <div>Dosage: <strong>{med.dosage}</strong> - {med.frequency}</div>
                  <div>Prescribed: {new Date(med.prescribedDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          />

          {/* Surgery History */}
          <MedicalSection
            title="🏥 Surgery History"
            icon="🏥"
            data={medicalSummary.surgeries}
            renderItem={(surgery) => (
              <div key={surgery.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #9b59b6'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{surgery.name}</h4>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <div>Date: {new Date(surgery.date).toLocaleDateString()}</div>
                  <div>Hospital: {surgery.hospital}</div>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Lab Results Tab */}
      {activeTab === 'labs' && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
            🧪 Lab Results
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Test</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Value</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Normal Range</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {labResults.map((result) => {
                  const statusStyle = getStatusColor(result.status);
                  return (
                    <tr key={result.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px', color: '#2c3e50', fontWeight: '500' }}>{result.test}</td>
                      <td style={{ padding: '12px', color: '#2c3e50' }}>
                        <strong>{result.value}</strong> {result.unit}
                      </td>
                      <td style={{ padding: '12px', color: '#7f8c8d' }}>{result.range} {result.unit}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {result.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#7f8c8d', fontSize: '14px' }}>
                        {new Date(result.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Current Vitals */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              ❤️ Current Vitals
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <VitalCard
                icon="🫀"
                label="Blood Pressure"
                value={`${vitals.current.bloodPressure.systolic}/${vitals.current.bloodPressure.diastolic}`}
                unit={vitals.current.bloodPressure.unit}
                color="#e74c3c"
              />
              <VitalCard
                icon="💓"
                label="Heart Rate"
                value={vitals.current.heartRate.value}
                unit={vitals.current.heartRate.unit}
                color="#3498db"
              />
              <VitalCard
                icon="🌡️"
                label="Temperature"
                value={vitals.current.temperature.value}
                unit={vitals.current.temperature.unit}
                color="#f39c12"
              />
              <VitalCard
                icon="⚖️"
                label="Weight"
                value={vitals.current.weight.value}
                unit={vitals.current.weight.unit}
                color="#27ae60"
              />
              <VitalCard
                icon="📏"
                label="Height"
                value={vitals.current.height.value}
                unit={vitals.current.height.unit}
                color="#9b59b6"
              />
              <VitalCard
                icon="📊"
                label="BMI"
                value={vitals.current.bmi.value}
                unit={bmiInfo.status}
                color={bmiInfo.color}
              />
              <VitalCard
                icon="🫁"
                label="Oxygen Saturation"
                value={vitals.current.oxygenSaturation.value}
                unit={vitals.current.oxygenSaturation.unit}
                color="#16a085"
              />
            </div>
          </div>

          {/* Vitals Trend Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              📈 Vitals Trends (Last 4 Months)
            </h2>
            <VitalsChart vitalsHistory={vitals.history} />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const InfoItem = ({ label, value, fullWidth = false }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '5px', fontWeight: '600' }}>
      {label}
    </div>
    <div style={{ fontSize: '15px', color: '#2c3e50' }}>
      {value}
    </div>
  </div>
);

const MedicalSection = ({ title, data, renderItem }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
      {title}
    </h2>
    <div style={{ display: 'grid', gap: '12px' }}>
      {data.length > 0 ? (
        data.map(renderItem)
      ) : (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>No records available</p>
      )}
    </div>
  </div>
);

const VitalCard = ({ icon, label, value, unit, color }) => (
  <div style={{
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    borderLeft: `4px solid ${color}`,
    transition: 'transform 0.2s',
    cursor: 'default'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '5px' }}>
      {label}
    </div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: color }}>
      {value}
    </div>
    <div style={{ fontSize: '13px', color: '#7f8c8d', marginTop: '3px' }}>
      {unit}
    </div>
  </div>
);

export default Profile;
